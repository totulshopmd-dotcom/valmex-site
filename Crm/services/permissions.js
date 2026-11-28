/* UI access checks based on the permission rows loaded by VALMEX_AUTH. Supabase RLS/RPC remains authoritative. */
(function (w) {
  'use strict';
  const ADMIN_ROLES = ['admin', 'administrator'];
  const MODULE_PERMISSION = Object.freeze({
    clients:'clients.view',
    projects:'projects.view',
    'project-file':'projects.view',
    calculator:'calculator.access',
    quotations:'quotes.create',
    chat:'chat.access',
    tasks:['tasks.manage','tasks.view_all'],
    timesheet:'projects.view',
    documents:'documents.view',
    contracts:'documents.manage',
    materials:['materials.view','materials.manage'],
    warranties:'warranty.view',
    interventions:'warranty.view',
    notifications:'notifications.manage'
  });
  function isAdmin(profile) { return ADMIN_ROLES.includes(String(profile?.role || '').toLowerCase()); }
  function canSeeModule(moduleId, profile) {
    if (!profile || profile.active !== true) return false;
    if (isAdmin(profile)) return true;
    const required = MODULE_PERMISSION[moduleId];
    return Boolean(required && profile.permissions instanceof Set && (Array.isArray(required) ? required.some(key => profile.permissions.has(key)) : profile.permissions.has(required)));
  }
  w.VALMEX_PERMISSIONS = Object.freeze({ isAdmin, canSeeModule, modulePermission:MODULE_PERMISSION });
})(window);
