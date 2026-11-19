/* VALMEX public-site authentication entry.
   Public pages remain visible to visitors. Active authenticated users are routed to CRM.
   Supabase publishable key only; authorization is enforced by profiles, module permissions and RLS. */
(function () {
  'use strict';
  const SUPABASE_URL = 'https://qejnbbzhpvfjeqzwotwt.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_xbF3ggFeZ475werOTmFWvA_Ho_cxYov';
  const STORAGE_KEY = 'sb-qejnbbzhpvfjeqzwotwt-auth-token';

  function addLoginLink() {
    const header = document.querySelector('#mainHeader') || document.querySelector('header');
    if (!header || header.querySelector('[data-valmex-auth-link]')) return;
    const link = document.createElement('a');
    link.href = '/Crm/index.html';
    link.textContent = 'Autentificare';
    link.setAttribute('data-valmex-auth-link', '');
    link.setAttribute('aria-label', 'Autentificare angajați și parteneri VALMEX');
    link.style.cssText = 'display:inline-flex;align-items:center;justify-content:center;margin-left:10px;padding:10px 14px;border:1px solid #e30613;border-radius:8px;color:#e30613;background:#fff;text-decoration:none;font-size:13px;font-weight:700;white-space:nowrap';
    const cta = header.querySelector('.header-cta');
    if (cta && cta.parentNode) cta.parentNode.insertBefore(link, cta);
    else header.appendChild(link);
  }

  function loadSupabase() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  addLoginLink();
  loadSupabase().then(async () => {
    const storage = localStorage.getItem(STORAGE_KEY) ? localStorage :
      (sessionStorage.getItem(STORAGE_KEY) ? sessionStorage : localStorage);
    const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { storage, storageKey: STORAGE_KEY, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    const { data: { session }, error } = await client.auth.getSession();
    if (error || !session) return;
    const { data: profile, error: profileError } = await client.from('profiles')
      .select('id,role,active').eq('id', session.user.id).maybeSingle();
    if (profileError || !profile || profile.active !== true || !profile.role) {
      await client.auth.signOut();
      return;
    }
    window.location.replace('/Crm/dashboard.html');
  }).catch(error => console.warn('VALMEX auth entry unavailable:', error));
})();