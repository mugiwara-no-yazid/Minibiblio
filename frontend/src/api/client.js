import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { Accept: 'application/json' },
});

export function messageErreur(erreur) {
  const reponse = erreur.response;

  if (!reponse) {
    return "Impossible de joindre l'API.";
  }
  if (reponse.data && reponse.data.errors) {
    const messages = [];
    for (const champ in reponse.data.errors) {
      reponse.data.errors[champ].forEach((m) => messages.push(m));
    }
    return messages.join(' ');
  }
  if (reponse.data && reponse.data.message) {
    return reponse.data.message;
  }

  return 'Une erreur est survenue.';
}
