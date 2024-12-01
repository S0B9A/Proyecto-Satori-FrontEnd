import React, { useMemo, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate, Link } from "react-router-dom";
import demoTheme from "../../themes/theme";
import logo from "../Image/logo2.png";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InventoryIcon from "@mui/icons-material/Inventory";
import BuildIcon from "@mui/icons-material/Build";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import KitchenIcon from "@mui/icons-material/Kitchen";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ListAltIcon from "@mui/icons-material/ListAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PlaceIcon from "@mui/icons-material/Place";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useCart } from "../../hook/useCart";
import { useCartCombo } from "../../hook/useCartCombo";
import { UserContext } from "../../contexts/UserContext";

// Crear un tema personalizado para aplicar la fuente y colores
const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans JP, sans-serif",
    h4: {
      color: "#B22222",
      fontSize: "1.5rem",
    },
    h6: {
      fontSize: "1rem",
    },
  },
});



function Header(props) {
  //Obtener el usuario autenticado con el token y decodificarlo
  //Informacion del usuario logueado
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);

  const { cart, getCountItems } = useCart();
  const { cartCombo, getCountItemscombo } = useCartCombo();  // Cambiar cartCombo a cart



  const { window } = props;
  const [pathname, setPathname] = useState("/dashboard");
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Lista enlaces menu usuario
  const userItems = [
    { name: "Login", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Logout", link: "/user/logout", login: true },
  ];

  const NAVIGATION = [
    {
      segment: "producto",
      title: "Productos",
      icon: <InventoryIcon />,
      roles: null,
    },
    {
      segment: "combo",
      title: "Combos",
      icon: <FastfoodIcon />,
      roles: null,
    },
    {
      segment: "menu",
      title: "Menu Actual",
      icon: <MenuBookIcon />,
      roles: ["Administrador" , "Cliente"],
    },
    {
      segment: "menus",
      title: "Nuestros Menus",
      icon: <RestaurantMenuIcon />,
      roles: null,
    },
    {
      segment: "estaciones",
      title: "Nuestras Estaciones",
      icon: <PlaceIcon />,
      roles: null,
    },
    {
      segment: "mantenimiento",
      title: "Mantenimiento",
      icon: <BuildIcon />,
      roles: ["Administrador"],
    },
    {
      segment: `pedido/pedidosUsuario/${userData.id}`,
      title: "Historial de pedidos",
      icon: <ListAltIcon />,
      roles: ["Cliente"],
    },
    {
      segment: `pedido/historialPedidos`,
      title: "Historial de pedidos",
      icon: <ListAltIcon />,
      roles: ["Administrador"],
    },
    {
      segment: `pedido/Dashboard/`,
      title: "Dashboard de pedidos",
      icon: <DashboardIcon />,
      roles: ["Administrador"],
    },
    {
      segment: `cocina`,
      title: "Cocina",
      icon: <KitchenIcon />,
      roles: ["Administrador"],
    },
  ];

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

  const handleUserMenuOpen = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <AppProvider
        navigation={NAVIGATION.filter((item) => {
          // Si el item tiene roles, se verifica si el usuario está autorizado
          if (item.roles) {
            return autorize({ requiredRoles: item.roles });
          }
          // Si no tiene roles (es null), se permite el acceso a todos
          return item.roles === null;
        }).map((item) => ({
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
              color: "red",
              transform: "scale(1.0)",
              marginTop: "14px",
              marginLeft: "1px",
              width: "100px",
            }}
          >
            <Badge
              badgeContent={getCountItems(cart) + getCountItemscombo(cartCombo) }
              component={Link}
              to="/pedido/Registrar/"
            >
              <ShoppingCartIcon sx={{ color: "red" }} />
            </Badge>
          </IconButton>

          {/* Menú de usuario */}
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="user-menu"
              aria-haspopup="true"
              onClick={handleUserMenuOpen}
              color="red"
              sx={{
                color: "red",
                transform: "scale(1.0)",
                marginTop: "5px",
                marginLeft: "10px",
                width: "80px",
              }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleUserMenuClose}
            >
              {userData && (
                <MenuItem>
                  <Typography variant="subtitle1" gutterBottom>
                    {userData?.email}
                  </Typography>
                </MenuItem>
              )}

              {userItems.map((setting, index) => {
                if (
                  setting.login &&
                  userData &&
                  Object.keys(userData).length > 0
                ) {
                  return (
                    <MenuItem key={index} component={Link} to={setting.link}>
                      <Typography sx={{ textAlign: "center" }}>
                        {setting.name}
                      </Typography>
                    </MenuItem>
                  );
                } else if (
                  !setting.login &&
                  Object.keys(userData).length === 0
                ) {
                  return (
                    <MenuItem key={index} component={Link} to={setting.link}>
                      <Typography sx={{ textAlign: "center" }}>
                        {setting.name}
                      </Typography>
                    </MenuItem>
                  );
                }
              })}
              
            </Menu>
          </Box>

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
