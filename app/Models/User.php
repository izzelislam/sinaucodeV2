<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'bio',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function articles()
    {
        return $this->hasMany(Article::class);
    }

    public function publishedArticles()
    {
        return $this->hasMany(Article::class)->where('status', 'published');
    }

    public function profilePicture()
    {
        return $this->morphOne(Media::class, 'mediable')->where('tag', 'profile_picture');
    }

    // Accessors
    public function getRoleLabelAttribute(): string
    {
        return match($this->role) {
            'super_admin' => 'Super Admin',
            'admin' => 'Administrator',
            'penulis' => 'Penulis',
            'user' => 'User',
            default => ucfirst($this->role),
        };
    }

    public function getStatusAttribute(): string
    {
        return $this->is_active ? 'Active' : 'Inactive';
    }

    public function getProfilePictureUrlAttribute(): string
    {
        if ($this->profilePicture) {
            return $this->profilePicture->url;
        }

        return "https://ui-avatars.com/api/?name=" . urlencode($this->name) . "&color=7F9CF5&background=EBF4FF";
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    // Role checking methods
    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'super_admin']);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isPenulis(): bool
    {
        return $this->role === 'penulis';
    }

    public function isActive(): bool
    {
        return $this->is_active;
    }

    // Methods
    public function getArticleCount(): int
    {
        return $this->articles()->count();
    }

    public function getPublishedArticleCount(): int
    {
        return $this->publishedArticles()->count();
    }

    public function canManageUsers(): bool
    {
        return $this->isAdmin();
    }

    public function canManageArticles(): bool
    {
        return in_array($this->role, ['admin', 'super_admin', 'penulis']);
    }

    public function canManageAllContent(): bool
    {
        return $this->isAdmin();
    }

    // Activity Log Configuration
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'role', 'bio', 'is_active'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->setDescriptionForEvent(fn(string $eventName) => "User has been {$eventName}");
    }

    // Relationships
    public function activities()
    {
        return $this->morphMany(\Spatie\Activitylog\Models\Activity::class, 'causer');
    }
}
