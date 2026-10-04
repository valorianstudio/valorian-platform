'use client';

import { createContext, useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { can as hasAny } from '@/lib/permissions';

interface Access {
  permissions: readonly string[];
  /** True when the admin holds at least one of the listed permissions. */
  can: (...anyOf: string[]) => boolean;
}

const AccessContext = createContext<Access | null>(null);

export function AccessProvider({ permissions, children }: { permissions: readonly string[]; children: ReactNode }) {
  const can = useCallback((...anyOf: string[]) => hasAny(permissions, ...anyOf), [permissions]);
  const value = useMemo(() => ({ permissions, can }), [permissions, can]);
  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess(): Access {
  const access = useContext(AccessContext);
  if (!access) throw new Error('useAccess must be used within AccessProvider');
  return access;
}
