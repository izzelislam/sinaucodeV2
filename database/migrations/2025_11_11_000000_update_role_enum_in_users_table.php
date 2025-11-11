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
        Schema::table('users', function (Blueprint $table) {
            // First drop the existing role column
            $table->dropIndex(['role']);
            $table->dropColumn('role');
        });

        Schema::table('users', function (Blueprint $table) {
            // Re-add the role column with all the required enum values
            $table->enum('role', ['user', 'admin', 'super_admin', 'penulis'])->default('user')->after('email');
            $table->index('role');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop the updated role column
            $table->dropIndex(['role']);
            $table->dropColumn('role');
        });

        Schema::table('users', function (Blueprint $table) {
            // Restore the previous role column definition
            $table->enum('role', ['admin', 'penulis'])->default('penulis')->after('email');
            $table->index('role');
        });
    }
};