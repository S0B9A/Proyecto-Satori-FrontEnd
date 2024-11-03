import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FormHelperText, MenuItem, Select } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ComboService from "../../Services/CombosServices";
import { toast } from "react-hot-toast";
import ProductoServices from "../../Services/ProductoServices";
import MenuServices from "../../Services/MenuServices";
import { SelectProductos } from "../Combo/Form/SelectProductos";
import { SelectCombos } from "./Form/SelectCombos";

export function CrearMenu() {
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

  const notify = () => {
    toast.success("Menu registrado", {
      duration: 4000,
      position: "top-center",
    });
  };

  const {
    control,
    handleSubmit,
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
    resolver: yupResolver(MenuSchema),
  });

  //Gestión de errores
  const [error, setError] = useState("");
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  const onSubmit = (DataForm) => {
    console.log("Formulario:", DataForm);

    try {
      if (MenuSchema.isValid()) {
        MenuServices.createMenu(DataForm)
          .then((response) => {
            setError(response.error);
            if (response.data != null) notify();
          })
          .catch((error) => {
            setError(error);
            throw new Error("Respuesta no válida del servidor");
          });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [dataProductos, setDataProductos] = useState({});
  const [loadedProductos, setLoadedProductos] = useState(false);
  useEffect(() => {
    ProductoServices.getProductos()
      .then((response) => {
        setDataProductos(response.data);
        setLoadedProductos(true);
      })
      .catch((error) => {
        setError(error);
        setLoadedProductos(false);
        throw new Error("Respuesta no válida del servidor");
      });
  }, []);

  const [dataCombos, setDataCombos] = useState({});
  const [loadedCombos, setLoadedCombos] = useState(false);
  useEffect(() => {
    ComboService.getCombos()
      .then((response) => {
        setDataCombos(response.data);
        setLoadedCombos(true);
      })
      .catch((error) => {
        setError(error);
        setLoadedCombos(false);
        throw new Error("Respuesta no válida del servidor");
      });
  }, []);

  if (error) return <p>Error: {error.message}</p>;

  return (
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
            Crear Menu
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
          <FormControl fullWidth>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
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
            Crear Combo
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
