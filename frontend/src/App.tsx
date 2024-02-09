import { useState } from 'react';
import HomePage from './components/HomePage';
import ResultsPage from './components/ResultsPage';

const App = () => {
  const [page, setPage] = useState('home');
  return (
    <main className="site">
      <header className="heading_logo">
        <h1>FinScan Pro</h1>
      </header>

      <div className="homepage">
        {page === 'home' && <HomePage setPage={setPage} />}
      </div>
      <div className="resultspage">
        {page === 'results' && <ResultsPage setPage={setPage} />}
      </div>
    </main>
  );
};

export default App;
