/* VALMEX public-site account control.
   Public pages remain accessible; authenticated users enter CRM only by choice.
   Authorization remains enforced by CRM permissions and Supabase RLS. */
(function () {
  'use strict';

  const SUPABASE_URL = 'https://qejnbbzhpvfjeqzwotwt.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_xbF3ggFeZ475werOTmFWvA_Ho_cxYov';
  const STORAGE_KEY = 'sb-qejnbbzhpvfjeqzwotwt-auth-token';

  let client = null;
  let root = null;
  let trigger = null;
  let menu = null;
  let dashboardLink = null;
  let logoutButton = null;

  function addStyles() {
    if (document.getElementById('valmex-account-styles')) return;
    const style = document.createElement('style');
    style.id = 'valmex-account-styles';
    style.textContent = `
      .valmex-account{position:relative;display:inline-flex;align-items:center;margin-left:10px;z-index:1000}
      .valmex-account-trigger{display:inline-flex;align-items:center;justify-content:center;gap:7px;min-height:40px;padding:9px 14px;border:1px solid #e30613;border-radius:8px;background:#fff;color:#e30613;font:700 13px inherit;cursor:pointer;white-space:nowrap}
      .valmex-account-trigger:hover{background:#fff5f5}
      .valmex-account-menu{position:absolute;right:0;top:calc(100% + 9px);min-width:210px;padding:8px;background:#fff;border:1px solid #e7e7e7;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.14)}
      .valmex-account-menu[hidden]{display:none}
      .valmex-account-menu a,.valmex-account-menu button{display:flex;width:100%;align-items:center;box-sizing:border-box;padding:11px 12px;border:0;border-radius:7px;background:transparent;color:#222;text-align:left;text-decoration:none;font:600 13px inherit;cursor:pointer}
      .valmex-account-menu a:hover,.valmex-account-menu button:hover{background:#f5f5f5}
      .valmex-account-menu button{color:#b42318}
      @media(max-width:600px){.valmex-account{margin-left:6px}.valmex-account-trigger{padding:8px 10px;font-size:12px;min-height:36px}.valmex-account-menu{right:0}}
    `;
    document.head.appendChild(style);
  }

  function buildControl() {
    const header = document.querySelector('#mainHeader') || document.querySelector('header');
    if (!header || header.querySelector('[data-valmex-account]')) return;
    addStyles();

    root = document.createElement('div');
    root.className = 'valmex-account';
    root.setAttribute('data-valmex-account', '');

    trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'valmex-account-trigger';
    trigger.textContent = 'Autentificare';
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');

    menu = document.createElement('div');
    menu.className = 'valmex-account-menu';
    menu.hidden = true;

    dashboardLink = document.createElement('a');
    dashboardLink.href = '/Crm/dashboard.html';
    dashboardLink.textContent = 'Deschide Dashboard';

    logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.textContent = 'Deconectare';

    menu.append(dashboardLink, logoutButton);
    root.append(trigger, menu);

    const cta = header.querySelector('.header-cta');
    if (cta && cta.parentNode) cta.parentNode.insertBefore(root, cta);
    else header.appendChild(root);

    trigger.addEventListener('click', () => {
      if (trigger.dataset.loggedIn !== 'true') {
        window.location.href = '/Crm/index.html';
        return;
      }
      menu.hidden = !menu.hidden;
      trigger.setAttribute('aria-expanded', String(!menu.hidden));
    });

    logoutButton.addEventListener('click', async () => {
      logoutButton.disabled = true;
      try {
        if (client) await client.auth.signOut();
      } finally {
        setLoggedOut();
        logoutButton.disabled = false;
      }
    });

    document.addEventListener('click', event => {
      if (root && !root.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  function closeMenu() {
    if (!menu || !trigger) return;
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  function setLoggedOut() {
    if (!trigger) return;
    trigger.textContent = 'Autentificare';
    trigger.dataset.loggedIn = 'false';
    trigger.setAttribute('aria-label', 'Autentificare angajați și parteneri VALMEX');
    closeMenu();
  }

  function setLoggedIn(profile) {
    if (!trigger) return;
    trigger.textContent = 'Contul meu';
    trigger.dataset.loggedIn = 'true';
    trigger.setAttribute('aria-label', 'Deschide meniul contului VALMEX');
    if (profile && profile.full_name) trigger.title = profile.full_name;
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

  async function refreshAccount() {
    if (!client) return;
    const { data: { session }, error } = await client.auth.getSession();
    if (error || !session) {
      setLoggedOut();
      return;
    }
    const { data: profile, error: profileError } = await client.from('profiles')
      .select('id,full_name,role,active').eq('id', session.user.id).maybeSingle();
    if (profileError || !profile || profile.active !== true || !profile.role) {
      await client.auth.signOut();
      setLoggedOut();
      return;
    }
    setLoggedIn(profile);
  }

  buildControl();
  loadSupabase().then(async () => {
    const storage = localStorage.getItem(STORAGE_KEY) ? localStorage :
      (sessionStorage.getItem(STORAGE_KEY) ? sessionStorage : localStorage);
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { storage, storageKey: STORAGE_KEY, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    await refreshAccount();
    client.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setLoggedOut();
      else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        window.setTimeout(refreshAccount, 0);
      }
    });
  }).catch(error => console.warn('VALMEX account control unavailable:', error));
})();
