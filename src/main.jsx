import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Home } from "./components/Home/Home.jsx";
import { ListaProductos } from "./components/Producto/ListaProductos.jsx";
import { DetalleProducto } from "./components/Producto/DetalleProducto.jsx";
import { DetalleMenu } from "./components/Menu/DetalleMenu.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PageNotFound } from "./components/Home/PageNotFound.jsx";
import { ListaCombos } from "./components/Combo/ListaCombos.jsx";
import { DetalleCombo } from "./components/Combo/DetalleCombo.jsx";
import { MenuActual } from "./components/Menu/MenuActual.jsx";
import { ListaMenus } from "./components/Menu/ListaMenus.jsx";
import TablaProductos from "./components/Producto/TablaProductos.jsx";
import TablaCombos from "./components/Combo/TablaCombos.jsx";
import TablaMenus from "./components/Menu/TablaMenus.jsx";
import TablaPedidos from "./components/Pedido/TablaPedidos.jsx";
import { ListaEstaciones } from "./components/Estacion/ListaEstaciones.jsx";
import { Mantenimiento } from "./components/Mantenimiento/mantenimiento.jsx";
import { ActualizarProducto } from "./components/Producto/ActualizarProducto.jsx";
import { ActualizarCombo } from "./components/Combo/ActualizarCombo.jsx";
import { ActualizarMenu } from "./components/Menu/ActualizarMenu.jsx";
import { ActualizarPedido } from "./components/Pedido/ActualizarPedido.jsx";
import { CrearProducto } from "./components/Producto/CrearProducto.jsx";
import { CrearCombo } from "./components/Combo/CrearCombo.jsx";
import { CrearMenu } from "./components/Menu/CrearMenu.jsx";
import UserProvider from "./components/Usuario/UserProvider.jsx";
import { Unauthorized } from "./components/Usuario/Unauthorized.jsx";
import { Login } from "./components/Usuario/Login.jsx";
import { Logout } from "./components/Usuario/Logout.jsx";
import { Signup } from "./components/Usuario/Signup.jsx";
import { Auth } from "./components/Usuario/Auth.jsx";


const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <MenuActual />,
      },
      {
        path:'/',
        element:<Auth requiredRoles={['Administrador']} />,
        children:[
          {
            path: "/mantenimiento",
            element: <Mantenimiento />,
          },
        ]
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
      {
        path: "/producto",
        element: <ListaProductos />,
      },
      {
        path: "/producto/:id",
        element: <DetalleProducto />,
      },
      {
        path: "/combo",
        element: <ListaCombos />,
      },
      {
        path: "/combo/:id",
        element: <DetalleCombo />,
      },
      {
        path: "/menu",
        element: <MenuActual />,
      },
      {
        path: "/menu/:id",
        element: <DetalleMenu />,
      },
      {
        path: "/menus",
        element: <ListaMenus />,
      },
      {
        path: "/estaciones",
        element: <ListaEstaciones />,
      },
      {
        path: "/producto-table",
        element: <TablaProductos />,
      },
      {
        path: "/combo-table",
        element: <TablaCombos />,
      },
      {
        path: "/menu-table",
        element: <TablaMenus />,
      },
      {
        path: "/pedido-table",
        element: <TablaPedidos />,
      },
      {
        path: "/producto/update/:id",
        element: <ActualizarProducto />,
      },
      {
        path: "/combo/update/:id",
        element: <ActualizarCombo />,
      },
      {
        path: "/menu/update/:id",
        element: <ActualizarMenu />,
      },
      {
        path: "/pedido/update/:id",
        element: <ActualizarPedido />,
      },
      {
        path: "/producto/Crear/",
        element: <CrearProducto />,
      },
      {
        path: "/combo/Crear/",
        element: <CrearCombo />,
      },
      {
        path: "/menu/Crear/",
        element: <CrearMenu />,
      },
      {
        path: '/unauthorized',
        element: <Unauthorized />
      },
      {
        path: '/user/login',
        element:<Login />
      },
      {
        path: '/user/logout',
        element:<Logout />
      },
      {
        path: '/user/create',
        element:<Signup />
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={rutas} />
    </UserProvider>
  </StrictMode>
);
