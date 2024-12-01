import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FormControl, Grid, Typography, TextField, Button, MenuItem, Select, FormHelperText } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import CocinaServices from "../../Services/CocinaServices";
import EstacionServices from "../../Services/EstacionServices";
import { SelectEstancion } from "./Form/SelectEstaciones";

export function ActualizarPedidoCocina() {
  // Navegación y parámetros
  const navigate = useNavigate();
  const routeParams = useParams();
  const id = routeParams.id || null;

  // Estado para valores precargados
  const [values, setValores] = useState(null);
  const [error, setError] = useState("");
  const [loadedEstados, setLoadedEstados] = useState(false);
  const [dataEstados, setDataEstados] = useState([]);

  // Estado para obtener los datos de la estación
  const [dataEstacion, setDataEstacion] = useState({});
  const [loadedEstacion, setLoadedEstancion] = useState(false);

  // Obtener datos de la API cuando se carga el componente
  useEffect(() => {
    if (id !== undefined && !isNaN(Number(id))) {
      CocinaServices.getCocinaProducto(id)
        .then((response) => {
          console.log(response.data);
          setValores(response.data);
          
          // Extraer el id_producto de la respuesta
          const idProducto = response.data.id_producto;
          
          // Solo hacer la segunda solicitud si tenemos id_producto
          if (idProducto) {
            EstacionServices.getEstacionesPorProductoID(idProducto)
              .then((response) => {
                console.log(response);
                setDataEstacion(response.data);
                setLoadedEstancion(true);
              })
              .catch((error) => {
                if (error instanceof SyntaxError) {
                  console.log(error);
                  setError(error);
                  setLoadedEstancion(false);
                  throw new Error("Respuesta no válida del servidor");
                }
              });
          }
        })
        .catch((error) => {
          console.log(error);
          setError(error);
          throw new Error("Respuesta no válida del servidor");
        });
    }

    // Simulación de carga de estados
    const estados = [
      { id: 1, nombre: "Listo" },
      { id: 2, nombre: "En preparacion" },
    ];
    setDataEstados(estados);
    setLoadedEstados(true);
  }, [id]);

  // Esquema de validación con yup
  const PedidoSchema = yup.object({
    estado: yup
      .string()
      .required("El estado del pedido es requerido")
      .min(4, "El estado del pedido debe tener al menos 4 caracteres"),
    id_estacion: yup
      .number()
      .typeError('Seleccione una estación')
      .required('La estación es requerida'),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      estado: "",
      id_estacion: "",
    },
    values, // Valores a precargar en el formulario
    resolver: yupResolver(PedidoSchema), // Asignación de validaciones
  });

  // Función para el submit del formulario
  const onSubmit = (DataForm) => {
    console.log("Formulario:");
    console.log(DataForm);

    try {
      if (PedidoSchema.isValid()) {
        // Actualizar el pedido
        CocinaServices.updatePedidoProducto(DataForm)
          .then((response) => {
            console.log(response);
            setError(response.error);

            // Respuesta al usuario
            if (response.data != null) {
              toast.success(
                `Producto pedido actualizado #:${response.data.id} - ${response.data.estado} - ${response.data.id_estacion} `,
                {
                  duration: 4000,
                  position: "top-center",
                }
              );
            }

            // Redireccionar a la tabla
            navigate("/cocina");
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error("Respuesta no válida del servidor");
            }
          });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Si ocurre error
  const onError = (errors, e) => console.log(errors, e);

  // Renderizado del componente
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1} sx={{ padding: 10 }}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              align="center"
              gutterBottom
              sx={{ marginBottom: 3 }}
            >
              <img
                src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png"
                alt="Flor de Cerezo"
                style={{
                  width: "20px",
                  height: "auto",
                  display: "inline-block",
                  marginRight: "10px",
                  marginLeft: "10px",
                }}
              />
              Actualizar Pedido Producto
              <img
                src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png"
                alt="Flor de Cerezo"
                style={{
                  width: "20px",
                  height: "auto",
                  display: "inline-block",
                  marginRight: "10px",
                  marginLeft: "10px",
                }}
              />
            </Typography>
          </Grid>

          {/* Sección de Campos */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              {loadedEstados && (
                <Controller
                  name="estado"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      onChange={(e) =>
                        setValue("estado", e.target.value, { shouldValidate: true })
                      }
                    >
                      <MenuItem value="" disabled>
                        Selecciona un estado del producto
                      </MenuItem>
                      {dataEstados.map((tipo) => (
                        <MenuItem key={tipo.id} value={tipo.nombre}>
                          {tipo.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              )}
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.estado?.message}
              </FormHelperText>
            </FormControl>


            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              {/* Lista de directores */}
              {loadedEstacion && (
                <Controller
                name='id_estacion'
                control={control}
                render={({field})=>(
                  <SelectEstancion field={field} data={dataEstacion} 
                  error={Boolean(errors.id_estacion)} />
                )}
                 />
              )}
              <FormHelperText sx={{color: '#d32f2f'}}>
                {errors.id_estacion ? errors.id_estacion.message : ' '}
              </FormHelperText>
            </FormControl>

          </Grid>

          {/* Botón de submit */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Actualizar Pedido Producto
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
