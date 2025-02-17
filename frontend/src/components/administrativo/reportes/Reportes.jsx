import React, { useEffect, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { obtenerUsuarioMasActivo } from '../../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Reportes = () => {
  const [usuarioMasActivo, setUsuarioMasActivo] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      const usuario = await obtenerUsuarioMasActivo();
      setUsuarioMasActivo(usuario);
    };
    cargarDatos();
  }, []);

  // Configurar los datos del gráfico solo si hay datos disponibles
  const data = usuarioMasActivo
    ? {
        labels: [usuarioMasActivo.nombre],
        datasets: [
          {
            label: 'Compras',
            data: [usuarioMasActivo.compras],
            backgroundColor: 'rgba(66, 233, 233, 0.6)',
          },
        ],
      }
    : null;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Usuario Más Activo',
      },
    },
  };

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Reporte del Usuario Más Activo
      </Heading>
      {usuarioMasActivo ? (
        <Box>
          <Text fontSize="xl" mb={4}>
            <strong>Usuario:</strong> {usuarioMasActivo.nombre} <br />
            <strong>Compras:</strong> {usuarioMasActivo.compras}
          </Text>
          <Bar data={data} options={options} />
        </Box>
      ) : (
        <Text>Cargando datos...</Text>
      )}
    </Box>
  );
};

export default Reportes;
