import { useEffect, useState } from 'react';
import { api, messageErreur } from '../api/client.js';
import Chargement from '../components/Chargement.jsx';
import MessageErreur from '../components/MessageErreur.jsx';
import FormulaireMembre from '../components/FormulaireMembre.jsx';

function MembresPage() {
  const [membres, setMembres] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [membreAModifier, setMembreAModifier] = useState(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  async function chargerMembres() {
    setChargement(true);
    try {
      const reponse = await api.get('/membres');
      setMembres(reponse.data);
    } catch (e) {
      setErreur(messageErreur(e));
    }
    setChargement(false);
  }

  useEffect(() => {
    chargerMembres();
  }, []);

  async function enregistrerMembre(donnees) {
    setErreur('');
    setEnvoiEnCours(true);
    try {
      if (membreAModifier) {
        await api.put('/membres/' + membreAModifier.id, donnees);
      } else {
        await api.post('/membres', donnees);
      }
      setMembreAModifier(null);
      await chargerMembres();
    } catch (e) {
      setErreur(messageErreur(e));
    }
    setEnvoiEnCours(false);
  }

  async function supprimerMembre(membre) {
    if (!window.confirm('Supprimer le membre "' + membre.nom + '" ?')) {
      return;
    }
    setErreur('');
    try {
      await api.delete('/membres/' + membre.id);
      await chargerMembres();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  return (
    <div>
      <h2>Membres</h2>

      <MessageErreur message={erreur} />

      <FormulaireMembre
        membreAModifier={membreAModifier}
        onEnvoyer={enregistrerMembre}
        onAnnuler={() => setMembreAModifier(null)}
        enCours={envoiEnCours}
      />

      <hr />

      {chargement ? (
        <Chargement />
      ) : membres.length === 0 ? (
        <p>Aucun membre pour le moment.</p>
      ) : (
        <table border="1" cellPadding="4">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {membres.map((membre) => (
              <tr key={membre.id}>
                <td>{membre.nom}</td>
                <td>{membre.email}</td>
                <td>
                  <button onClick={() => setMembreAModifier(membre)}>Modifier</button>{' '}
                  <button className="btn-danger" onClick={() => supprimerMembre(membre)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MembresPage;
