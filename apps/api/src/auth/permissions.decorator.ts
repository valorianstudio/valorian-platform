import { SetMetadata } from '@nestjs/common';

export const REQUIRE_ALL = 'rbac:all';
export const REQUIRE_ANY = 'rbac:any';
export const REQUIRE_SUPER = 'rbac:super';
export const ANY_ADMIN = 'rbac:any-admin';
export const ALLOW_PASSWORD_PENDING = 'rbac:allow-password-pending';

/** The signed-in admin must hold every listed permission. */
export const RequirePermission = (...keys: string[]) => SetMetadata(REQUIRE_ALL, keys);
/** The signed-in admin must hold at least one listed permission. */
export const RequireAnyPermission = (...keys: string[]) => SetMetadata(REQUIRE_ANY, keys);
/** Super Admin only (roles, security). */
export const RequireSuper = () => SetMetadata(REQUIRE_SUPER, true);
/** Any authenticated admin (own profile). Routes without any of these decorators are denied to non-super admins. */
export const AnyAdmin = () => SetMetadata(ANY_ADMIN, true);
/** Reachable while a forced password change is pending. */
export const AllowWhilePasswordPending = () => SetMetadata(ALLOW_PASSWORD_PENDING, true);
