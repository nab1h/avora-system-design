<?php

use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\PaymentGatewayController;
use App\Http\Controllers\Admin\PermissionPageController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\UserPageController;
use App\Http\Controllers\Admin\ecommerce\AttributeController;
use App\Http\Controllers\Admin\ecommerce\ProductsController;
use App\Http\Controllers\Admin\WebsiteSettingController;
use App\Http\Controllers\Admin\WebsiteSettingPageController;
use App\Http\Controllers\Auth\CustomerAuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DashboardNotificationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PaymentCheckoutController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiteManifestController;
use Illuminate\Support\Facades\Route;

Route::get('/', HomeController::class)->name('home');

Route::middleware('guest')->group(function () {
    Route::post('/customer/login', [CustomerAuthController::class, 'login'])
        ->name('customer.login');

    Route::post('/customer/register', [CustomerAuthController::class, 'register'])
        ->name('customer.register');
});

Route::get('/site.webmanifest', SiteManifestController::class)->name('site.webmanifest');

Route::post('/checkout', [PaymentCheckoutController::class, 'store'])
    ->name('checkout.store');

Route::get('/checkout/{paymentTransaction}', [PaymentCheckoutController::class, 'show'])
    ->name('checkout.show');

Route::get('/checkout/{paymentTransaction}/success', [PaymentCheckoutController::class, 'success'])
    ->name('checkout.success');

Route::get('/checkout/{paymentTransaction}/cancel', [PaymentCheckoutController::class, 'cancel'])
    ->name('checkout.cancel');

Route::post('/checkout/{paymentTransaction}/tap/webhook', [PaymentCheckoutController::class, 'tapWebhook'])
    ->name('checkout.tap.webhook');

Route::match(['get', 'post'], '/checkout/paymob/callback', [PaymentCheckoutController::class, 'paymobCallback'])
    ->name('checkout.paymob.callback');

Route::post('/checkout/moyasar/callback', [PaymentCheckoutController::class, 'moyasarCallback'])
    ->name('checkout.moyasar.callback');

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified', 'dashboard.access'])
    ->name('dashboard');

// صلاحية users.manage: عرض وإضافة وتعديل وحذف المستخدمين.
Route::get('/dashboard/users', UserPageController::class)
    ->middleware(['auth', 'verified', 'permission:users.manage'])
    ->name('dashboard.users');

Route::post('/dashboard/users', [UserController::class, 'store'])
    ->middleware(['auth', 'verified', 'permission:users.manage'])
    ->name('dashboard.users.store');

Route::put('/dashboard/users/{user}', [UserController::class, 'update'])
    ->middleware(['auth', 'verified', 'permission:users.manage'])
    ->name('dashboard.users.update');

Route::delete('/dashboard/users/{user}', [UserController::class, 'destroy'])
    ->middleware(['auth', 'verified', 'permission:users.manage'])
    ->name('dashboard.users.destroy');

// صلاحية permissions.manage: عرض وإدارة الأدوار والصلاحيات.
Route::get('/dashboard/permissions', PermissionPageController::class)
    ->middleware(['auth', 'verified', 'permission:permissions.manage'])
    ->name('dashboard.permissions');

Route::post('/dashboard/roles', [RoleController::class, 'store'])
    ->middleware(['auth', 'verified', 'permission:permissions.manage'])
    ->name('dashboard.roles.store');

Route::put('/dashboard/roles/{role}', [RoleController::class, 'update'])
    ->middleware(['auth', 'verified', 'permission:permissions.manage'])
    ->name('dashboard.roles.update');

Route::delete('/dashboard/roles/{role}', [RoleController::class, 'destroy'])
    ->middleware(['auth', 'verified', 'permission:permissions.manage'])
    ->name('dashboard.roles.destroy');

Route::post('/dashboard/permissions', [PermissionController::class, 'store'])
    ->middleware(['auth', 'verified', 'permission:permissions.manage'])
    ->name('dashboard.permissions.store');

Route::put('/dashboard/permissions/{permission}', [PermissionController::class, 'update'])
    ->middleware(['auth', 'verified', 'permission:permissions.manage'])
    ->name('dashboard.permissions.update');

