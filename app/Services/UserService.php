<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    /**
     * Get all users with optional filtering
     */
    public function getUsers(Request $request): Collection
    {
        $query = User::withCount(['articles', 'publishedArticles']);

        // Search by name or email
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->input('status') === 'active');
        }

        // Filter by created date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    /**
     * Get paginated users for admin index
     */
    public function getPaginatedUsers(Request $request): LengthAwarePaginator
    {
        $query = User::withCount(['articles', 'publishedArticles']);

        // Apply same filters as getUsers method
        $this->applyFilters($query, $request);

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    /**
     * Apply common filters to user queries
     */
    private function applyFilters($query, Request $request): void
    {
        // Search by name or email
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->filled('role')) {
            $query->where('role', $request->input('role'));
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('is_active', $request->input('status') === 'active');
        }

        // Filter by created date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }
    }

    /**
     * Get user by ID with relationships
     */
    public function getUserById(int $id): User
    {
        return User::withCount(['articles', 'publishedArticles'])
                   ->with(['profilePicture', 'articles' => function ($query) {
                       $query->orderBy('created_at', 'desc')->limit(10);
                   }])
                   ->findOrFail($id);
    }

    /**
     * Create a new user
     */
    public function createUser(Request $request): User
    {
        $data = $this->validateUserData($request);

        // Hash the password
        $data['password'] = Hash::make($data['password']);

        // Set default values
        $data['is_active'] = $data['is_active'] ?? true;
        $data['email_verified_at'] = now();

        return DB::transaction(function () use ($data) {
            $user = User::create($data);

            // Log the activity if needed
            activity()
                ->causedBy(auth()->user())
                ->performedOn($user)
                ->withProperties(['action' => 'created'])
                ->log('User created');

            return $user;
        });
    }

    /**
     * Update an existing user
     */
    public function updateUser(Request $request, User $user): User
    {
        $data = $this->validateUserData($request, $user->id);

        // Only hash password if it's being changed
        if (isset($data['password']) && !empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        return DB::transaction(function () use ($user, $data) {
            $user->update($data);

            // Log the activity
            activity()
                ->causedBy(auth()->user())
                ->performedOn($user)
                ->withProperties(['action' => 'updated'])
                ->log('User updated');

            return $user->fresh();
        });
    }

    /**
     * Delete a user
     */
    public function deleteUser(User $user): bool
    {
        return DB::transaction(function () use ($user) {
            // Check if user has articles
            $articleCount = $user->articles()->count();

            if ($articleCount > 0) {
                throw new \Exception("Cannot delete user who has {$articleCount} articles. Please reassign or delete the articles first.");
            }

            // Delete profile picture if exists
            if ($user->profilePicture) {
                $user->profilePicture->delete();
            }

            $deleted = $user->delete();

            // Log the activity
            if ($deleted) {
                activity()
                    ->causedBy(auth()->user())
                    ->performedOn($user)
                    ->withProperties(['action' => 'deleted'])
                    ->log('User deleted');
            }

            return $deleted;
        });
    }

    /**
     * Toggle user active status
     */
    public function toggleUserStatus(User $user): User
    {
        $user->update(['is_active' => !$user->is_active]);

        activity()
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->withProperties([
                'action' => 'status_toggled',
                'new_status' => $user->is_active ? 'active' : 'inactive'
            ])
            ->log('User status toggled');

        return $user->fresh();
    }

    /**
     * Change user role
     */
    public function changeUserRole(User $user, string $newRole): User
    {
        // Validate the role
        if (!in_array($newRole, ['super_admin', 'admin', 'penulis', 'user'])) {
            throw new \InvalidArgumentException('Invalid role specified');
        }

        // Prevent users from demoting themselves from admin roles
        if (auth()->id() === $user->id && !auth()->user()->isSuperAdmin()) {
            throw new \Exception('You cannot change your own role unless you are a super admin');
        }

        $oldRole = $user->role;
        $user->update(['role' => $newRole]);

        activity()
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->withProperties([
                'action' => 'role_changed',
                'old_role' => $oldRole,
                'new_role' => $newRole
            ])
            ->log('User role changed');

        return $user->fresh();
    }

    /**
     * Get user options for dropdowns
     */
    public function getUserOptions(): array
    {
        return User::orderBy('name')
                  ->get(['id', 'name', 'email'])
                  ->map(function ($user) {
                      return [
                          'value' => $user->id,
                          'label' => $user->name,
                          'subtitle' => $user->email,
                      ];
                  })
                  ->toArray();
    }

    /**
     * Get user statistics
     */
    public function getUserStatistics(): array
    {
        $totalUsers = User::count();
        $activeUsers = User::active()->count();
        $inactiveUsers = User::inactive()->count();

        $roleStats = User::selectRaw('role, COUNT(*) as count')
                      ->groupBy('role')
                      ->get()
                      ->pluck('count', 'role')
                      ->toArray();

        $recentUsers = User::orderBy('created_at', 'desc')
                         ->limit(5)
                         ->get(['id', 'name', 'email', 'created_at'])
                         ->toArray();

        return [
            'total_users' => $totalUsers,
            'active_users' => $activeUsers,
            'inactive_users' => $inactiveUsers,
            'role_statistics' => $roleStats,
            'recent_users' => $recentUsers,
        ];
    }

    /**
     * Get available roles
     */
    public function getAvailableRoles(): array
    {
        return [
            ['value' => 'super_admin', 'label' => 'Super Admin', 'description' => 'Full access to all features'],
            ['value' => 'admin', 'label' => 'Administrator', 'description' => 'Can manage users and content'],
            ['value' => 'penulis', 'label' => 'Penulis', 'description' => 'Can create and manage articles'],
            ['value' => 'user', 'label' => 'User', 'description' => 'Limited access'],
        ];
    }

    /**
     * Validate user data
     */
    protected function validateUserData(Request $request, ?int $userId = null): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $userId,
            'role' => 'required|in:super_admin,admin,penulis,user',
            'bio' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
        ];

        // Only require password for new users or when changing password
        if (!$userId || $request->filled('password')) {
            $rules['password'] = 'required|string|min:8|confirmed';
        }

        return $request->validate($rules);
    }

    /**
     * Search users by various criteria
     */
    public function searchUsers(string $query, array $filters = []): Collection
    {
        $userQuery = User::withCount(['articles', 'publishedArticles']);

        // Search by name, email, or bio
        $userQuery->where(function ($q) use ($query) {
            $q->where('name', 'like', "%{$query}%")
              ->orWhere('email', 'like', "%{$query}%")
              ->orWhere('bio', 'like', "%{$query}%");
        });

        // Apply additional filters
        foreach ($filters as $key => $value) {
            switch ($key) {
                case 'role':
                    $userQuery->byRole($value);
                    break;
                case 'active':
                    $userQuery->where('is_active', $value);
                    break;
            }
        }

        return $userQuery->orderBy('name')->limit(50)->get();
    }

    /**
     * Bulk operations on users
     */
    public function bulkUpdateStatus(array $userIds, bool $isActive): int
    {
        return User::whereIn('id', $userIds)
                   ->update(['is_active' => $isActive]);
    }

    public function bulkUpdateRole(array $userIds, string $role): int
    {
        if (!in_array($role, ['super_admin', 'admin', 'penulis', 'user'])) {
            throw new \InvalidArgumentException('Invalid role specified');
        }

        return User::whereIn('id', $userIds)
                   ->update(['role' => $role]);
    }
}