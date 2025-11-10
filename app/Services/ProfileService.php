<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProfileService
{
    /**
     * Get user profile data with statistics
     */
    public function getUserProfile(User $user): array
    {
        return [
            'user' => $user->loadCount(['articles', 'publishedArticles']),
            'statistics' => $this->getUserStatistics($user),
            'recent_activity' => $this->getRecentActivity($user),
        ];
    }

    /**
     * Update user profile information
     */
    public function updateProfile(Request $request, User $user): User
    {
        $data = $this->validateProfileData($request, $user->id);

        return DB::transaction(function () use ($user, $data) {
            $user->update($data);

            // Log the activity
            activity()
                ->causedBy(auth()->user())
                ->performedOn($user)
                ->withProperties(['action' => 'profile_updated'])
                ->log('Profile updated');

            return $user->fresh();
        });
    }

    /**
     * Update user password
     */
    public function updatePassword(Request $request, User $user): bool
    {
        $data = $this->validatePasswordData($request);

        if (!Hash::check($data['current_password'], $user->password)) {
            throw new \InvalidArgumentException('Current password is incorrect');
        }

        return DB::transaction(function () use ($user, $data) {
            $user->update([
                'password' => Hash::make($data['password']),
            ]);

            // Log the activity (without sensitive data)
            activity()
                ->causedBy(auth()->user())
                ->performedOn($user)
                ->withProperties(['action' => 'password_changed'])
                ->log('Password changed');

            return true;
        });
    }

    /**
     * Update user profile picture
     */
    public function updateProfilePicture(Request $request, User $user): string
    {
        $request->validate([
            'profile_picture' => ['required', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
        ]);

        return DB::transaction(function () use ($request, $user) {
            // Delete old profile picture if exists
            if ($user->profilePicture) {
                $user->profilePicture->delete();
            }

            $file = $request->file('profile_picture');
            $path = $file->store('profile-pictures', 'public');

            // Create media record
            $user->profilePicture()->create([
                'filename' => $file->getClientOriginalName(),
                'path' => $path,
                'mime_type' => $file->getMimeType(),
                'tag' => 'profile_picture',
            ]);

            // Log the activity
            activity()
                ->causedBy(auth()->user())
                ->performedOn($user)
                ->withProperties(['action' => 'profile_picture_updated'])
                ->log('Profile picture updated');

            return $user->fresh()->profile_picture_url;
        });
    }

    /**
     * Delete user account
     */
    public function deleteAccount(Request $request, User $user): bool
    {
        $request->validate([
            'password' => ['required', 'current_password'],
            'confirmation' => ['required', 'string', 'in:DELETE'],
        ]);

        return DB::transaction(function () use ($user) {
            // Check if user has articles
            $articleCount = $user->articles()->count();

            if ($articleCount > 0) {
                throw new \Exception("Cannot delete account with {$articleCount} articles. Please delete or reassign articles first.");
            }

            // Delete profile picture if exists
            if ($user->profilePicture) {
                $user->profilePicture->delete();
            }

            $deleted = $user->delete();

            // Log the activity
            if ($deleted) {
                activity()
                    ->causedBy($user) // User is causing their own deletion
                    ->performedOn($user)
                    ->withProperties(['action' => 'account_deleted'])
                    ->log('Account deleted');
            }

            return $deleted;
        });
    }

    /**
     * Get user statistics
     */
    public function getUserStatistics(User $user): array
    {
        $totalArticles = $user->articles()->count();
        $publishedArticles = $user->publishedArticles()->count();
        $draftArticles = $totalArticles - $publishedArticles;

        return [
            'total_articles' => $totalArticles,
            'published_articles' => $publishedArticles,
            'draft_articles' => $draftArticles,
            'account_age' => $user->created_at->diffForHumans(now(), true),
            'last_login' => $user->last_login_at?->diffForHumans() ?: 'Never',
        ];
    }

    /**
     * Get recent user activity
     */
    public function getRecentActivity(User $user): array
    {
        // Get recent activities from activity log
        $activities = [];
        try {
            if (method_exists($user, 'activities')) {
                $activities = $user->activities()
                    ->with('causer')
                    ->orderBy('created_at', 'desc')
                    ->limit(10)
                    ->get()
                    ->map(function ($activity) {
                        return [
                            'id' => $activity->id,
                            'description' => $activity->description,
                            'properties' => $activity->properties,
                            'created_at' => $activity->created_at->toISOString(),
                            'causer' => $activity->causer?->name,
                        ];
                    })
                    ->toArray();
            }
        } catch (\Exception $e) {
            // Activity logging not available or not configured
            $activities = [];
        }

        // Get recent articles
        $recentArticles = $user->articles()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'title', 'status', 'created_at'])
            ->toArray();

        return [
            'activities' => $activities,
            'recent_articles' => $recentArticles,
        ];
    }

    /**
     * Get user preferences
     */
    public function getUserPreferences(User $user): array
    {
        return [
            'email_notifications' => $user->email_notifications ?? true,
            'theme' => $user->theme ?? 'light',
            'language' => $user->language ?? 'en',
            'timezone' => $user->timezone ?? 'UTC',
        ];
    }

    /**
     * Update user preferences
     */
    public function updatePreferences(Request $request, User $user): User
    {
        $data = $this->validatePreferencesData($request);

        $user->update($data);

        // Log the activity
        activity()
            ->causedBy(auth()->user())
            ->performedOn($user)
            ->withProperties(['action' => 'preferences_updated'])
            ->log('Preferences updated');

        return $user->fresh();
    }

    /**
     * Validate profile data
     */
    protected function validateProfileData(Request $request, ?int $userId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email,' . $userId,
            ],
            'bio' => ['nullable', 'string', 'max:1000'],
        ]);
    }

    /**
     * Validate password data
     */
    protected function validatePasswordData(Request $request): array
    {
        return $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Validate preferences data
     */
    protected function validatePreferencesData(Request $request): array
    {
        return $request->validate([
            'email_notifications' => ['boolean'],
            'theme' => ['string', 'in:light,dark,auto'],
            'language' => ['string', 'max:10'],
            'timezone' => ['string', 'max:50'],
        ]);
    }
}