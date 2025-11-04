const ENV = import.meta.env;

const HOST = ENV.VITE_API_HOST || 'localhost';
const PORT = ENV.VITE_API_PORT ? `:${ENV.VITE_API_PORT}` : '';
const BASE = ENV.VITE_API_BASE || '/api';
const API_BASE_URL = `http://${HOST}${PORT}${BASE}`.replace(/\/$/, '');

export const userService = {
  async getAll() {

    const url = /\/users$/.test(BASE) ? `${API_BASE_URL}` : `${API_BASE_URL}/users`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async create(user) {
    const url = /\/users$/.test(BASE) ? `${API_BASE_URL}` : `${API_BASE_URL}/users`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async update(id, user) {
    const url = /\/users$/.test(BASE) ? `${API_BASE_URL}/${id}` : `${API_BASE_URL}/users/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async delete(id) {
    const url = /\/users$/.test(BASE) ? `${API_BASE_URL}/${id}` : `${API_BASE_URL}/users/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');

    try {
      return await response.json();
    } catch {
      return { ok: true };
    }
  },
};