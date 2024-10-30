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
import { useNavigate } from "react-router-dom";
import ProductoService from "../../Services/ProductoServices";
import ImagenProductoService from "../../Services/ImagenProductoServices";
import { toast } from "react-hot-toast";
import { SelectEstacion } from "./Form/SelectEstacion";
import EstacionServices from "../../Services/EstacionServices";

export function CrearProducto() {
  const navigate = useNavigate();
  let formData = new FormData();

  // Esquema de validación
  const ProductoSchema = yup.object({
    nombre: yup
      .string()
      .required("El nombre del producto es requerido")
      .min(4, "El nombre del producto debe tener al menos 4 caracteres"),
    descripcion: yup
      .string()
      .required("La descripción del producto es requerida"),
    precio: yup
      .number()
      .typeError("Solo se aceptan números")
      .required("El precio es requerido")
      .positive("Solo se aceptan números positivos"),
    tipo: yup.string().required("El tipo de comida es requerido"),
    categoria: yup.string().required("La categoría del comida es requerida"),
    estaciones: yup.array().min(1, "La estación es requerida"),
    image: yup.mixed().required("La imagen es requerida"),
  });

  const notify = () => {
    toast.success("Producto registrado", {
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
      precio: "",
      descripcion: "",
      tipo: "",
      categoria: "",
      image: "",
      estaciones: [],
    },
    resolver: yupResolver(ProductoSchema),
  });

  // Gestión de errores
  const [error, setError] = useState("");

  const onError = (errors, e) => console.log(errors, e);

  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);

  function handleChange(e) {
    if (e.target.files) {
      setFileURL(
        URL.createObjectURL(e.target.files[0], e.target.files[0].name)
      );
      setFile(e.target.files[0], e.target.files[0].name);
    }
  }

  // Acción submit
  const onSubmit = (DataForm) => {
    console.log("Formulario:");
    console.log(DataForm);

    try {
      if (ProductoSchema.isValid()) {
        formData.append("file", file); // Imagen

        formData.append("nombre", DataForm.nombre);

        for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
        }

        ProductoService.createProducto(DataForm)
          .then((response) => {
            setError(response.error);
            if (response.data != null) {
              notify();
            }
          })
          .catch((error) => {
            if (error instanceof SyntaxError) {
              console.log(error);
              setError(error);
              throw new Error("Respuesta no válida del servidor");
            }
          });

        
          ImagenProductoService.createImage(formData)
            .then((response) => {
              console.log(response);
              setError(response.error);
              //Respuesta al usuario de creación
              if (response.data != null) {
                toast.success("Producto registrado con Imagen", {
                  duration: 4000,
                  position: "top-center",
                });
                // Redireccion a la tabla
                return navigate("/producto-table");
              }
            })
            .catch((error) => {
              if (error instanceof SyntaxError) {
                console.log(error);
                setError(error);
                throw new Error("Respuesta no válida del servidor");
              }
            });
        
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Listas de categorias y tipos
  const [loadedCategorias, setLoadedCategorias] = useState(false);
  const [dataCategorias, setDataCategorias] = useState([]);

  useEffect(() => {
    const categorias = [
      { id: 1, nombre: "Entrada" },
      { id: 2, nombre: "Principal" },
      { id: 3, nombre: "Postre" },
      { id: 4, nombre: "Bebida" },
      { id: 5, nombre: "Sopa" },
    ];

    setDataCategorias(categorias);
    setLoadedCategorias(true);
  }, []);

  const [loadedTipos, setLoadedTipos] = useState(false);
  const [dataTipos, setDataTipos] = useState([]);

  useEffect(() => {
    const tipos = [
      { id: 1, nombre: "Japones" },
      { id: 2, nombre: "Chino" },
      { id: 3, nombre: "Coreano" },
    ];

    setDataTipos(tipos);
    setLoadedTipos(true);
  }, []);

  // Lista de Estaciones
  const [dataEstaciones, setDataEstaciones] = useState({});
  const [loadedEstaciones, setLoadedEstaciones] = useState(false);

  useEffect(() => {
    EstacionServices.getEstaciones()
      .then((response) => {
        console.log(response);
        setDataEstaciones(response.data);
        setLoadedEstaciones(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          setError(error);
          setLoadedEstaciones(false);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, []);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <Grid container spacing={2} sx={{ padding: 2 }}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
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
            Crear Producto
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

        <Grid item xs={12} sm={6}>
          <FormControl variant="standard" fullWidth>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nombre"
                  error={Boolean(errors.nombre)}
                  helperText={errors.nombre ? errors.nombre.message : " "}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <Controller
              name="precio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precio"
                  type="number"
                  error={Boolean(errors.precio)}
                  helperText={errors.precio ? errors.precio.message : " "}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <Controller
              name="descripcion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descripción"
                  multiline
                  rows={4}
                  error={Boolean(errors.descripcion)}
                  helperText={errors.descripcion?.message}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl
            variant="outlined"
            fullWidth
            error={Boolean(errors.categoria)}
          >
            {loadedCategorias && (
              <Controller
                name="categoria"
                control={control}
                render={({ field }) => (
                  <Select {...field} displayEmpty>
                    <MenuItem value="" disabled>
                      Selecciona una categoría
                    </MenuItem>
                    {dataCategorias.map((categoria) => (
                      <MenuItem key={categoria.id} value={categoria.nombre}>
                        {categoria.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            )}
            <FormHelperText>
              {errors.categoria ? errors.categoria.message : " "}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl
            variant="outlined"
            fullWidth
            error={Boolean(errors.tipo)}
          >
            {loadedTipos && (
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Select {...field} displayEmpty>
                    <MenuItem value="" disabled>
                      Selecciona un tipo de comida
                    </MenuItem>
                    {dataTipos.map((tipo) => (
                      <MenuItem key={tipo.id} value={tipo.nombre}>
                        {tipo.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            )}
            <FormHelperText>
              {errors.tipo ? errors.tipo.message : " "}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl
            variant="outlined"
            fullWidth
            error={Boolean(errors.estaciones)}
          >
            {loadedEstaciones && (
              <Controller
                name="estaciones"
                control={control}
                render={({ field }) => (
                  <SelectEstacion field={field} data={dataEstaciones} />
                )}
              />
            )}
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.estaciones ? errors.estaciones.message : " "}
            </FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <input
                  type="file"
                  accept="image/*"
                  {...field}
                  onChange={handleChange}
                  style={{ display: "none" }}
                  id="file-upload"
                />
              )}
            />
            <label htmlFor="file-upload">
              <Button
                variant="outlined"
                component="span"
                sx={{ width: "100%", height: "50px" }}
              >
                Subir Imagen
              </Button>
            </label>
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.image ? errors.image.message : " "}{" "}
              {/* Mensaje de error para imagen */}
            </FormHelperText>
          </FormControl>
          {fileURL && (
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <img
                src={fileURL}
                width="300"
                alt="Imagen del producto"
                style={{
                  border: "2px solid #E96C12", // Color del borde
                  borderRadius: "8px", // Bordes redondeados
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)", // Sombra para profundidad
                  objectFit: "cover", // Asegura que la imagen se ajuste bien
                }}
              />
            </div>
          )}
        </Grid>

        <Grid item xs={2}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: 1, fontSize: "1.0rem" }}
          >
            Guardar
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
