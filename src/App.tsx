import './App.css';
import Canva from './components/canva/Canva.tsx';
import Sidebar from './components/sidebar/Sidebar.tsx';
import { useEffect, useState } from 'react';

function App() {
  const [year, setYear] = useState<string>(() => {
    return localStorage.getItem('canva:year') || '26';
  });
  const [institution, setInstitution] = useState<string>(() => {
    return (
      localStorage.getItem('canva:institution') ||
      'КЗВО ЛОР "Львівська медична академія'
    );
  });
  const [institution2, setInstitution2] = useState<string>(() => {
    return (
      localStorage.getItem('canva:institution2') || 'імені Андрея Крупинського"'
    );
  });

  useEffect(() => {
    localStorage.setItem('canva:year', year);
  }, [year]);

  useEffect(() => {
    localStorage.setItem('canva:institution', institution);
  }, [institution]);
  useEffect(() => {
    localStorage.setItem('canva:institution2', institution2);
  }, [institution2]);

  return (
    <>
      <header>
        <h1>header</h1>
      </header>
      <main className="flex flex-1">
        <section className="flex-1 bg-gray-50 dark:bg-slate-800 p-6">
          <Sidebar
            year={year}
            setYear={setYear}
            institution={institution}
            setInstitution={setInstitution}
            institution2={institution2}
            setInstitution2={setInstitution2}
          />
        </section>
        <section className="flex-4 dark:bg-slate-900 p-6 ">
          <Canva
            year={year}
            institution={institution}
            institution2={institution2}
          />
        </section>
      </main>
    </>
  );
}

export default App;
