import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
});

export function getErrorMessage(error) {
  const data = error.response?.data;
  if (data?.errors) return Object.values(data.errors).flat().join(' ');
  return data?.message ?? 'Erreur réseau, réessayez.';
}