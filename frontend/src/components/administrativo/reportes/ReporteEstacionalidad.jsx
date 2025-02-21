import React from "react";
import { Box, Heading } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ReporteEstacionalidad = ({ data }) => {
  // Obtener todos los meses presentes en los datos
  const allMonths = Array.from(
    new Set(data.flatMap((producto) => Object.keys(producto.ventas_por_mes || {})))
  ).sort(); // Ordenamos los meses

  // Transformar los datos para Recharts
  const formattedData = data.map((producto) => {
    const ventas = Object.fromEntries(
      allMonths.map((mes) => [mes, producto.ventas_por_mes?.[mes] || 0]) // Asegurar todos los meses
    );

    return {
      nombre: producto.nombre_producto,
      ...ventas,
    };
  });

  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="md">
      <Heading as="h3" size="md" mb={4}>
        Estacionalidad de Productos
      </Heading>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Legend />
          {allMonths.map((mes, index) => (
            <Line key={index} type="monotone" dataKey={mes} stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`} name={`Ventas ${mes}`} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ReporteEstacionalidad;
