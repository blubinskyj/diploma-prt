import './App.css';
import Canva from './components/canva/Canva.tsx';
import Sidebar from './components/sidebar/Sidebar.tsx';
function App() {
  return (
    <>
      <header>
        <h2>header</h2>
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
