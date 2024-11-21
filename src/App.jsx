import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./themes/themes2";
import { Layout } from "./components/Layout/Layout";
import { Outlet } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { CartComboProvider } from "./contexts/CartComboContext";

export default function App() {
  return (
    <CartProvider>
      <CartComboProvider>
        <ThemeProvider theme={appTheme}>
          <CssBaseline enableColorScheme />
          <Layout>
            <Outlet />
          </Layout>
        </ThemeProvider>
      </CartComboProvider>
    </CartProvider>
  );
}
