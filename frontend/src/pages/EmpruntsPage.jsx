import { useEffect, useState } from 'react';
import { api, messageErreur } from '../api/client.js';
import Chargement from '../components/Chargement.jsx';
import MessageErreur from '../components/MessageErreur.jsx';

function EmpruntsPage() {
  const [emprunts, setEmprunts] = useState([]);
  const [membres, setMembres] = useState([]);
  const [livres, setLivres] = useState([]);

  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState('');
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  // Filtre de la liste
  const [filtreMembre, setFiltreMembre] = useState('');

  // Formulaire pour emprunter
  const [membreChoisi, setMembreChoisi] = useState('');
  const [livreChoisi, setLivreChoisi] = useState('');

  async function chargerEmprunts(idMembre) {
    setChargement(true);
    try {
      let url = '/emprunts';
      if (idMembre) {
        url = url + '?membre_id=' + idMembre;
      }
      const reponse = await api.get(url);
      setEmprunts(reponse.data);
    } catch (e) {
      setErreur(messageErreur(e));
    }
    setChargement(false);
  }

  async function chargerListes() {
    try {
      const reponseMembres = await api.get('/membres');
      const reponseLivres = await api.get('/livres');
      setMembres(reponseMembres.data);
      setLivres(reponseLivres.data);
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  useEffect(() => {
    chargerListes();
    chargerEmprunts('');
  }, []);

  function changerFiltre(e) {
    const valeur = e.target.value;
    setFiltreMembre(valeur);
    chargerEmprunts(valeur);
  }

  async function emprunter(e) {
    e.preventDefault();
    setErreur('');
    setSucces('');
    setEnvoiEnCours(true);

    try {
      await api.post('/emprunts', {
        membre_id: Number(membreChoisi),
        livre_id: Number(livreChoisi),
      });
      setSucces('Emprunt enregistré.');
      setMembreChoisi('');
      setLivreChoisi('');
      await chargerEmprunts(filtreMembre);
      await chargerListes();
    } catch (e) {
      setErreur(messageErreur(e));
    }

    setEnvoiEnCours(false);
  }

  async function retourner(emprunt) {
    setErreur('');
    setSucces('');

    try {
      await api.post('/emprunts/' + emprunt.id + '/retourner');
      setSucces('Livre retourné.');
      await chargerEmprunts(filtreMembre);
      await chargerListes();
    } catch (e) {
      setErreur(messageErreur(e));
    }
  }

  return (
    <div>
      <h2>Emprunts</h2>

      <MessageErreur message={erreur} />
      {succes && <p>{succes}</p>}

      <form onSubmit={emprunter}>
        <h3>Nouvel emprunt</h3>

        <div>
          <label>
            Membre :{' '}
            <select value={membreChoisi} onChange={(e) => setMembreChoisi(e.target.value)} required>
              <option value="">-- Choisir un membre --</option>
              {membres.map((membre) => (
                <option key={membre.id} value={membre.id}>
                  {membre.nom}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label>
            Livre :{' '}
            <select value={livreChoisi} onChange={(e) => setLivreChoisi(e.target.value)} required>
              <option value="">-- Choisir un livre --</option>
              {livres.map((livre) => (
                <option key={livre.id} value={livre.id}>
                  {livre.titre} ({livre.exemplaires_disponibles} disponible(s))
                </option>
              ))}
            </select>
          </label>
        </div>

        <button type="submit" disabled={envoiEnCours}>
          {envoiEnCours ? 'Envoi...' : 'Emprunter'}
        </button>
      </form>

      <hr />

      <h3>Emprunts en cours</h3>

      <div>
        <label>
          Filtrer par membre :{' '}
          <select value={filtreMembre} onChange={changerFiltre}>
            <option value="">Tous les membres</option>
            {membres.map((membre) => (
              <option key={membre.id} value={membre.id}>
                {membre.nom}
              </option>
            ))}
          </select>
        </label>
      </div>

      {chargement ? (
        <Chargement />
      ) : emprunts.length === 0 ? (
        <p>Aucun emprunt en cours.</p>
      ) : (
        <table border="1" cellPadding="4">
          <thead>
            <tr>
              <th>Livre</th>
              <th>Membre</th>
              <th>Date d'emprunt</th>
              <th>Retour prévu</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map((emprunt) => (
              <tr key={emprunt.id}>
                <td>{emprunt.livre.titre}</td>
                <td>{emprunt.membre.nom}</td>
                <td>{emprunt.date_emprunt}</td>
                <td>{emprunt.date_retour_prevue}</td>
                <td>{emprunt.en_retard ? 'EN RETARD' : 'Dans les temps'}</td>
                <td>
                  <button onClick={() => retourner(emprunt)}>Retourner</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EmpruntsPage;
