/* VALMEX shared Supabase client. Public publishable key only; never place service-role secrets here. */
(function (w) {
  'use strict';
  const URL = 'https://qejnbbzhpvfjeqzwotwt.supabase.co';
  const KEY = 'sb_publishable_xbF3ggFeZ475werOTmFWvA_Ho_cxYov';
  const STORAGE_KEY = 'sb-qejnbbzhpvfjeqzwotwt-auth-token';
  if (!w.supabase || typeof w.supabase.createClient !== 'function') {
    console.error('VALMEX: Supabase JS nu este disponibil.');
    return;
  }
  const storage = localStorage.getItem(STORAGE_KEY) ? localStorage :
    (sessionStorage.getItem(STORAGE_KEY) ? sessionStorage : localStorage);
  w.VALMEX_DB = w.supabase.createClient(URL, KEY, {
    auth: { storage, storageKey: STORAGE_KEY, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  w.VALMEX_CONFIG = Object.freeze({ url: URL, storageKey: STORAGE_KEY });
})(window);
