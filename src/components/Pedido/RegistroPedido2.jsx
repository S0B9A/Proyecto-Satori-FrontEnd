import React, { useEffect, useContext, useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { FormHelperText } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { format, parse } from "date-fns";
import UserService from "../../Services/UserService";
import { Cart } from "./Cart";
import { CartCombo } from "./CartCombo";
import { CartPreciototal } from "./CartPreciototal";
import { useCart } from "../../hook/useCart";
import { useCartCombo } from "../../hook/useCartCombo";
import { UserContext } from "../../contexts/UserContext";
import { DetalleUsuario } from "./DetalleUsuario";
import PedidoServices from "../../Services/PedidoServices";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function RegistroPedido2() {
  const currentDate = format(new Date(), "dd/MM/yyyy");
  const navigate = useNavigate();
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);

  useEffect(() => {
    const decoded = decodeToken();
    console.log("Decoded token:", decoded);
    setUserData(decoded);
  }, [user, decodeToken]);

  // Obtener datos del usuario autenticado
  const userRole = userData?.rol?.name || "";
  const userId = userData?.id || "";

  const RegistroPedidoSchema = yup.object({
    cliente_id: yup
      .number()
      .typeError("Seleccione un cliente")
      .required("El cliente es requerido"),
    pedido_date: yup
      .string()
      .required("Especifique una fecha")
      .matches(
        /^([0-2][0-9]|3[0-1])(\/|-)(0[1-9]|1[0-2])\2(\d{4})$/,
        "Formato día/mes/año dd/mm/yyyy"
      )
      .test(
        "is-future-date",
        "La fecha no puede ser menor a la actual",
        (value) => {
          const inputDate = parse(value, "dd/MM/yyyy", new Date());
          const today = parse(currentDate, "dd/MM/yyyy", new Date());
          return inputDate >= today;
        }
      ),
    indicaciones_ubicacion: yup.string().when("tipo_pedido", {
      is: (value) => value === "Domicilio",
      then: yup
        .string()
        .required("Las indicaciones son obligatorias para domicilio."),
    }),
  });

  const { cart, getTotal, getTotalSinImpuestos, getTax, cleanCart } = useCart();
  const {
    cartCombo,
    getTotalcombo,
    getTotalSinImpuestoscombo,
    getTaxcombo,
    cleanCartCombo,
  } = useCartCombo();

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cliente_id: "0",
      encargado_id: "",
      pedido_date: currentDate,
      productos: cart,
      combos: cartCombo,
      total: 0,
      subtotal: 0,
      impuesto: 0,
      tipo_pedido: "Tienda",
      indicaciones_ubicacion: "",
      ObservacionProducto: "",
      ObservacionCombos: "",
      estado: "Pendiente de pago",
    },
    resolver: yupResolver(RegistroPedidoSchema),
  });

  const [dataUsersUsarioIngresado, setDataUsersUsarioIngresado] =
    useState(null);
  const [dataUsers, setDataUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loadedUsersUsarioIngresado, setLoadedUsersUsarioIngresado] =
    useState(false);
  const [loadedUsers, setLoadedUsers] = useState(false);

  const [isDomicilio, setIsDomicilio] = useState(false);

  // Obtiene datos específicos de un usuario
  useEffect(() => {
    if (userData?.id) {
      UserService.getUsuario(userData.id)
        .then((response) => {
          console.log(userData.id);
          console.log(response);
          setDataUsersUsarioIngresado(response.data);
          setLoadedUsersUsarioIngresado(true);
        })
        .catch((error) => {
          setError(error);
          setLoadedUsersUsarioIngresado(true);
        });
    } else {
      console.error("ID no disponible, llamada al servicio no realizada.");
    }
  }, [userData.id]);

  // Obtiene la lista general de usuarios
  useEffect(() => {
    UserService.getUserClientes()
      .then((response) => {
        setDataUsers(response.data);
        setLoadedUsers(true);
      })
      .catch((error) => {
        setError(error);
        setLoadedUsers(false);
      });
  }, []);

  const METODOS_PAGO = [
    { id: 1, nombre: "Tarjeta" },
    { id: 2, nombre: "Efectivo" },
  ];

  const [selectedClient, setSelectedClient] = useState(null);

  // Agrega una validación para asegurarte de que siempre haya al menos un cliente
  useEffect(() => {
    if (dataUsers.length > 0) {
      setValue("cliente_id", dataUsers[0].id); // Establecer el primer cliente como valor por defecto
    }
  }, [dataUsers, setValue]);

  if (!loadedUsersUsarioIngresado) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const onSubmit = (data) => {
    try {
      if (RegistroPedidoSchema.isValid()) {
        // Convertir fecha al formato de la BD (yyyy-mm-dd)
        const [day, month, year] = getValues("pedido_date").split("/");
        const dateFormatDB = `${year}-${month}-${day}`;

        const total =
          getTotal(cart) + getTotalcombo(cartCombo) + (isDomicilio ? 5 : 0);
        const subtotal =
          getTotalSinImpuestos(cart) + getTotalSinImpuestoscombo(cartCombo);
        const impuesto = getTax(cart) + getTaxcombo(cartCombo);

        //Asignar total
        const dataForm = {
          ...data,
          pedido_date: dateFormatDB,
          total,
          subtotal,
          impuesto,
          cliente_id: userRole === "Cliente" ? userId : data.cliente_id,
          encargado_id: userRole === "Administrador" ? userId : "",
          tipo_pedido: isDomicilio ? "Domicilio" : "Tienda",
        };

        console.log("Formulario:", dataForm);

           if (isDomicilio && dataForm.indicaciones_ubicacion === "") {
          toast.error(`Necesitas agregar la direccion de entrega`, {
            duration: 4000,
            position: "top-center",
          });
          return;
        }

        //Crear alquiler
        PedidoServices.createPedido(dataForm)
          .then((response) => {
            setError(response.error);
            //Respuesta al usuario de creación
            if (response.data != null) {
              //{id, shop_id, customer_id, rental_date, total, movies}
              toast.success(`Pedido registrado #${response.data.id}`, {
                duration: 4000,
                position: "top-center",
              });

              cleanCart();
              cleanCartCombo();
              // Redireccion a la tabla
              return navigate(`/pedido/PagoPedido/${response.data.id}`);
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
    } catch (e) {
      //Error
      console.error(e);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3} sx={{ p: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary" gutterBottom>
            Realizar Pedido
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <Controller
              name="pedido_date"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Fecha"
                  error={Boolean(errors.pedido_date)}
                  helperText={
                    errors.pedido_date ? errors.pedido_date.message : " "
                  }
                />
              )}
            />
          </FormControl>
        </Grid>

        {/* Solo mostrar si el rol es "administrador" */}
        {userRole === "Administrador" && (
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              {loadedUsers && (
                <Controller
                  name="cliente_id"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabel id="customer">Cliente</InputLabel>
                      <Select
                        {...field}
                        labelId="customer"
                        label="Cliente"
                        value={field.value || dataUsers[0]?.id} // Asegúrate de que el primer cliente sea seleccionado por defecto
                        onChange={(e) => {
                          const clientId = e.target.value;
                          const client = dataUsers.find(
                            (customer) => customer.id === clientId
                          );
                          setSelectedClient(client); // Guarda la información del cliente seleccionado
                          field.onChange(e); // Asegura que el cambio se registre en el formulario
                        }}
                      >
                        {dataUsers.map((customer) => (
                          <MenuItem key={customer.id} value={customer.id}>
                            {customer.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </>
                  )}
                />
              )}
              <FormHelperText sx={{ color: "error.main" }}>
                {errors.cliente_id ? errors.cliente_id.message : " "}
              </FormHelperText>
            </FormControl>
          </Grid>
        )}

        {userRole === "Administrador" && selectedClient && (
          <Grid item xs={12} sx={{ p: 3 }}>
            <Typography variant="h6" color="textSecondary">
              Información del Cliente:
            </Typography>
            <Typography variant="body1">
              Nombre: {selectedClient.nombre}
            </Typography>
            <Typography variant="body1">
              Correo: {selectedClient.email}
            </Typography>
          </Grid>
        )}

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="tipo_pedido">Tipo de Pedido</InputLabel>
            <Select
              labelId="tipo_pedido"
              label="Tipo de Pedido"
              value={isDomicilio ? "Domicilio" : "Tienda"}
              onChange={(e) => setIsDomicilio(e.target.value === "Domicilio")}
            >
              <MenuItem value="Tienda">Tienda</MenuItem>
              <MenuItem value="Domicilio">Domicilio</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Campo de indicaciones de ubicación condicional */}
        {isDomicilio && (
          <Grid item xs={12}>
            <Controller
              name="indicaciones_ubicacion"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Indicaciones de Ubicación"
                  placeholder="Escribe aquí las indicaciones..."
                  multiline
                  rows={3}
                  error={Boolean(errors.indicaciones_ubicacion)}
                  helperText={errors.indicaciones_ubicacion?.message}
                  fullWidth
                />
              )}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <DetalleUsuario />
        </Grid>

        <Grid item xs={12}>
          <Cart />
        </Grid>

        <Grid item xs={12}>
          {/* Observaciones */}
          <FormControl fullWidth sx={{ mt: 1 }}>
            <Controller
              name="ObservacionProducto"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observación Producto"
                  multiline
                  rows={2}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <CartCombo />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth sx={{ mt: 1, mb: 4 }}>
            <Controller
              name="ObservacionCombos"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Observación Combos"
                  multiline
                  rows={2}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth sx={{ mt: 1, mb: 4 }}>
            <Controller
              name="estado"
              control={control}
              defaultValue="Pendiente de pago" // Valor predeterminado
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Estado del pedido"
                  InputProps={{
                    readOnly: true, // Hace el campo de solo lectura
                  }}
                  value="Pendiente de pago" // El texto que se mostrará
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <CartPreciototal isDomicilio={isDomicilio} />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{
              backgroundColor: "#E96C12",
              "&:hover": { backgroundColor: "#C75A10" },
              fontSize: "1.2rem",
            }}
          >
            Guardar Pedido
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
