<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->string('name_ar')->nullable()->after('name');
            $table->string('name_en')->nullable()->after('name_ar');
        });

        $translations = [
            'users.manage' => ['ar' => 'إدارة المستخدمين', 'en' => 'Manage users'],
            'permissions.manage' => ['ar' => 'إدارة الصلاحيات', 'en' => 'Manage permissions'],
            'orders.manage' => ['ar' => 'إدارة الطلبات', 'en' => 'Manage orders'],
            'products.manage' => ['ar' => 'إدارة المنتجات', 'en' => 'Manage products'],
            'reports.view' => ['ar' => 'عرض التقارير', 'en' => 'View reports'],
            'settings.manage' => ['ar' => 'إعدادات النظام', 'en' => 'Manage settings'],
        ];

        foreach ($translations as $slug => $translation) {
            DB::table('permissions')
                ->where('slug', $slug)
                ->update([
                    'name_ar' => $translation['ar'],
                    'name_en' => $translation['en'],
                ]);
        }

        DB::table('permissions')
            ->whereNull('name_ar')
            ->orWhereNull('name_en')
            ->orderBy('id')
            ->each(function (object $permission): void {
                DB::table('permissions')
                    ->where('id', $permission->id)
                    ->update([
                        'name_ar' => $permission->name_ar ?? $permission->name,
                        'name_en' => $permission->name_en ?? $permission->name,
                    ]);
            });
    }

    public function down(): void
    {
        Schema::table('permissions', function (Blueprint $table) {
            $table->dropColumn(['name_ar', 'name_en']);
        });
    }
};
