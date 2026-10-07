import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { UserRole } from '@/types/database';

/**
 * Creates a Supabase client for server components / route handlers.
 * Never trust organization_id or role from the client.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component – ignore
          }
        },
      },
    }
  );
}

export interface AuthContext {
  userId: string;
  organizationId: string;
  role: UserRole;
}

/**
 * Resolves the authenticated user and their organization membership.
 * Throws / returns null if not authenticated or not a member of any org.
 */
export async function getAuthContext(
  requiredRoles?: UserRole[]
): Promise<AuthContext | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  const { data: membership, error: memberError } = await supabase
    .from('organization_members')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .order('joined_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (memberError || !membership) {
    return null;
  }

  const role = membership.role as UserRole;

  if (requiredRoles && !requiredRoles.includes(role)) {
    return null;
  }

  return {
    userId: user.id,
    organizationId: membership.organization_id,
    role,
  };
}

/**
 * Strict version – throws if unauthorized.
 */
export async function requireAuth(requiredRoles?: UserRole[]): Promise<AuthContext> {
  const ctx = await getAuthContext(requiredRoles);
  if (!ctx) {
    throw new Error('Unauthorized');
  }
  return ctx;
}
