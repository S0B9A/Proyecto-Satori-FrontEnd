import * as React from 'react';
import { useState, useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
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

export function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);
  // Esquema de validación
  const loginSchema = yup.object({
    email: yup
      .string()
      .required('El email es requerido')
      .email('Formato email'),
      contraseña: yup.string().required('La contraseña es requerido'),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    // Valores iniciales
    defaultValues: {
      email: '',
      contraseña: '',
    },
    // Asignación de validaciones
    resolver: yupResolver(loginSchema),
  });

  // Valores de formulario

  const [error, setError] = useState(null);
  // Accion submit
  const onSubmit = (DataForm) => {
    try {
      UserService.loginUser(DataForm)
        .then((response) => {
          console.log(response);
          if (
            response.data != null &&
            response.data != 'undefined' &&
            response.data != 'Usuario no valido'
          ) {
            //Usuario valido o identificado
            //Guardar el token
            saveUser(response.data);
            toast.success('Bienvenido, usuario', {
              duration: 4000,
              position: 'top-center',
            });
            return navigate('/');
          } else {
            //Usuario no valido
            if (
              response.data == 'undefined' &&
              response.data == 'Usuario no valido'
            ) {
              toast.error('Usuario NO válido', {
                duration: 4000,
                position: 'top-center',
              });
            }
          }
        })
        .catch((error) => {
          if (error instanceof SyntaxError) {
            console.log(error);
            setError(error);
            throw new Error('Respuesta no válida del servidor');
          }
        });
    } catch (e) {
      console.error('Error:', e);
    }
  };

  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  if (error) return <p>Error: {error.message}</p>;
  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Login
            </Typography>
          </Grid>
          <Grid size={7} sm={4}>
            {/* ['filled','outlined','standard']. */}
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="email"
                    label="Email"
                    error={Boolean(errors.email)}
                    helperText={errors.email ? errors.email.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={7} sm={4}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="contraseña"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="contraseña"
                    label="contraseña"
                    type="password"
                    error={Boolean(errors.contraseña)}
                    helperText={errors.contraseña ? errors.contraseña.message : ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={12}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ m: 1 }}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
