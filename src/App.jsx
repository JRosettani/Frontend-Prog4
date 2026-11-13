import { Router, Route, Switch, Redirect } from "wouter";
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
import Login from "./pages/login";
import Registro from "./pages/registro";
import Pedido from "./pages/pedidos";
import DetallePedido from "./pages/detallePedido";
import { useAuthStore } from "./stores/auth";

function App() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <>
      <a
        href="#contenido"
        className="sr-only rounded-md bg-accent px-4 py-2 text-sm font-semibold text-on-accent focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-20"
      >
        Saltar al contenido
      </a>
      <Navbar />
      <main
        id="contenido"
        className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
      >
        <Router>
          {isAuthenticated ? (
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
            </Switch>
          ) : (
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
          )}
        </Router>
      </main>
    </>
  );
}

export default App;
