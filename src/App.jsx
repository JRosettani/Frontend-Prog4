import { Router, Route } from "wouter";
import Navbar from "./components/navbar";
import Inicio from "./pages/inicio";
import Categorias from "./pages/categorias";
import Categoria from "./pages/categoria";

function App() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only rounded-md bg-blue px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-20"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main
        id="contenido"
        className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
      >
        <Router>
          <Route path="/">
            <Inicio />
          </Route>
          <Route path="/categorias">
            <Categorias />
          </Route>
          <Route path="/categorias/:id">
            <Categoria />
          </Route>
        </Router>
      </main>
    </>
  );
}

export default App;
