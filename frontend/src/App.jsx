import { Link, Route, Routes } from 'react-router-dom';
import LivresPage from './pages/LivresPage.jsx';
import MembresPage from './pages/MembresPage.jsx';
import EmpruntsPage from './pages/EmpruntsPage.jsx';

function App() {
  return (
    <div>
      <h1>MiniBiblio</h1>

      <nav>
        <Link to="/">Livres</Link> | <Link to="/membres">Membres</Link> | <Link to="/emprunts">Emprunts</Link>
      </nav>

      <hr />

      <Routes>
        <Route path="/" element={<LivresPage />} />
        <Route path="/membres" element={<MembresPage />} />
        <Route path="/emprunts" element={<EmpruntsPage />} />
      </Routes>
    </div>
  );
}

export default App;
