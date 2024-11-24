import * as React from 'react';
import { useState, useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import UserService from '../../Services/UserService';
import { UserContext } from '../../contexts/UserContext';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

export function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);

  // Esquema de validación
  const loginSchema = yup.object({
    email: yup
      .string()
      .required('El email es requerido')
      .email('Formato inválido'),
    contraseña: yup.string().required('La contraseña es requerida'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      contraseña: '',
    },
    resolver: yupResolver(loginSchema),
  });

  const [error, setError] = useState(null);

  const onSubmit = (DataForm) => {
    try {
      UserService.loginUser(DataForm)
        .then((response) => {
          if (
            response.data &&
            response.data !== 'Usuario no valido'
          ) {
            saveUser(response.data);
            toast.success('Bienvenido, usuario', {
              duration: 4000,
              position: 'top-center',
            });
            navigate('/');
          } else {
            toast.error('Usuario NO válido', {
              duration: 4000,
              position: 'top-center',
            });
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setError(error);
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  const onError = (errors, e) => console.log(errors, e);

  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <>
      <Toaster />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        bgcolor="#f5f5f5"
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%' }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="email"
                        label="Correo Electrónico"
                        variant="outlined"
                        error={Boolean(errors.email)}
                        helperText={errors.email?.message || ''}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl variant="standard" fullWidth>
                  <Controller
                    name="contraseña"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="contraseña"
                        label="Contraseña"
                        type="password"
                        variant="outlined"
                        error={Boolean(errors.contraseña)}
                        helperText={errors.contraseña?.message || ''}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    py: 1.5,
                  }}
                >
                  Iniciar Sesión
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
}
