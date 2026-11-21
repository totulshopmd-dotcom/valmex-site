/* VALMEX CRM: bind the authenticated CRM user to the OneSignal external_id. */
(function () {
  'use strict';
  const APP_ID = '4b147332-d5be-4573-b11e-a4aa8a4c2391';
  const URL = 'https://qejnbbzhpvfjeqzwotwt.supabase.co';
  const KEY = 'sb_publishable_xbF3ggFeZ475werOTmFWvA_Ho_cxYov';
  const STORAGE_KEY = 'sb-qejnbbzhpvfjeqzwotwt-auth-token';
  if (!window.supabase || !window.supabase.createClient) return;

  const storage = localStorage.getItem(STORAGE_KEY) ? localStorage :
    (sessionStorage.getItem(STORAGE_KEY) ? sessionStorage : localStorage);
  const db = window.supabase.createClient(URL, KEY, {
    auth: { storage, storageKey: STORAGE_KEY, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  window.OneSignalDeferred = window.OneSignalDeferred || [];
  let sdk = document.querySelector('script[data-valmex-crm-onesignal]');
  if (!sdk) {
    sdk = document.createElement('script');
    sdk.src = 'https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js';
    sdk.defer = true;
    sdk.dataset.valmexCrmOnesignal = '1';
    document.head.appendChild(sdk);
  }

  window.OneSignalDeferred.push(async function (OneSignal) {
    try {
      await OneSignal.init({ appId: APP_ID, notifyButton: { enable: false } });
      const syncIdentity = async (session) => {
        if (session && session.user && session.user.id) {
          await OneSignal.login(session.user.id);
        } else {
          await OneSignal.logout();
        }
      };
      const { data: { session } } = await db.auth.getSession();
      await syncIdentity(session);
      db.auth.onAuthStateChange((event, nextSession) => {
        if (event === 'SIGNED_OUT' || nextSession) {
          Promise.resolve(syncIdentity(nextSession)).catch(e =>
            console.warn('VALMEX OneSignal identity sync:', e)
          );
        }
      });
    } catch (error) {
      console.warn('VALMEX CRM OneSignal unavailable:', error);
    }
  });
})();
