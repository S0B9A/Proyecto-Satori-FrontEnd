import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { NAVIGATION } from "./Navegacion";
import demoTheme from "./Theme";
import logo from "./Logo.png";

function Header(props) {
  const { window } = props;
  const [pathname, setPathname] = useState("/dashboard");

  const router = useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    }),
    [pathname]
  );

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      branding={{
        logo: <img src={logo} alt="MUI logo" />,
        title: "Asian Cuisine ",
      }}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        {/* Aquí se coloca el contenido dinámico */}
        {props.children}
      </DashboardLayout>
    </AppProvider>
  );
}

Header.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Header;
