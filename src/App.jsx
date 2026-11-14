import { Router, Route, Switch, Redirect } from "wouter";

// Admin
import Navbar from "./components/navbar";
import Inicio from "./pages/inicio";
import Categorias from "./pages/categorias";
import Categoria from "./pages/categoria";
import Marcas from "./pages/marcas";
import Marca from "./pages/marca";
import Talles from "./pages/talles";
import Talle from "./pages/talle";
import Productos from "./pages/productos";
import Producto from "./pages/producto";
import Pedido from "./pages/pedidos";
import DetallePedido from "./pages/detallePedido";

// Usuario
import NavbarUsuario from "./components/navbarUsuario";
import HomeUsuario from "./pages/homeUsuario";

// Públicas
import Login from "./pages/login";
import Registro from "./pages/registro";

import { useAuthStore } from "./stores/auth";

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const esAdmin = useAuthStore((s) => s.esAdmin);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-accent focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-20"
      >
        Saltar al contenido
      </a>

      <Router>
        {!isAuthenticated ? (
          // ── Rutas públicas ──────────────────────────────────────
          <main
            id="contenido"
            className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
          >
            <Switch>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/registro">
                <Registro />
              </Route>
              <Route>
                <Redirect to="/login" replace />
              </Route>
            </Switch>
          </main>
        ) : esAdmin() ? (
          // ── Rutas Admin ─────────────────────────────────────────
          <>
            <Navbar />
            <main
              id="contenido"
              className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
            >
              <Switch>
                <Route path="/">
                  <Inicio />
                </Route>
                <Route path="/categorias">
                  <Categorias />
                </Route>
                <Route path="/categorias/:id">
                  <Categoria />
                </Route>
                <Route path="/marcas">
                  <Marcas />
                </Route>
                <Route path="/marcas/:id">
                  <Marca />
                </Route>
                <Route path="/talles">
                  <Talles />
                </Route>
                <Route path="/talles/:id">
                  <Talle />
                </Route>
                <Route path="/productos">
                  <Productos />
                </Route>
                <Route path="/productos/:id">
                  <Producto />
                </Route>
                <Route path="/pedidos">
                  <Pedido />
                </Route>
                <Route path="/pedidos/:id">
                  <DetallePedido />
                </Route>
                <Route path="/login">
                  <Redirect to="/" replace />
                </Route>
                <Route path="/registro">
                  <Redirect to="/" replace />
                </Route>
                <Route path="/home">
                  <Redirect to="/" replace />
                </Route>
                <Route>
                  <Redirect to="/" replace />
                </Route>
              </Switch>
            </main>
          </>
        ) : (
          // ── Rutas Usuario ────────────────────────────────────────
          <>
            <NavbarUsuario />
            <main id="contenido">
              <Switch>
                <Route path="/home">
                  <HomeUsuario />
                </Route>
                <Route path="/">
                  <Redirect to="/home" replace />
                </Route>
                <Route path="/login">
                  <Redirect to="/home" replace />
                </Route>
                <Route path="/registro">
                  <Redirect to="/home" replace />
                </Route>
                <Route>
                  <Redirect to="/home" replace />
                </Route>
              </Switch>
            </main>
          </>
        )}
      </Router>
    </>
  );
}

export default App;
