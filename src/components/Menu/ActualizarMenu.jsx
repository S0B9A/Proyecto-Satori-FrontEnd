import React from "react";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import { FormHelperText, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import ProductoService from "../../Services/ProductoServices";
import CombosServices from "../../Services/CombosServices";
import { SelectProductos } from "../Combo/Form/SelectProductos";
import MenuServices from "../../Services/MenuServices";
import { SelectCombos } from "./Form/SelectCombos";

export function ActualizarMenu() {
  //Url para acceder a la imagenes guardadas en el API
  const navigate = useNavigate();
  const routeParams = useParams();

  //Id del menu a actualizar
  const id = routeParams.id || null;

  //Valores a precargar en el formulario, vienen del API
  const [values, setValores] = useState(null);

  useEffect(() => {
    if (id !== undefined && !isNaN(Number(id))) {
      MenuServices.getMenuById(id)
        .then((response) => {
          console.log(response.data);
          setError(response.error);

          // Verificar si "productos" es un array antes de mapearlo
          const productos = Array.isArray(response.data.productos)
            ? response.data.productos.map((item) => item.id)
            : [];
          response.data.productos = productos;

          setValores(response.data);

          // Verificar si "productos" es un array antes de mapearlo
          const combos = Array.isArray(response.data.combos)
            ? response.data.combos.map((item) => item.id)
            : [];
          response.data.combos = combos;

          setValores(response.data);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
          throw new Error("Respuesta no válida del servidor");
        });
    }
  }, [id]);

  // Esquema de validación
  const MenuSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre del combo es requerido")
      .min(4, "El nombre del combo debe tener al menos 4 caracteres"),
    // Validaciones para fechas y horas en formato HH:mm:ss
    fecha_inicio: yup
      .date()
      .required("La fecha de inicio es requerida")
      .typeError("Fecha de inicio no válida"),
    fecha_fin: yup
      .date()
      .min(
        yup.ref("fecha_inicio"),
        "La fecha de fin debe ser posterior a la fecha de inicio"
      )
      .required("La fecha de fin es requerida")
      .typeError("Fecha de fin no válida"),
    hora_inicio: yup
      .string()
      .required("La hora de inicio es requerida")
      .matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
        "Hora de inicio no válida (formato HH:mm:ss)"
      ),
    hora_fin: yup
      .string()
      .required("La hora de fin es requerida")
      .matches(
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
        "Hora de fin no válida (formato HH:mm:ss)"
      ),
    productos: yup.array().min(1, "Los productos son requeridos, minimo 1"),
    combos: yup.array().min(1, "Los combos son requeridos, minimo 1"),
  });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      fecha_inicio: "",
      fecha_fin: "",
      hora_inicio: "",
      hora_fin: "",
      productos: [],
      combos: [],
    },
    //Valores a precargar en el formulario
    values,
    // Asignación de validaciones
    resolver: yupResolver(MenuSchema),
  });

  const [error, setError] = useState("");

  // Accion submit
  const onSubmit = (DataForm) => {
    console.log("Formulario:");
    console.log(DataForm);

    try {
      if (MenuSchema.isValid()) {
        //Actualizar menu
        MenuServices.updateMenu(DataForm)
          .then((response) => {
            console.log(response);
            setError(response.error);

            //Respuesta al usuario de creación
            if (response.data != null) {
              toast.success(
                `Menu actualizada #:${response.data.id} - ${response.data.nombre}`,
                {
                  duration: 4000,
                  position: "top-center",
                }
              );
            }

            // Redireccion a la tabla
            return navigate("/menu-table");
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
      //Capturar error
      console.error(e);
    }
  };

  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  //Lista de tipos de productos
  const [dataProductos, setDataProductos] = useState({});
  const [loadedProductos, setLoadedProductos] = useState(false);
  useEffect(() => {
    ProductoService.getProductos()
      .then((response) => {
        console.log(response);
        setDataProductos(response.data);
        setLoadedProductos(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        setLoadedProductos(false);
        throw new Error("Respuesta no válida del servidor");
      });
  }, []);

  //Lista de tipos de combos
  const [dataCombos, setDataCombos] = useState({});
  const [loadedCombos, setLoadedCombos] = useState(false);
  useEffect(() => {
    CombosServices.getCombos()
      .then((response) => {
        console.log(response);
        setDataCombos(response.data);
        setLoadedCombos(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
        setLoadedCombos(false);
        throw new Error("Respuesta no válida del servidor");
      });
  }, []);

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
                src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png" // Reemplaza esta URL con la de una flor de cerezo
                alt="Flor de Cerezo"
                style={{
                  width: "20px",
                  height: "auto",
                  display: "inline-block",
                  marginRight: "10px",
                  marginLeft: "10px",
                }}
              />
              Actualizar Combos
              <img
                src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png" // Reemplaza esta URL con la de una flor de cerezo
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

          {/* Sección Izquierda - Campos */}
          <Grid item xs={12} sm={6}>
            <FormControl variant="standard" fullWidth>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="nombre"
                    label="Nombre"
                    error={Boolean(errors.nombre)}
                    helperText={errors.nombre?.message}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <Controller
                name="fecha_inicio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="fecha_inicio"
                    label="Fecha de Inicio"
                    type="date"
                    InputLabelProps={{ shrink: true }} // Hace que la etiqueta no se superponga con la fecha
                    error={Boolean(errors.fecha_inicio)}
                    helperText={errors.fecha_inicio?.message}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <Controller
                name="fecha_fin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="fecha_fin"
                    label="Fecha final"
                    type="date"
                    InputLabelProps={{ shrink: true }} // Hace que la etiqueta no se superponga con la fecha
                    error={Boolean(errors.fecha_fin)}
                    helperText={errors.fecha_fin?.message}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <Controller
                name="hora_inicio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="hora_inicio"
                    label="Hora de inicio"
                    type="text" // Cambiar a texto para aceptar HH:mm:ss
                    placeholder="HH:mm:ss" // Placeholder para guiar al usuario
                    error={Boolean(errors.hora_inicio)}
                    helperText={errors.hora_inicio?.message}
                    inputProps={{
                      pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", // Expresión regular para validar el formato HH:mm:ss
                    }}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              <Controller
                name="hora_fin"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="hora_fin"
                    label="Hora Final"
                    type="text" // Cambiar a texto para aceptar HH:mm:ss
                    placeholder="HH:mm:ss" // Placeholder para guiar al usuario
                    error={Boolean(errors.hora_fin)}
                    helperText={errors.hora_fin?.message}
                    inputProps={{
                      pattern: "^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", // Expresión regular para validar el formato HH:mm:ss
                    }}
                  />
                )}
              />
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              {loadedProductos && (
                <Controller
                  name="productos"
                  control={control}
                  render={({ field }) => (
                    <SelectProductos field={field} data={dataProductos} />
                  )}
                />
              )}
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {" "}
                {errors.productos?.message}
              </FormHelperText>
            </FormControl>

            <FormControl fullWidth sx={{ mt: 2 }}>
              {loadedCombos && (
                <Controller
                  name="combos"
                  control={control}
                  render={({ field }) => (
                    <SelectCombos field={field} data={dataCombos} />
                  )}
                />
              )}
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {" "}
                {errors.combos?.message}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Actualizar Menu
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
