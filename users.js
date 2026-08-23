// Shared user directory for the surveillance prototype.
// The admin console writes it; the field app reads it at sign-in and on sync.
// Stands in for the server-side users table.

export const USERS_KEY = 'vs.users.v2';

export const DEFAULT_USERS = [
  { id: 6, nameKm: 'អ្នកគ្រប់គ្រងប្រព័ន្ធ', username: 'admin', pin: '1234', role: 'Admin', province: '', district: '', villages: [], active: true, signedIn: false, last: '' },
  { id: 1, nameKm: 'សុខា ព្រំ', username: 'sokha.p', pin: '1234', role: 'Collector', province: '02', district: '0203', villages: ['0203100400', '0203100200'], active: true, signedIn: true, last: '23 Aug · 08:31' },
  { id: 2, nameKm: 'ដារ៉ា ខេង', username: 'dara.k', pin: '1234', role: 'Collector', province: '02', district: '0201', villages: ['0201060400'], active: true, signedIn: false, last: '' },
  { id: 3, nameKm: 'វិជ្ជា សុខ', username: 'vichea.s', pin: '1234', role: 'Supervisor', province: '02', district: '', villages: [], active: true, signedIn: true, last: '22 Aug · 17:04' },
  { id: 4, nameKm: 'ចាន់ថា លី', username: 'chantha.l', pin: '1234', role: 'Lab technician', province: '12', district: '', villages: [], active: true, signedIn: true, last: '23 Aug · 07:12' },
  { id: 5, nameKm: 'រតនា ម៉េង', username: 'ratana.m', pin: '1234', role: 'Collector', province: '02', district: '0203', villages: ['0203100100', '0203100300'], active: false, signedIn: true, last: '11 Aug · 15:22' },
];

export function loadUsers() {
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length) return list;
    }
  } catch (e) { /* storage unavailable */ }
  return DEFAULT_USERS.map((u) => ({ ...u, villages: [...u.villages] }));
}

export function saveUsers(list) {
  try { window.localStorage.setItem(USERS_KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  return list;
}

export function findUser(username) {
  const name = String(username || '').trim().toLowerCase();
  return loadUsers().find((u) => u.username === name) || null;
}

export function updateUser(id, patch) {
  return saveUsers(loadUsers().map((u) => (u.id === id ? { ...u, ...patch } : u)));
}

export function nextId(list) {
  return list.reduce((m, u) => Math.max(m, u.id), 0) + 1;
}
