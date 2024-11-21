import React, { useEffect, useState } from "react";
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

export function RegistroPedido2() {
  const currentDate = format(new Date(), "dd/MM/yyyy");

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
  });

  const { cart, getTotal } = useCart();
  const { cartCombo, getTotalcombo } = useCartCombo();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      cliente_id: "",
      pedido_date: currentDate,
      productos: cart,
      combos: cartCombo,
      total: 0,
      tipo_pedido: "Tienda",
    },
    resolver: yupResolver(RegistroPedidoSchema),
  });

  const [dataUsers, setDataUsers] = useState([]);
  const [loadedUsers, setLoadedUsers] = useState(false);
  const [isDomicilio, setIsDomicilio] = useState(false);

  useEffect(() => {
    UserService.getUserClientes()
      .then((response) => {
        setDataUsers(response.data);
        setLoadedUsers(true);
      })
      .catch((error) => {
        console.error(error);
        setLoadedUsers(false);
      });
  }, []);

  const onSubmit = (data) => {
    const total = getTotal(cart) + getTotalcombo(cartCombo) + (isDomicilio ? 5 : 0);
    const formattedData = { ...data, total, tipo_pedido: isDomicilio ? "Domicilio" : "Tienda" };
    console.log("Formulario enviado:", formattedData);
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
                  helperText={errors.pedido_date ? errors.pedido_date.message : " "}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            {loadedUsers && (
              <Controller
                name="cliente_id"
                control={control}
                render={({ field }) => (
                  <>
                    <InputLabel id="customer">Cliente</InputLabel>
                    <Select {...field} labelId="customer" label="Cliente" defaultValue="">
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

        <Grid item xs={12}>
          <Cart />
        </Grid>

        <Grid item xs={12}>
          <CartCombo />
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
