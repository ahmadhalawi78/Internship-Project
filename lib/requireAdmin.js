import { supabaseServer } from './supabaseServer';

export async function requireAdmin() {
  const supabase = supabaseServer();

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: 'Unauthorized', status: 401 };
  }

  // Example: role stored in user metadata
  const role = user.user_metadata?.role;

  if (role !== 'admin') {
    return { error: 'Forbidden – Admins only', status: 403 };
  }

  return { user };
}
