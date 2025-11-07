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
        if (!Schema::hasTable('media')) {
            Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->string('filename');
            $table->string('path');
            $table->string('mime_type');
            $table->string('alt_text')->nullable();
            $table->string('caption')->nullable();

            // Morphable relationship
            $table->nullableMorphs('mediable');
            $table->string('tag')->nullable(); // To differentiate between featured_image, gallery, etc.

            $table->timestamps();

            $table->index('mime_type');
            $table->index('tag');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
