<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class UserManagementController extends Controller
{
    protected UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        $this->middleware(['auth', 'admin']);
    }

    /**
     * Display a listing of users.
     */
    public function index(Request $request): Response
    {
        $filters = $request->only(['search', 'role', 'status']);

        $users = $this->userService->getPaginatedUsers($request);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'availableRoles' => $this->userService->getAvailableRoles(),
            'statistics' => $this->userService->getUserStatistics(),
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Users/Form', [
            'user' => null,
            'mode' => 'create',
            'availableRoles' => $this->userService->getAvailableRoles(),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        try {
            $user = $this->userService->createUser($request);

            return redirect()
                ->route('admin.users.index')
                ->with('success', "User '{$user->name}' has been created successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create user: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified user.
     */
    public function show(int $id): Response
    {
        $user = $this->userService->getUserById($id);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(int $id): Response
    {
        $user = $this->userService->getUserById($id);

        return Inertia::render('Admin/Users/Form', [
            'user' => $user,
            'mode' => 'edit',
            'availableRoles' => $this->userService->getAvailableRoles(),
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, int $id): RedirectResponse
    {
        try {
            $user = $this->userService->getUserById($id);
            $updatedUser = $this->userService->updateUser($request, $user);

            return redirect()
                ->route('admin.users.index')
                ->with('success', "User '{$updatedUser->name}' has been updated successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update user: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        try {
            $user = $this->userService->getUserById($id);
            $userName = $user->name;

            $this->userService->deleteUser($user);

            return redirect()
                ->route('admin.users.index')
                ->with('success', "User '{$userName}' has been deleted successfully.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to delete user: ' . $e->getMessage()]);
        }
    }

    /**
     * Toggle user active status
     */
    public function toggleStatus(int $id): RedirectResponse
    {
        try {
            $user = $this->userService->getUserById($id);
            $updatedUser = $this->userService->toggleUserStatus($user);

            $status = $updatedUser->is_active ? 'activated' : 'deactivated';

            return redirect()
                ->back()
                ->with('success', "User '{$updatedUser->name}' has been {$status}.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update user status: ' . $e->getMessage()]);
        }
    }

    /**
     * Change user role
     */
    public function changeRole(Request $request, int $id): RedirectResponse
    {
        try {
            $request->validate([
                'role' => 'required|in:super_admin,admin,penulis,user',
            ]);

            $user = $this->userService->getUserById($id);
            $updatedUser = $this->userService->changeUserRole($user, $request->input('role'));

            return redirect()
                ->back()
                ->with('success', "Role for '{$updatedUser->name}' has been changed to '{$updatedUser->role_label}'.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to change user role: ' . $e->getMessage()]);
        }
    }

    /**
     * API endpoint to get users as JSON (for AJAX requests)
     */
    public function apiIndex(Request $request): JsonResponse
    {
        try {
            $users = $this->userService->getUsers($request);

            return response()->json([
                'success' => true,
                'data' => $users,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API endpoint to get user options for dropdowns
     */
    public function apiOptions(): JsonResponse
    {
        try {
            $options = $this->userService->getUserOptions();

            return response()->json([
                'success' => true,
                'data' => $options,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch user options: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * API endpoint to search users
     */
    public function apiSearch(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'query' => 'required|string|min:2',
            ]);

            $query = $request->input('query');
            $filters = $request->only(['role', 'active']);

            $users = $this->userService->searchUsers($query, $filters);

            return response()->json([
                'success' => true,
                'data' => $users,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to search users: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user statistics
     */
    public function statistics(): Response
    {
        try {
            $statistics = $this->userService->getUserStatistics();

            return Inertia::render('Admin/Users/Statistics', [
                'statistics' => $statistics,
                'availableRoles' => $this->userService->getAvailableRoles(),
            ]);
        } catch (\Exception $e) {
            return redirect()
                ->route('admin.users.index')
                ->withErrors(['error' => 'Failed to fetch user statistics: ' . $e->getMessage()]);
        }
    }

    /**
     * Bulk update user status
     */
    public function bulkUpdateStatus(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'user_ids' => 'required|array|min:1',
                'user_ids.*' => 'integer|exists:users,id',
                'is_active' => 'required|boolean',
            ]);

            $userIds = $request->input('user_ids');
            $isActive = $request->input('is_active');

            $count = $this->userService->bulkUpdateStatus($userIds, $isActive);
            $status = $isActive ? 'activated' : 'deactivated';

            return redirect()
                ->back()
                ->with('success', "{$count} users have been {$status}.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update user status: ' . $e->getMessage()]);
        }
    }

    /**
     * Bulk update user roles
     */
    public function bulkUpdateRole(Request $request): RedirectResponse
    {
        try {
            $request->validate([
                'user_ids' => 'required|array|min:1',
                'user_ids.*' => 'integer|exists:users,id',
                'role' => 'required|in:super_admin,admin,penulis,user',
            ]);

            $userIds = $request->input('user_ids');
            $role = $request->input('role');

            $count = $this->userService->bulkUpdateRole($userIds, $role);

            return redirect()
                ->back()
                ->with('success', "{$count} users have been assigned the '{$role}' role.");
        } catch (\Exception $e) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Failed to update user roles: ' . $e->getMessage()]);
        }
    }
}