Route::delete('/dashboard/permissions/{permission}', [PermissionController::class, 'destroy'])
    ->middleware(['auth', 'verified', 'permission:permissions.manage'])
    ->name('dashboard.permissions.destroy');

// صلاحية settings.manage: عرض وتعديل إعدادات الموقع العامة.
Route::get('/dashboard/settings', WebsiteSettingPageController::class)
    ->middleware(['auth', 'verified', 'permission:settings.manage'])
    ->name('dashboard.settings');

Route::put('/dashboard/settings/website', [WebsiteSettingController::class, 'update'])
    ->middleware(['auth', 'verified', 'permission:settings.manage'])
    ->name('dashboard.settings.website.update');

Route::post('/dashboard/settings/website/test-email', [WebsiteSettingController::class, 'sendTestEmail'])
    ->middleware(['auth', 'verified', 'permission:settings.manage'])
    ->name('dashboard.settings.website.test-email');

// أقسام الداشبورد العامة: تحتاج تسجيل دخول فقط بدون صلاحية خاصة.
Route::put('/dashboard/payment-gateways/{paymentGateway}', [PaymentGatewayController::class, 'update'])
    ->middleware(['auth', 'verified', 'permission:settings.manage'])
    ->name('dashboard.payment-gateways.update');

Route::get('/dashboard/payments', [DashboardController::class, 'payments'])
    ->middleware(['auth', 'verified', 'permission:settings.manage'])
    ->name('dashboard.payments');

Route::get('/dashboard/purchases', [DashboardController::class, 'purchases'])
    ->middleware(['auth', 'verified', 'dashboard.access'])
    ->name('dashboard.purchases');

Route::get('/dashboard/notifications/{notification}', [DashboardNotificationController::class, 'read'])
    ->middleware(['auth', 'verified', 'dashboard.access'])
    ->name('dashboard.notifications.read');

Route::post('/dashboard/notifications/read-all', [DashboardNotificationController::class, 'markAllRead'])
    ->middleware(['auth', 'verified', 'dashboard.access'])
    ->name('dashboard.notifications.read-all');

Route::get('/dashboard/{section}', [DashboardController::class, 'section'])
    ->where('section', 'orders|products|customers|reports|calendar|forms|tables|ui-elements|payments|purchases')
    ->middleware(['auth', 'verified', 'dashboard.access'])
    ->name('dashboard.section');

// حساب المستخدم الحالي: تعديل البروفايل وحذف الحساب.
Route::get('/profile', [ProfileController::class, 'edit'])
    ->middleware('auth')
    ->name('profile.edit');

Route::patch('/profile', [ProfileController::class, 'update'])
    ->middleware('auth')
    ->name('profile.update');

Route::delete('/profile', [ProfileController::class, 'destroy'])
    ->middleware('auth')
    ->name('profile.destroy');



// attribute ================
Route::middleware(['auth', 'verified', 'dashboard.access'])
    ->prefix('dashboard/attributes')
    ->name('dashboard.attributes.')
    ->group(function () {

        Route::get('/', [AttributeController::class, 'index'])
            ->name('index');

        Route::post('/', [AttributeController::class, 'store'])
            ->name('store');

        Route::get('/{attribute}/edit', [AttributeController::class, 'edit'])
            ->name('edit');

        Route::put('/{attribute}', [AttributeController::class, 'update'])
            ->name('update');

        Route::delete('/{attribute}', [AttributeController::class, 'destroy'])
            ->name('destroy');
    });

// Products ================
Route::middleware(['auth', 'verified', 'dashboard.access'])
    ->prefix('dashboard/products')
    ->name('dashboard.products.')
    ->group(function () {

        Route::get('/', [ProductsController::class, 'index'])
            ->name('index');

        Route::post('/', [ProductsController::class, 'store'])
            ->name('store');

        Route::get('/{products}/edit', [ProductsController::class, 'edit'])
            ->name('edit');

        Route::put('/{products}', [ProductsController::class, 'update'])
            ->name('update');

        Route::delete('/{products}', [ProductsController::class, 'destroy'])
            ->name('destroy');
    });

require __DIR__.'/auth.php';
