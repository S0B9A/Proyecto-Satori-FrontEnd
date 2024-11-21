import React, { useState, useContext, useEffect } from "react";
import { FormControl,Grid,Typography,FormHelperText,MenuItem,Select,TextField,Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-hot-toast";
import { UserContext } from "../../contexts/UserContext";
import UserService from "../../Services/UserService";
import { SelectClientes } from "./Form/SelectClientes";

const METODOS_ENTREGA = [
  { id: 1, nombre: "Domicilio" },
  { id: 2, nombre: "Recoger en el local" },
];

const METODOS_PAGO = [
  { id: 1, nombre: "Tarjeta" },
  { id: 2, nombre: "Efectivo" },
];

export function RegistroPedido() {
  const [showEnvioDetails, setShowEnvioDetails] = useState(false);
  const { user, decodeToken } = useContext(UserContext);
  const [dataClientes, setDataClientes] = useState([]);

  // Obtener datos del usuario autenticado
  const userData = decodeToken();
  const userRole = userData?.rol?.name || "";

  useEffect(() => {
    // Cargar clientes solo si el usuario no es Cliente
    if (userRole !== "Cliente") {
      UserService.getUserClientes()
        .then((response) => setDataClientes(response.data))
        .catch((error) => {
          console.error("Error al cargar clientes:", error);
          toast.error("Error al cargar clientes");
        });
    }
  }, [userRole]);

  const PedidoSchema = yup.object().shape({
    MetodoEntrega: yup
      .string()
      .required("El Método de entrega es necesario"), // Campo obligatorio
    MetodoPago: yup
      .string()
      .required("El Método de Pago es necesario"), // Campo obligatorio
    idCliente: yup
      .string()
      .required("El cliente es requerido"), // Campo obligatorio
  });

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      MetodoEntrega: "",
      DetallesEnvio: "",
      MetodoPago: "",
      ObservacionProducto: "",
      ObservacionCombos: "",
      idCliente: userRole === "Cliente" ? userData?.id : "",
    },
    resolver: yupResolver(PedidoSchema),
  });

  const metodoEntrega = watch("MetodoEntrega");

  // Mostrar campo dinámico para detalles de envío
  useEffect(() => {
    setShowEnvioDetails(metodoEntrega === "Domicilio");
  }, [metodoEntrega]);

  const onSubmit = (data) => {
    console.log("Datos del formulario:", data);
    toast.success("Se registró el pedido correctamente");
  };

  return (
    <Grid container spacing={2} sx={{ padding: 5, marginTop: 5, justifyContent: "center" }}>
      {/* Sección izquierda: Formulario */}
      <Grid
        item
        xs={12}
        md={7}
        sx={{
          border: "1px solid #ddd",
          padding: 3,
          borderRadius: 2,
          backgroundColor: "#fff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ marginBottom: 3 }}
          >
            Registro de Pedido
          </Typography>

          {/* Campo Método de Entrega */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Controller
              name="MetodoEntrega"
              control={control}
              render={({ field }) => (
                <Select {...field} displayEmpty>
                  <MenuItem value="" disabled>
                    Selecciona el Método de Entrega
                  </MenuItem>
                  {METODOS_ENTREGA.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.nombre}>
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.MetodoEntrega?.message}
            </FormHelperText>
          </FormControl>

          {/* Campo dinámico para "Domicilio" */}
          {showEnvioDetails && (
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Controller
                name="DetallesEnvio"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Detalles del envío"
                    placeholder="Dirección, referencias, etc."
                    variant="outlined"
                  />
                )}
              />
              <FormHelperText sx={{ color: "#d32f2f" }}>
                {errors.DetallesEnvio?.message}
              </FormHelperText>
            </FormControl>
          )}

          {/* Campo Método de Pago */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Controller
              name="MetodoPago"
              control={control}
              render={({ field }) => (
                <Select {...field} displayEmpty>
                  <MenuItem value="" disabled>
                    Selecciona el Método de Pago
                  </MenuItem>
                  {METODOS_PAGO.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.nombre}>
                      {tipo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.MetodoPago?.message}
            </FormHelperText>
          </FormControl>

          {/* Observaciones */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Controller
              name="ObservacionProducto"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Observación Producto" multiline rows={2} />
              )}
            />
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <Controller
              name="ObservacionCombos"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Observación Combos" multiline rows={2} />
              )}
            />
          </FormControl>

          {/* Campo Cliente */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            {userRole === "Cliente" ? (
              <Controller
                name="idCliente"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Cliente"
                    InputProps={{ readOnly: true }}
                  />
                )}
              />
            ) : (
              <Controller
                name="idCliente"
                control={control}
                render={({ field }) => (
                  <SelectClientes field={field} data={dataClientes} error={!!errors.idCliente} />
                )}
              />
            )}
            <FormHelperText sx={{ color: "#d32f2f" }}>
              {errors.idCliente?.message}
            </FormHelperText>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#E96C12",
              ":hover": { backgroundColor: "#D85B0A" },
            }}
          >
            Registrar Pedido
          </Button>
        </form>
      </Grid>

      {/* Sección derecha: Detalles del pedido */}
      <Grid
        item
        xs={12}
        md={4}
        sx={{
          border: "1px solid #ddd",
          padding: 3,
          borderRadius: 2,
          backgroundColor: "#f7f7f7",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{ marginBottom: 3 }}
        >
          Detalles del Pedido
        </Typography>
        <Typography align="center" sx={{ color: "#888" }}>
          Resumen del pedido pendiente de implementar.
        </Typography>
      </Grid>
    </Grid>
  );
}
