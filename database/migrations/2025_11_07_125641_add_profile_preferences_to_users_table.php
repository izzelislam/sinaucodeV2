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
            $table->boolean('email_notifications')->default(true)->after('bio');
            $table->string('theme', 20)->default('light')->after('email_notifications');
            $table->string('language', 10)->default('en')->after('theme');
            $table->string('timezone', 50)->default('UTC')->after('language');
            $table->timestamp('last_login_at')->nullable()->after('timezone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'email_notifications',
                'theme',
                'language',
                'timezone',
                'last_login_at'
            ]);
        });
    }
};
