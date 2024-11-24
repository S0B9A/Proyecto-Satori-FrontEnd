import React, { useEffect, useState } from "react";
import {
  FormControl,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import PedidoServices from "../../Services/PedidoServices";
import { toast } from "react-hot-toast";

export function PagoPedido() {
  const navigate = useNavigate();
  const routeParams = useParams();
  const id = routeParams.id || null;

  const [values, setValores] = useState(null);
  const [error, setError] = useState("");
  const [montoPago, setMontoPago] = useState(""); // Estado para el monto de pago
  const [vuelto, setVuelto] = useState(0); // Estado para el vuelto

  // Cargar datos del pedido
  useEffect(() => {
    if (id !== undefined && !isNaN(Number(id))) {
      PedidoServices.getPedidoById(id)
        .then((response) => {
          console.log(response.data);
          setValores(response.data);
        })
        .catch((error) => {
          console.log(error);
          setError("Error al cargar datos del pedido.");
        });
    }
  }, [id]);

  // Esquema de validación con Yup
  const PagoSchema = yup.object({
    metodo_pago: yup.string().required("Selecciona un método de pago"),
    numero_tarjeta: yup
      .string()
      .nullable()
      .when("metodo_pago", {
        is: "Tarjeta",
        then: () =>
          yup
            .string()
            .required("El número de tarjeta es obligatorio")
            .length(16, "El número de tarjeta debe tener 16 dígitos"),
        otherwise: () => yup.string().nullable(),
      }),
    fecha_vencimiento: yup
      .string()
      .nullable()
      .when("metodo_pago", {
        is: "Tarjeta",
        then: () =>
          yup.string().required("La fecha de vencimiento es obligatoria"),
        otherwise: () => yup.string().nullable(),
      }),
    codigo_cvv: yup
      .string()
      .nullable()
      .when("metodo_pago", {
        is: "Tarjeta",
        then: () =>
          yup
            .string()
            .required("El CVV es obligatorio")
            .length(3, "El CVV debe tener 3 dígitos"),
        otherwise: () => yup.string().nullable(),
      }),
    monto_pago: yup
      .number()
      .nullable()
      .when("metodo_pago", {
        is: "Efectivo",
        then: () =>
          yup
            .number()
            .required("El monto de pago es obligatorio")
            .min(values?.costo || 0, `Debe ser al menos $${values?.costo}`),
        otherwise: () => yup.number().nullable(),
      }),
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      metodo_pago: "Tarjeta", // Inicializar como cadena vacía
      numero_tarjeta: "",
      fecha_vencimiento: "",
      codigo_cvv: "",
      monto_pago: "0",  // Agregar campo para monto de pago en efectivo
      id: "" ,
    },
    resolver: yupResolver(PagoSchema),
  });

  const metodoPagoSeleccionado = watch("metodo_pago");

  const onSubmit = (data) => {
    console.log("Datos enviados:", data);


    try {
      if (PagoSchema.isValid()) {

        
        //Asignar total
        const dataForm = {
            ...data,
            id: values.id,
          };

          console.log("Formulario:", dataForm);



        // Actualizar pedido
        PedidoServices.updatePedidoPorPago(dataForm)
          .then((response) => {
            console.log(response);
            setError(response.error);
            // Respuesta al usuario de creación
            if (response.data != null) {
              if (data.metodo_pago === "Efectivo") {
                toast.success("Pago realizado correctamente.");
                // Lógica adicional para pago en efectivo si es necesario
              } else {
                toast.success("Pago con tarjeta realizado correctamente.");
                // Lógica adicional para pago con tarjeta
              }
              // Redireccion a la tabla
              return navigate(`/pedido/${response.data.id}`);
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
      console.error(e);
    }
  };

  const onError = (errors) => {
    console.log("Errores en la validación:", errors);
  };

  // Calcular el vuelto si el monto de pago es mayor que el costo
  useEffect(() => {
    if (metodoPagoSeleccionado === "Efectivo" && montoPago) {
      const vueltoCalculado = montoPago - (values?.costo || 0);
      setVuelto(vueltoCalculado);
    }
  }, [montoPago, metodoPagoSeleccionado, values?.costo]);

  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2} sx={{ padding: 10 }}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" gutterBottom>
              Proceso de Pago
            </Typography>
          </Grid>

          {/* Selector de método de pago */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <Controller
                name="metodo_pago"
                control={control}
                render={({ field }) => (
                  <>
                    <Select
                      {...field}
                      value={field.value || ""}
                      displayEmpty
                      error={Boolean(errors.metodo_pago)}
                    >
                      <MenuItem value="" disabled>
                        Selecciona un método de pago
                      </MenuItem>
                      <MenuItem value="Tarjeta">Tarjeta</MenuItem>
                      <MenuItem value="Efectivo">Efectivo</MenuItem>
                    </Select>
                    <FormHelperText error={Boolean(errors.metodo_pago)}>
                      {errors.metodo_pago?.message}
                    </FormHelperText>
                  </>
                )}
              />
            </FormControl>
          </Grid>

          {/* Campos específicos para tarjeta */}
          {metodoPagoSeleccionado === "Tarjeta" && (
            <>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <Controller
                    name="numero_tarjeta"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Número de Tarjeta"
                        error={Boolean(errors.numero_tarjeta)}
                        helperText={errors.numero_tarjeta?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name="fecha_vencimiento"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Fecha de Vencimiento"
                        placeholder="MM/AA"
                        error={Boolean(errors.fecha_vencimiento)}
                        helperText={errors.fecha_vencimiento?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <Controller
                    name="codigo_cvv"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="CVV"
                        error={Boolean(errors.codigo_cvv)}
                        helperText={errors.codigo_cvv?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </>
          )}

          {/* Confirmación para pago en efectivo */}
          {metodoPagoSeleccionado === "Efectivo" && (
            <>
              <Grid item xs={12}>
                <Typography>
                  Confirmar pago en efectivo. Total a pagar: ${values?.costo}
                </Typography>
              </Grid>

              {/* Monto de pago */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <Controller
                    name="monto_pago"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Monto con el que paga"
                        type="number"
                        value={montoPago}
                        onChange={(e) => {
                          setMontoPago(e.target.value);
                          field.onChange(e.target.value); // Actualizar el valor en el form
                        }}
                        error={Boolean(errors.monto_pago)}
                        helperText={errors.monto_pago?.message}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              {vuelto > 0 && (
                <Grid item xs={12}>
                  <Typography color="primary">
                    Vuelto a pagar: ${vuelto.toFixed(2)}
                  </Typography>
                </Grid>
              )}
            </>
          )}

          {/* Botón de enviar */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Realizar Pago
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
