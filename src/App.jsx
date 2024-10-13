import React from "react";
import {CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./themes/themes2";
import { Layout } from "./components/Layout/Layout";

import {Outlet} from 'react-router-dom'

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      <Layout>
        <Outlet/>
      </Layout>
    </ThemeProvider>
  );
}
