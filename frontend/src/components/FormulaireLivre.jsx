import { useEffect, useState } from 'react';

function FormulaireLivre({ livreAModifier, onEnvoyer, onAnnuler, enCours }) {
  const [titre, setTitre] = useState('');
  const [auteur, setAuteur] = useState('');
  const [isbn, setIsbn] = useState('');
  const [nombreExemplaires, setNombreExemplaires] = useState(1);

  useEffect(() => {
    if (livreAModifier) {
      setTitre(livreAModifier.titre);
      setAuteur(livreAModifier.auteur);
      setIsbn(livreAModifier.isbn);
      setNombreExemplaires(livreAModifier.nombre_exemplaires);
    } else {
      setTitre('');
      setAuteur('');
      setIsbn('');
      setNombreExemplaires(1);
    }
  }, [livreAModifier]);

  function envoyer(e) {
    e.preventDefault();
    onEnvoyer({
      titre: titre,
      auteur: auteur,
      isbn: isbn,
      nombre_exemplaires: Number(nombreExemplaires),
    });
  }

  return (
    <form onSubmit={envoyer}>
      <h2>{livreAModifier ? 'Modifier le livre' : 'Ajouter un livre'}</h2>

      <div>
        <label>
          Titre :{' '}
          <input value={titre} onChange={(e) => setTitre(e.target.value)} required />
        </label>
      </div>

      <div>
        <label>
          Auteur :{' '}
          <input value={auteur} onChange={(e) => setAuteur(e.target.value)} required />
        </label>
      </div>

      <div>
        <label>
          ISBN :{' '}
          <input value={isbn} onChange={(e) => setIsbn(e.target.value)} required />
        </label>
      </div>

      <div>
        <label>
          Nombre d'exemplaires :{' '}
          <input
            type="number"
            min="1"
            value={nombreExemplaires}
            onChange={(e) => setNombreExemplaires(e.target.value)}
            required
          />
        </label>
      </div>

      <button type="submit" disabled={enCours}>
        {enCours ? 'Envoi...' : livreAModifier ? 'Enregistrer' : 'Ajouter'}
      </button>

      {livreAModifier && (
        <button type="button" onClick={onAnnuler}>
          Annuler
        </button>
      )}
    </form>
  );
}

export default FormulaireLivre;
