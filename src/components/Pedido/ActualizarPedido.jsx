import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FormControl, Grid, Typography, MenuItem, Select, FormHelperText, Button } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import PedidoServices from "../../Services/PedidoServices";
import Pusher from "pusher-js"; // Importamos la librería de Pusher

export function ActualizarPedido() {
  // Url para acceder a las imágenes guardadas en el API
  const navigate = useNavigate();
  const routeParams = useParams();

  // Id del menu a actualizar
  const id = routeParams.id || null;

  // Valores a precargar en el formulario, vienen del API
  const [values, setValores] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id !== undefined && !isNaN(Number(id))) {
      PedidoServices.getPedidoById(id)
        .then((response) => {
          console.log(response.data);
          setError(response.error);

          // Verificar si "productos" es un array antes de mapearlo
          const productos = Array.isArray(response.data.productos) ? response.data.productos.map((item) => item.id) : [];
          response.data.productos = productos;

          // Verificar si "cliente" es un array antes de mapearlo
          const cliente = Array.isArray(response.data.cliente) ? response.data.cliente.map((item) => item.id) : [];
          response.data.cliente = cliente;

          setValores(response.data);
        })
        .catch((error) => {
          console.log(error);
          setError(error);
          throw new Error("Respuesta no válida del servidor");
        });
    }

    // Configuración de Pusher para recibir actualizaciones en tiempo real
    const pusher = new Pusher("6044eb48c974063b6561", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("pedido-channel");
    channel.bind("estado-actualizado", function (data) {
      // Esta función se ejecuta cada vez que se actualiza el estado del pedido
      console.log("Pedido actualizado: ", data);
      toast.success(`Pedido actualizado: #${data.pedido.id} - ${data.pedido.estado}`);
      // Si el pedido actualizado es el actual, actualiza los valores en el formulario
      if (data.pedido.id === id) {
        setValores(data.pedido);
      }
    });

    // Cleanup de Pusher al desmontar el componente
    return () => {
      pusher.unsubscribe("pedido-channel");
    };
  }, [id]);

  // Esquema de validación
  const PedidoSchema = yup.object({
    estado: yup.string().required("El estado del pedido es requerido"),
  });
  const { control, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { estado: "" },
    values,
    resolver: yupResolver(PedidoSchema),
  });

  // Acción submit
  const onSubmit = (DataForm) => {
    console.log("Formulario:");
    console.log(DataForm);

    try {
      if (PedidoSchema.isValid()) {
        // Actualizar pedido
        PedidoServices.updatePedido(DataForm)
          .then((response) => {
            console.log(response);
            setError(response.error);

            // Respuesta al usuario de creación
            if (response.data != null) {
              toast.success(`Pedido actualizado #${response.data.id} - ${response.data.estado}`, {
                duration: 4000,
                position: "top-center",
              });
            }

            // Redireccion a la tabla
            return navigate("/pedido-table");
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

  // Lista de categorías
  const [loadedEstados, setLoadedEstados] = useState(false);
  const [dataEstados, setDataEstados] = useState([]);
  useEffect(() => {
    const categorias = [
      { id: 1, nombre: "Pendiente de pago" },
      { id: 2, nombre: "Aceptada" },
      { id: 3, nombre: "Preparación" },
      { id: 4, nombre: "Procesando" },
      { id: 5, nombre: "Entregada" },
    ];
    setDataEstados(categorias);
    setLoadedEstados(true);
  }, []);

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={1} sx={{ padding: 10 }}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom sx={{ marginBottom: 3 }}>
              <img
                src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png"
                alt="Flor de Cerezo"
                style={{ width: "20px", height: "auto", display: "inline-block", marginRight: "10px", marginLeft: "10px" }}
              />
              Actualizar Pedido
              <img
                src="https://png.pngtree.com/png-clipart/20210502/original/pngtree-pink-cartoon-cherry-flower-petal-png-image_6266152.png"
                alt="Flor de Cerezo"
                style={{ width: "20px", height: "auto", display: "inline-block", marginRight: "10px", marginLeft: "10px" }}
              />
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth sx={{ mt: 2 }}>
              {loadedEstados && (
                <Controller
                  name="estado"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} displayEmpty>
                      <MenuItem value="" disabled>
                        Selecciona un estado del pedido
                      </MenuItem>
                      {dataEstados.map((estado) => (
                        <MenuItem key={estado.id} value={estado.nombre}>
                          {estado.nombre}
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
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Actualizar Pedido
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
