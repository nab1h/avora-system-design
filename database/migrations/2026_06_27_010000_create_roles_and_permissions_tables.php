<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        Schema::create('permission_role', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->primary(['role_id', 'permission_id']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('avatar_path')->constrained()->nullOnDelete();
        });

        $roles = [
            ['name' => 'مدير النظام', 'slug' => 'admin', 'description' => 'وصول كامل لكل أجزاء لوحة التحكم.', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'مدير مبيعات', 'slug' => 'sales-manager', 'description' => 'إدارة الطلبات والعملاء والتقارير.', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'دعم فني', 'slug' => 'support', 'description' => 'متابعة العملاء والطلبات بدون إعدادات النظام.', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('roles')->insert($roles);

        $permissions = [
            ['name' => 'إدارة المستخدمين', 'slug' => 'users.manage', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'إدارة الصلاحيات', 'slug' => 'permissions.manage', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'إدارة الطلبات', 'slug' => 'orders.manage', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'إدارة المنتجات', 'slug' => 'products.manage', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'عرض التقارير', 'slug' => 'reports.view', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'إعدادات النظام', 'slug' => 'settings.manage', 'created_at' => now(), 'updated_at' => now()],
        ];

        DB::table('permissions')->insert($permissions);

        $adminRoleId = DB::table('roles')->where('slug', 'admin')->value('id');
        $salesRoleId = DB::table('roles')->where('slug', 'sales-manager')->value('id');
        $supportRoleId = DB::table('roles')->where('slug', 'support')->value('id');

        $allPermissionIds = DB::table('permissions')->pluck('id');
        foreach ($allPermissionIds as $permissionId) {
            DB::table('permission_role')->insert(['role_id' => $adminRoleId, 'permission_id' => $permissionId]);
        }

        foreach (['orders.manage', 'products.manage', 'reports.view'] as $slug) {
            DB::table('permission_role')->insert(['role_id' => $salesRoleId, 'permission_id' => DB::table('permissions')->where('slug', $slug)->value('id')]);
        }

        foreach (['orders.manage'] as $slug) {
            DB::table('permission_role')->insert(['role_id' => $supportRoleId, 'permission_id' => DB::table('permissions')->where('slug', $slug)->value('id')]);
        }

        DB::table('users')->whereNull('role_id')->update(['role_id' => $adminRoleId]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('role_id');
        });

        Schema::dropIfExists('permission_role');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
