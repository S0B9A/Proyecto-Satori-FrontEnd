import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import demoTheme from "../../themes/theme"; 
import logo from "../Image/logo2.png";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InventoryIcon from '@mui/icons-material/Inventory'; // Para Productos
import BuildIcon from '@mui/icons-material/Build'; // Para Mantenimiento
import FastfoodIcon from '@mui/icons-material/Fastfood'; // Para Combos
import MenuBookIcon from '@mui/icons-material/MenuBook'; // Para Menu Actual
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'; // Para Nuestros Menus
import PlaceIcon from '@mui/icons-material/Place'; // Para Nuestras Estaciones

// Crear un tema personalizado para aplicar la fuente y colores
const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP, sans-serif', // Fuente asiática
    h4: {
      color: '#B22222', // Color rojizo oscuro
      fontSize: '1.5rem', // Tamaño de letra más pequeño
    },
    h6: {
      fontSize: '1rem', // Tamaño de letra más pequeño para títulos de productos y combos
    },
  },
});


const NAVIGATION = [
  {
    segment: 'producto',
    title: 'Productos',
    icon: <InventoryIcon />, // Icono para Productos
  },
  {
    segment: 'combo',
    title: 'Combos',
    icon: <FastfoodIcon />, // Icono para Combos
  },
  {
    segment: 'menu',
    title: 'Menu Actual',
    icon: <MenuBookIcon />, // Icono para Menu Actual
  },
  {
    segment: 'menus',
    title: 'Nuestros Menus',
    icon: <RestaurantMenuIcon />, // Icono para Nuestros Menus
  },
  {
    segment: 'estaciones',
    title: 'Nuestras Estaciones',
    icon: <PlaceIcon />, // Icono para Nuestras Estaciones
  },
  {
    segment: 'mantenimiento',
    title: 'Mantenimiento',
    icon: <BuildIcon />, // Icono para mantenimiento
  },

];

function Header(props) {
  const { window } = props;
  const [pathname, setPathname] = useState("/dashboard");
  const navigate = useNavigate(); // Obtén la función navigate

  const router = useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        setPathname(String(path));
        navigate(path); // Navega a la nueva ruta
      },
    }),
    [pathname, navigate]
  );

  const demoWindow = window !== undefined ? window() : undefined;

  const handleNavigation = (segment) => {
    setPathname(`/${segment}`);
    navigate(`/${segment}`); // Navega a la nueva ruta
  };

 
  return (
    <ThemeProvider theme={theme}>
    <AppProvider
      navigation={NAVIGATION.map((item) => ({
        ...item,
        onClick: () => handleNavigation(item.segment), // Manejar clic
      }))}
      router={router}
      branding={{
        logo: <img src={logo} alt="MUI logo" />,
        title: "Satori Asian Cuisine",
      }}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        {/* Aquí se coloca el contenido dinámico */}
        {props.children}
      </DashboardLayout>
    </AppProvider>
    </ThemeProvider>
  );
  
}

Header.propTypes = {
  window: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default Header;
