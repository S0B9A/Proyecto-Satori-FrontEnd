import React, { useState } from 'react';
import {
  FormControl,
  Grid,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import UserService from '../../services/UserService';
import { Email, Lock, Person } from '@mui/icons-material';

export function Signup() {
  const navigate = useNavigate();

  // Esquema de validación con Yup
  const loginSchema = yup.object({
    nombre: yup.string().required('El nombre es requerido'),
    email: yup.string().required('El email es requerido').email('Formato inválido'),
    contraseña: yup.string().required('La contraseña es requerida'),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: '',
      email: '',
      contraseña: '',
      rol_id: 2,
    },
    resolver: yupResolver(loginSchema),
  });

  const [error, setError] = useState(null);

  const notify = () =>
    toast.success('Usuario registrado', {
      duration: 4000,
      position: 'top-center',
    });

  const onSubmit = (DataForm) => {
    try {
      setValue('rol_id', 2); // Rol asignado por defecto
      UserService.createUser(DataForm)
        .then(() => {
          notify();
          navigate('/user/login/');
        })
        .catch((error) => {
          setError(error);
          console.error(error);
        });
    } catch (e) {
      console.error(e);
    }
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: '#f9f9f9',
      }}
      noValidate
    >
      <Typography variant="h4" align="center" gutterBottom>
        Registro de Usuario
      </Typography>
      <Grid container spacing={2}>
        {/* Campo de Nombre */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  placeholder="Ingresa tu nombre"
                  error={Boolean(errors.nombre)}
                  helperText={errors.nombre?.message}
                  InputProps={{
                    startAdornment: <Person sx={{ marginRight: 1 }} />,
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
        {/* Campo de Email */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  placeholder="correo@ejemplo.com"
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: <Email sx={{ marginRight: 1 }} />,
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
        {/* Campo de Contraseña */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Controller
              name="contraseña"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Contraseña"
                  placeholder="Ingresa tu contraseña"
                  type="password"
                  error={Boolean(errors.contraseña)}
                  helperText={errors.contraseña?.message}
                  InputProps={{
                    startAdornment: <Lock sx={{ marginRight: 1 }} />,
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>
        {/* Botón de Registro */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              padding: 1.5,
              fontWeight: 'bold',
              textTransform: 'none',
              ':hover': {
                backgroundColor: '#005cbf',
              },
            }}
          >
            Registrarse
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
