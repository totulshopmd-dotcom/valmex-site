/* UI navigation hints only. Database RLS/RPC authorization is mandatory. */
(function (w) {
  'use strict';
  const ADMIN_ROLES = ['admin', 'administrator'];
  function isAdmin(profile) { return ADMIN_ROLES.includes(String(profile?.role || '').toLowerCase()); }
  function canSeeModule(moduleId, profile) {
    if (['cms', 'employees-admin', 'settings', 'audit', 'finance'].includes(moduleId)) return isAdmin(profile);
    return Boolean(profile && profile.active === true);
  }
  w.VALMEX_PERMISSIONS = Object.freeze({ isAdmin, canSeeModule });
})(window);
