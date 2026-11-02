import { useEffect, useState } from 'react';

function FormulaireMembre({ membreAModifier, onEnvoyer, onAnnuler, enCours }) {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (membreAModifier) {
      setNom(membreAModifier.nom);
      setEmail(membreAModifier.email);
    } else {
      setNom('');
      setEmail('');
    }
  }, [membreAModifier]);

  function envoyer(e) {
    e.preventDefault();
    onEnvoyer({ nom: nom, email: email });
  }

  return (
    <form onSubmit={envoyer}>
      <h2>{membreAModifier ? 'Modifier le membre' : 'Ajouter un membre'}</h2>

      <div>
        <label>
          Nom :{' '}
          <input value={nom} onChange={(e) => setNom(e.target.value)} required />
        </label>
      </div>

      <div>
        <label>
          Email :{' '}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
      </div>

      <button type="submit" disabled={enCours}>
        {enCours ? 'Envoi...' : membreAModifier ? 'Enregistrer' : 'Ajouter'}
      </button>

      {membreAModifier && (
        <button type="button" onClick={onAnnuler}>
          Annuler
        </button>
      )}
    </form>
  );
}

export default FormulaireMembre;
