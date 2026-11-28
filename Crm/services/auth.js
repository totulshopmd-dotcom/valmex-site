/* Shared CRM session and active-profile guard. Backend RLS remains authoritative. */
(function (w) {
  'use strict';
  async function requireSession() {
    const db = w.VALMEX_DB;
    if (!db) throw new Error('Conexiunea Supabase nu este inițializată.');
    const { data: { session }, error } = await db.auth.getSession();
    if (error || !session) { w.location.replace('index.html'); return null; }
    const { data: profile, error: profileError } = await db.from('profiles')
      .select('id,full_name,role,active').eq('id', session.user.id).maybeSingle();
    if (profileError || !profile || profile.active !== true || !profile.role) {
      await db.auth.signOut(); w.location.replace('index.html'); return null;
    }
    const admin = ['admin','administrator'].includes(String(profile.role).toLowerCase());
    let permissions = new Set();
    if (!admin) {
      const { data: rows, error: permissionError } = await db.from('employee_permissions')
        .select('permission_key').eq('employee_id', session.user.id).eq('granted', true);
      if (permissionError) throw new Error('Permisiunile nu au putut fi verificate. Accesul a fost restricționat.');
      permissions = new Set((rows || []).map(row => row.permission_key));
    }
    profile.permissions = permissions;
    profile.permissionCheckFailed = false;
    return { session, profile };
  }
  async function signOut() {
    if (w.VALMEX_DB) await w.VALMEX_DB.auth.signOut();
    w.location.replace('index.html');
  }
  w.VALMEX_AUTH = Object.freeze({ requireSession, signOut });
})(window);
