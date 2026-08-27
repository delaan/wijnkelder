import { callFunction } from './functionsApi'

export const listUsers = () => callFunction('admin-list-users')

export const inviteUser = (email) =>
  callFunction('admin-invite-user', { method: 'POST', body: JSON.stringify({ email }) })

export const updateUserRole = (userId, role) =>
  callFunction('admin-update-role', { method: 'POST', body: JSON.stringify({ userId, role }) })

export const toggleUserAccess = (userId, revoke) =>
  callFunction('admin-toggle-access', { method: 'POST', body: JSON.stringify({ userId, revoke }) })
