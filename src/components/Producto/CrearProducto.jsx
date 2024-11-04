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
    image: yup
      .mixed()
      .test(
        "fileRequired",
        "La imagen es requerida",
        (value) => value && value.size > 0
      ),
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

  //Gestión de errores
  const [error, setError] = useState("");
  // Si ocurre error al realizar el submit
  const onError = (errors, e) => console.log(errors, e);

  const onSubmit = (DataForm) => {
    console.log("Formulario:", DataForm);

    try {
      if (ProductoSchema.isValid()) {

        // Verificar si el producto "hamburguesa" ya existe
        const productoExiste = dataProductos.some(
          (producto) =>
            producto.nombre.toLowerCase() === DataForm.nombre.toLowerCase()
        );

        if (productoExiste) {
          console.log("El producto ya existe, saliendo de la función.");
          toast.error("Ya existe un producto con ese nombre", {
            duration: 4000,
            position: "top-center",
          });
          return; // Salir de la función si el producto ya existe
        }

        formData.append("file", file); // Imagen
        formData.append("nombre", DataForm.nombre);

        ProductoService.createProducto(DataForm)
          .then((response) => {
            setError(response.error);
            if (response.data != null) notify();

            console.log("Contenido de formData:", formData);

            ImagenProductoService.createImage(formData)
              .then((response) => {
                setError(response.error);
                if (response.data != null) {
                  toast.success("Producto registrado con Imagen", {
                    duration: 4000,
                    position: "top-center",
                  });
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

  const [dataEstaciones, setDataEstaciones] = useState({});
  const [loadedEstaciones, setLoadedEstaciones] = useState(false);
  useEffect(() => {
    EstacionServices.getEstaciones()
      .then((response) => {
        setDataEstaciones(response.data);
        setLoadedEstaciones(true);
      })
      .catch((error) => {
        setError(error);
        setLoadedEstaciones(false);
        throw new Error("Respuesta no válida del servidor");
      });
  }, []);

  const [dataProductos, setDataProductos] = useState({});
  const [loadedProductos, setLoadedProductos] = useState(false);
  useEffect(() => {
    ProductoService.getProductos()
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
              name="precio"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Precio"
                  type="number"
                  error={Boolean(errors.precio)}
                  helperText={errors.precio?.message}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
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

          <FormControl fullWidth sx={{ mt: 2 }}>
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
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.categoria?.message}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
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
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.tipo?.message}
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
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
              {" "}
              {errors.estaciones?.message}
            </FormHelperText>
          </FormControl>
        </Grid>

        {/* Sección Derecha - Imagen */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      field.onChange(e.target.files[0]); // Cambia el valor del controlador
                      handleChange(e); // Llama a tu función de manejo de archivo
                    }}
                    style={{ display: "none" }}
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      sx={{
                        textAlign: "center",
                        display: "block", // Cambia a bloque para ocupar el espacio completo
                        width: "30%", // O ajusta el ancho según tus necesidades
                        height: "40px",
                        margin: "0 auto", // Centra el botón horizontalmente
                      }}
                    >
                      Subir Imagen
                    </Button>
                  </label>
                </>
              )}
            />
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.image ? errors.image.message : " "}
            </FormHelperText>
          </FormControl>

          <div
            style={{
              width: "60%",
              height: "200px",
              border: fileURL ? "1px solid #000" : "2px dashed red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "10px",
              color: errors.image ? "red" : "black",
            }}
          >
            {fileURL ? (
              <img
                src={fileURL}
                alt="Preview"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />
            ) : (
              <Typography>
                {errors.image
                  ? errors.image.message
                  : "Vista previa de la imagen"}
              </Typography>
            )}
          </div>
        </Grid>

        <Grid item xs={2}>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Crear Producto
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
