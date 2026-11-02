import { useEffect, useState } from 'react';
import { api, messageErreur } from '../api/client.js';
import Chargement from '../components/Chargement.jsx';
import MessageErreur from '../components/MessageErreur.jsx';
import FormulaireLivre from '../components/FormulaireLivre.jsx';

function LivresPage() {
  const [livres, setLivres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [livreAModifier, setLivreAModifier] = useState(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  async function chargerLivres() {
    setChargement(true);
    try {
      const reponse = await api.get('/livres');
      setLivres(reponse.data);
    } catch (e) {
      setErreur(messageErreur(e));
    }
    setChargement(false);
  }

  useEffect(() => {
    chargerLivres();
  }, []);

  async function enregistrerLivre(donnees) {
    setErreur('');
    setEnvoiEnCours(true);
    try {
      if (livreAModifier) {
        await api.put('/livres/' + livreAModifier.id, donnees);
      } else {
        await api.post('/livres', donnees);
      }
      setLivreAModifier(null);
      await chargerLivres();
    } catch (e) {
      setErreur(messageErreur(e));
    }
    setEnvoiEnCours(false);
  }

  async function supprimerLivre(livre) {
    if (!window.confirm('Supprimer le livre "' + livre.titre + '" ?')) {
      return;
    }
    setErreur('');
    try {
      await api.delete('/livres/' + livre.id);
      await chargerLivres();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  return (
    <div>
      <h2>Livres</h2>

      <MessageErreur message={erreur} />

      <FormulaireLivre
        livreAModifier={livreAModifier}
        onEnvoyer={enregistrerLivre}
        onAnnuler={() => setLivreAModifier(null)}
        enCours={envoiEnCours}
      />

      <hr />

      {chargement ? (
        <Chargement />
      ) : livres.length === 0 ? (
        <p>Aucun livre pour le moment.</p>
      ) : (
        <table border="1" cellPadding="4">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Auteur</th>
              <th>ISBN</th>
              <th>Exemplaires</th>
              <th>Disponibles</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {livres.map((livre) => (
              <tr key={livre.id}>
                <td>{livre.titre}</td>
                <td>{livre.auteur}</td>
                <td>{livre.isbn}</td>
                <td>{livre.nombre_exemplaires}</td>
                <td>{livre.exemplaires_disponibles}</td>
                <td>
                  <button onClick={() => setLivreAModifier(livre)}>Modifier</button>{' '}
                  <button onClick={() => supprimerLivre(livre)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default LivresPage;
