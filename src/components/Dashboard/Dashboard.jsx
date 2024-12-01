import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PedidoServices from "../../Services/PedidoServices";

export function Dashboard() {
  const [topProducts, setTopProducts] = useState([]); // Datos para el gráfico de los productos más pedidos
  const [statusCounts, setStatusCounts] = useState([]); // Datos para el gráfico de pedidos por estado
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);

  // Estilos en línea
  const styles = {
    dashboardContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "20px",
      justifyContent: "center",
      padding: "20px",
    },
    dashboardCard: {
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.4)",
      padding: "20px",
      width: "800px", // Tamaño ajustable
    },
    cardTitle: {
      fontSize: "18px",
      marginBottom: "10px",
      color: "#333",
      textAlign: "center",
    },
  };

  // Obtener y procesar datos
  useEffect(() => {
    PedidoServices.getPedidos()
      .then((response) => {
        const pedidos = response.data;

        // Procesar los datos para los productos más pedidos
        const productCounts = {};
        pedidos.forEach((pedido) => {
          if (pedido.productos) {
            pedido.productos.forEach((producto) => {
              const nombre = producto.nombre;
              const cantidad = parseInt(producto.cantidad);
              productCounts[nombre] = (productCounts[nombre] || 0) + cantidad;
            });
          }
        });

        // Obtener los tres productos más pedidos
        const sortedProducts = Object.entries(productCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 3);

        setTopProducts(sortedProducts);

        // Procesar los datos para los pedidos por estado
        const statusCounts = pedidos.reduce((acc, pedido) => {
          acc[pedido.estado] = (acc[pedido.estado] || 0) + 1;
          return acc;
        }, {});

        // Convertir el objeto de conteo a un arreglo para el gráfico
        setStatusCounts(
          Object.entries(statusCounts).map(([estado, cantidad]) => ({
            estado,
            cantidad,
          }))
        );

        setLoaded(true);
      })
      .catch((error) => {
        console.error("Error al obtener los pedidos:", error);
        setError(error.message || "Error desconocido");
        setLoaded(false);
      });
  }, []);

  // Función para obtener un color aleatorio
  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 156) + 100;
    const g = Math.floor(Math.random() * 156) + 100;
    const b = Math.floor(Math.random() * 156) + 100;
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.dashboardContainer}>
      {/* Gráfico de los tres productos más pedidos */}
      <div style={styles.dashboardCard}>
        <h2 style={styles.cardTitle}>Los tres productos con mayor cantidad de pedidos</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill={getRandomColor()} name="Cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de pedidos por estado */}
      <div style={styles.dashboardCard}>
        <h2 style={styles.cardTitle}>Cantidad de Pedidos por Estado</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={statusCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="estado" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" fill={getRandomColor()} name="Cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
