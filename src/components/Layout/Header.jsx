import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate, Link } from "react-router-dom";
import demoTheme from "../../themes/theme"; 
import logo from "../Image/logo2.png";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import InventoryIcon from '@mui/icons-material/Inventory';
import BuildIcon from '@mui/icons-material/Build';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import PlaceIcon from '@mui/icons-material/Place';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import { useCart } from "../../hook/UseCart";

// Crear un tema personalizado para aplicar la fuente y colores
const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP, sans-serif',
    h4: {
      color: '#B22222',
      fontSize: '1.5rem',
    },
    h6: {
      fontSize: '1rem',
    },
  },
});

const NAVIGATION = [
  {
    segment: 'producto',
    title: 'Productos',
    icon: <InventoryIcon />,
  },
  {
    segment: 'combo',
    title: 'Combos',
    icon: <FastfoodIcon />,
  },
  {
    segment: 'menu',
    title: 'Menu Actual',
    icon: <MenuBookIcon />,
  },
  {
    segment: 'menus',
    title: 'Nuestros Menus',
    icon: <RestaurantMenuIcon />,
  },
  {
    segment: 'estaciones',
    title: 'Nuestras Estaciones',
    icon: <PlaceIcon />,
  },
  {
    segment: 'mantenimiento',
    title: 'Mantenimiento',
    icon: <BuildIcon />,
  },
];

function Header(props) {
  //Mostrar cantidad de elementos de la compra
  const { cart, getCountItems } = useCart();
  const { window } = props;
  const [pathname, setPathname] = useState("/dashboard");
  const navigate = useNavigate();

  const router = useMemo(
    () => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => {
        setPathname(String(path));
        navigate(path);
      },
    }),
    [pathname, navigate]
  );

  const demoWindow = window !== undefined ? window() : undefined;

  const handleNavigation = (segment) => {
    setPathname(`/${segment}`);
    navigate(`/${segment}`);
  };


  return (
    <ThemeProvider theme={theme}>
      <AppProvider
        navigation={NAVIGATION.map((item) => ({
          ...item,
          onClick: () => handleNavigation(item.segment),
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
         {/* Botones con iconos de carrito y notificaciones */}
         <IconButton 
            size="large" 
            sx={{ 
              color: 'red', 
              position: 'fixed', 
              transform: 'scale(1.0)', // Aumenta ligeramente el tamaño
              marginTop: '14px',
              marginLeft: '1590px'
              
            }}
          >
            <Badge badgeContent={getCountItems(cart)} component={Link} to='/rental/crear/'>
              <ShoppingCartIcon sx={{ color: 'red' }} />
            </Badge>
          </IconButton>

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
