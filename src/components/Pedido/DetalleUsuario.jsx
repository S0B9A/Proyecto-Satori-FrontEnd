import React, { useEffect, useContext, useState } from "react";
import { Grid, Typography, Box } from "@mui/material";
import { UserContext } from "../../contexts/UserContext";
import UserService from "../../Services/UserService";

export function DetalleUsuario() {
  const { user, decodeToken } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());

  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);

const [dataUsersUsarioIngresado, setDataUsersUsarioIngresado] =
  useState(null);
const [loadedUsersUsarioIngresado, setLoadedUsersUsarioIngresado] =useState(false);
const [error, setError] = useState(null);

// Obtiene datos específicos de un usuario
useEffect(() => {
  if (userData?.id) {
    UserService.getUsuario(userData.id)
      .then((response) => {
        console.log(userData.id);
        console.log(response);
        setDataUsersUsarioIngresado(response.data);
        setLoadedUsersUsarioIngresado(true);
      })
      .catch((error) => {
        setError(error);
        setLoadedUsersUsarioIngresado(true);
      });
  } else {
    console.error("ID no disponible, llamada al servicio no realizada.");
  }
}, [userData.id]);

if (!loadedUsersUsarioIngresado) return <p>Cargando...</p>;
if (error) return <p>Error: {error.message}</p>;

  const userRole = userData?.rol?.name || ""; // Obtiene el rol del usuario
  const userName = dataUsersUsarioIngresado?.nombre || ""; // Nombre del usuario
  const userEmail = userData?.email || ""; // Email del usuario

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "16px",
        backgroundColor: "#f9f9f9",
        marginTop: "16px",
      }}
    >
      <Typography variant="h6" gutterBottom>
        {userRole === "Administrador" ? "Empleado" : "Cliente"}
      </Typography>
      <Typography variant="body1">
        <strong>Nombre:</strong> {userName}
      </Typography>
      <Typography variant="body1">
        <strong>Email:</strong> {userEmail}
      </Typography>
    </Box>
  );
}
