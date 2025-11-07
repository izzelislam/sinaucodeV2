<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Services\ProfileService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    protected ProfileService $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $profileData = $this->profileService->getUserProfile($user);
        $preferences = $this->profileService->getUserPreferences($user);

        return Inertia::render('Admin/Profile/Index', [
            'profile' => $profileData,
            'preferences' => $preferences,
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Display the user's profile overview.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $profileData = $this->profileService->getUserProfile($user);
        $preferences = $this->profileService->getUserPreferences($user);

        return Inertia::render('Admin/Profile/Index', [
            'profile' => $profileData,
            'preferences' => $preferences,
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        try {
            $user = $this->profileService->updateProfile($request, $request->user());

            return Redirect::route('admin.profile.index')
                ->with('success', 'Profile updated successfully.');
        } catch (\Exception $e) {
            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update profile: ' . $e->getMessage()]);
        }
    }

    /**
     * Update user password.
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        try {
            $this->profileService->updatePassword($request, $request->user());

            return Redirect::route('admin.profile.index')
                ->with('success', 'Password updated successfully.');
        } catch (\Exception $e) {
            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update password: ' . $e->getMessage()]);
        }
    }

    /**
     * Update user profile picture.
     */
    public function updateProfilePicture(Request $request): JsonResponse
    {
        try {
            $url = $this->profileService->updateProfilePicture($request, $request->user());

            return response()->json([
                'success' => true,
                'message' => 'Profile picture updated successfully.',
                'url' => $url,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile picture: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update user preferences.
     */
    public function updatePreferences(Request $request): RedirectResponse
    {
        try {
            $user = $this->profileService->updatePreferences($request, $request->user());

            return Redirect::route('admin.profile.index')
                ->with('success', 'Preferences updated successfully.');
        } catch (\Exception $e) {
            return Redirect::back()
                ->withInput()
                ->withErrors(['error' => 'Failed to update preferences: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        try {
            $this->profileService->deleteAccount($request, $request->user());

            Auth::logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return Redirect::to('/')
                ->with('success', 'Your account has been deleted successfully.');
        } catch (\Exception $e) {
            return Redirect::back()
                ->withErrors(['error' => 'Failed to delete account: ' . $e->getMessage()]);
        }
    }

    /**
     * Get user statistics as JSON.
     */
    public function statistics(Request $request): JsonResponse
    {
        try {
            $statistics = $this->profileService->getUserStatistics($request->user());

            return response()->json([
                'success' => true,
                'data' => $statistics,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch statistics: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get recent activity as JSON.
     */
    public function activity(Request $request): JsonResponse
    {
        try {
            $activity = $this->profileService->getRecentActivity($request->user());

            return response()->json([
                'success' => true,
                'data' => $activity,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch activity: ' . $e->getMessage(),
            ], 500);
        }
    }
}
