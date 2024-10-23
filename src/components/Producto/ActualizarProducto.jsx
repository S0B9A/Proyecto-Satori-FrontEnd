import React, { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FormHelperText } from "@mui/material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import Tooltip from "@mui/material/Tooltip";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import ProductoService from "../../Services/ProductoServices";
import { toast } from "react-hot-toast";
import { EstacionesForm } from "./Form/EstacionesForm";
import EstacionServices from "../../Services/EstacionServices";

export function ActualizarProducto() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const id = routeParams.id || null;
  const [values, setValores] = useState(null);
  const [dataEstaciones, setDataEstaciones] = useState([]);
  const [loadedEstaciones, setLoadedEstaciones] = useState(false);
  const [error, setError] = useState("");

  const ProductoSchema = yup.object({
    nombre: yup.string().required("El nombre del producto es requerido").min(2, "El nombre del producto debe tener al menos 2 caracteres"),
    descripcion: yup.string().required("La descripción es requerida"),
    precio: yup.number().typeError("Solo se aceptan números").required("El precio es requerido").positive("Solo se aceptan números positivos"),
    tipo: yup.string().required("El tipo de comida es requerido"),
    categoria: yup.string().required("La categoría es requerida"),
    estaciones: yup.array().of(
      yup.object().shape({
        id: yup.string().required("La estación es requerida"),
      })
    ).min(1, "Se requiere al menos una estación"),
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      precio: "",
      descripcion: "",
      tipo: "",
      categoria: "",
      estaciones: [{ id: ""}],
    },
    resolver: yupResolver(ProductoSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "estaciones",
  });

  const removeEstacion = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const addNewEstacion = () => {
    append({id: ""});
  };

  const onSubmit = async (dataForm) => {
    console.log("Formulario:", dataForm);
    try {
      const response = await ProductoService.updateProducto(dataForm);
      if (response.data) {
        toast.success(`Producto actualizado #${response.data.id} - ${response.data.nombre}`, { duration: 4000, position: "top-center" });
        navigate("/producto-table");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Ocurrió un error al actualizar el producto.");
    }
  };

  const onError = (errors) => console.log(errors);

  useEffect(() => {
    const fetchEstaciones = async () => {
      try {
        const response = await EstacionServices.getEstaciones();
        setDataEstaciones(response.data);
        setLoadedEstaciones(true);
      } catch (error) {
        console.error("Error:", error);
        setError("No se pudo cargar las estaciones.");
      }
    };
    fetchEstaciones();
  }, []);

  if (error) return <p>Error: {error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h5" gutterBottom>
            Actualizar Producto
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
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
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
            <Controller
              name="precio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precio"
                  error={Boolean(errors.precio)}
                  helperText={errors.precio?.message}
                  type="number"
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  error={Boolean(errors.descripcion)}
                  helperText={errors.descripcion?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
            <Controller
              name="categoria"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="categoria"
                  error={Boolean(errors.categoria)}
                  helperText={errors.categoria?.message}
                />
              )}
            />
          </FormControl>
        </Grid>


        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
            <Controller
              name="tipo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tipo de comida"
                  error={Boolean(errors.tipo)}
                  helperText={errors.tipo?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <Typography variant="h6" gutterBottom>
              Estaciones
              <Tooltip title="Agregar Estaciones">
                <span>
                  <IconButton color="primary" onClick={addNewEstacion}>
                    <AddIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Typography>
            {loadedEstaciones &&
              fields.map((field, index) => (
                <EstacionesForm
                  key={field.id}
                  field={field}
                  data={dataEstaciones}
                  index={index}
                  onRemove={removeEstacion}
                  control={control}
                />
              ))}
            <FormHelperText sx={{ color: "error.main" }}>
              {errors.estaciones ? errors.estaciones.message : " "}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="secondary">
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
