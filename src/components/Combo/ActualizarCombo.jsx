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
import ImagenComboServices from "../../Services/ImagenComboServices";
import { SelectProductos } from "./Form/SelectProductos";

export function ActualizarCombo() {
  //Url para acceder a la imagenes guardadas en el API
  const navigate = useNavigate();
  const routeParams = useParams();
  let formData = new FormData();
  const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

  //Id de la pelicula a actualizar
  const id = routeParams.id || null;

  //Valores a precargar en el formulario, vienen del API
  const [values, setValores] = useState(null);
  const [nombreImagen, setNombreImagen] = useState("");

  useEffect(() => {
    if (id !== undefined && !isNaN(Number(id))) {
      CombosServices.getComboById(id)
        .then((response) => {
          console.log(response.data);
          console.log(response.data.imagen)
          setError(response.error);
          
          // Asegurar que "nombreImagen" sea un string
          setNombreImagen(String(response.data.imagen));
          console.log("Imagen puesta: " + nombreImagen);

          // Verificar si "productos" es un array antes de mapearlo
          const productos = Array.isArray(response.data.productos)
            ? response.data.productos.map((item) => item.id)
            : [];
          response.data.productos = productos;

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
  const ComboSchema = yup.object({
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
    categoria: yup.string().required("La categoría del comida es requerida"),
    productos: yup.array().min(2, "Los productos son requeridos, minimo 2"),
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
      categoria: "",
      image: "",
      productos: [],
    },
    //Valores a precargar en el formulario
    values,
    // Asignación de validaciones
    resolver: yupResolver(ComboSchema),
  });

  const [error, setError] = useState("");

  // Accion submit
  const onSubmit = (DataForm) => {
    console.log("Formulario:");
    console.log(DataForm);

    try {
      if (ComboSchema.isValid()) {
        //Actualizar producto
        CombosServices.updateCombo(DataForm)
          .then((response) => {
            console.log(response);
            setError(response.error);

            //Respuesta al usuario de creación
            if (response.data != null) {
              toast.success(
                `Combo actualizada #:${response.data.id} - ${response.data.nombre}`,
                {
                  duration: 4000,
                  position: "top-center",
                }
              );
            }

            console.log("Contenido de formData:", formData);

            if (file && file.size > 0) {
              formData.append("file", file); // Imagen
              formData.append("nombre", DataForm.nombre);
              console.log("Contenido de formData:", formData);

              ImagenComboServices.createImage(formData)
                .then((response) => {
                  setError(response.error);
                  if (response.data != null) {
                    toast.success("Combo actulizado con Imagen", {
                      duration: 4000,
                      position: "top-center",
                    });
                    return navigate("/combo-table");
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

            // Redireccion a la tabla
            return navigate("/combo-table");
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

  //Lista de categorias
  const [loadedCategorias, setLoadedCategorias] = useState(false);
  const [dataCategorias, setDataCategorias] = useState([]);
  useEffect(() => {
    const categorias = [
      { id: 1, nombre: "Desayuno" },
      { id: 2, nombre: "Almuerzo" },
    ];
    setDataCategorias(categorias);
    setLoadedCategorias(true);
  }, []);

  //Lista de tipos de estaciones
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

            <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
              <Controller
                name="precio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="precio"
                    label="Precio"
                    type="number"
                    error={Boolean(errors.precio)}
                    helperText={errors.precio?.message}
                  />
                )}
              />
            </FormControl>

            <FormControl variant="standard" fullWidth sx={{ mt: 2 }}>
              <Controller
                name="descripcion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="discripcion"
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
                      onChange=
                      {(e) =>
                        setValue("categoria", e.target.value, {
                          shouldValidate: true,
                        })
                      }
                    </Select>
                  )}
                />
              )}
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.categoria?.message}
              </FormHelperText>
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
              <img
                src={fileURL ? fileURL : `${BASE_URL}/${nombreImagen}`}
                alt="Preview"
                style={{ maxHeight: "100%", maxWidth: "100%" }}
              />

              <Typography>
                {errors.image ? errors.image.message : ""}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={2}>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Actualizar Combo
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
