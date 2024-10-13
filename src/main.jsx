import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Home } from "./components/Home/Home.jsx";
import { ListaProductos } from "./components/Producto/ListaProductos.jsx";
import { DetalleProducto } from "./components/Producto/DetalleProducto.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PageNotFound } from "./components/Home/PageNotFound.jsx";
import { ListaCombos } from "./components/Combo/ListaCombos.jsx";
import {DetalleCombo} from "./components/Combo/DetalleCombo.jsx";
import {MenuActual} from "./components/Menu/MenuActual.jsx";
import {ListaMenus} from "./components/Menu/ListaMenus.jsx";
import {ListaEstaciones} from "./components/Estacion/ListaEstaciones.jsx";

const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <MenuActual />,
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
        path: "/menus",
        element: <ListaMenus/>,
      },
      {
        path: "/estaciones",
        element: <ListaEstaciones/>,
      },
      
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>
);
