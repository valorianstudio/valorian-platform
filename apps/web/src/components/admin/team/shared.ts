export interface RoleRef {
  id: string;
  key: string;
  name: string;
}

export interface RoleOption extends RoleRef {
  active: boolean;
  isSystem: boolean;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  mustChangePassword: boolean;
  totpEnabled: boolean;
  roleRef: RoleRef | null;
}

export interface UserDetail extends UserRow {
  passwordChangedAt: string | null;
  roles: RoleOption[];
  recent: { id: string; action: string; module: string; summary: string; createdAt: string }[];
}

export interface RoleSummary {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  active: boolean;
  userCount: number;
  permissionCount: number;
}

export interface PermissionDef {
  key: string;
  module: string;
  label: string;
  description?: string;
  superOnly: boolean;
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return 'Never';
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
}

export function titleCase(value: string): string {
  return value.replace(/[_.-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
