<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('viewers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->nullable()->onDelete('cascade');
            $table->string('ip_address_hash');
            $table->string('user_agent');
            $table->timestamp('timestamp');

            $table->index(['article_id', 'timestamp']);
            $table->index('ip_address_hash');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('viewers');
    }
};
