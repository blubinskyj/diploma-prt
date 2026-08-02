import './App.css';
import Sidebar from './components/sidebar/sidebar.tsx';
import Canva from './components/canva/canva.tsx';

function App() {
  return (
    <>
      <header>
        <h1>header</h1>
      </header>
      <main className="flex flex-1">
        <section className="flex-1 bg-gray-50 dark:bg-slate-800 p-6">
          <Sidebar />
        </section>
        <section className="flex-4 dark:bg-slate-900 p-6 ">
          <Canva />
        </section>
      </main>
    </>
  );
}

export default App;
