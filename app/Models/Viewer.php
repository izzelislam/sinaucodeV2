<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Viewer extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'ip_address_hash',
        'user_agent',
        'timestamp',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

    public $timestamps = false;

    // Relationships
    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    // Scopes
    public function scopeToday($query)
    {
        return $query->whereDate('timestamp', today());
    }

    public function scopeThisWeek($query)
    {
        return $query->whereBetween('timestamp', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('timestamp', now()->month)
                    ->whereYear('timestamp', now()->year);
    }

    public function scopeThisYear($query)
    {
        return $query->whereYear('timestamp', now()->year);
    }

    // Methods
    public static function trackView(Article $article, string $ipAddress, string $userAgent): self
    {
        return static::create([
            'article_id' => $article->id,
            'ip_address_hash' => hash('sha256', $ipAddress),
            'user_agent' => $userAgent,
            'timestamp' => now(),
        ]);
    }

    public static function getUniqueViews(Article $article, \DateTime $start = null, \DateTime $end = null): int
    {
        $query = static::where('article_id', $article->id);

        if ($start) {
            $query->where('timestamp', '>=', $start);
        }

        if ($end) {
            $query->where('timestamp', '<=', $end);
        }

        return $query->distinct('ip_address_hash')->count();
    }

    public static function getTotalViews(Article $article, \DateTime $start = null, \DateTime $end = null): int
    {
        $query = static::where('article_id', $article->id);

        if ($start) {
            $query->where('timestamp', '>=', $start);
        }

        if ($end) {
            $query->where('timestamp', '<=', $end);
        }

        return $query->count();
    }
}
