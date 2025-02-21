import React, { useEffect, useState } from 'react';
import { Box, Text, Spinner } from '@chakra-ui/react';
import { Bar } from 'react-chartjs-2';
import { obtenerTopUsuariosMasActivos } from '../../../services/api';
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

const ReporteUsuariosMasActivos = () => {
  const [usuariosMasActivos, setUsuariosMasActivos] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const usuarios = await obtenerTopUsuariosMasActivos();
      setUsuariosMasActivos(usuarios);
    };
    cargarDatos();
  }, []);

  // Configurar los datos del gráfico solo si hay datos disponibles
  const data = usuariosMasActivos.length > 0
    ? {
        labels: usuariosMasActivos.map(user => user.nombre),
        datasets: [
          {
            label: 'Compras',
            data: usuariosMasActivos.map(user => user.compras),
            backgroundColor: [
              'rgba(75, 192, 192, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(231, 76, 60, 0.7)',
              'rgba(155, 89, 182, 0.7)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(231, 76, 60, 1)',
              'rgba(155, 89, 182, 1)',
            ],
            borderWidth: 2,
            hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
            hoverBorderColor: 'rgba(255, 99, 132, 1)',
          },
        ],
      }
    : null;

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 14, weight: 'bold' } } },
      title: {
        display: true,
        font: {
          size: 20,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw} compras`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Desactivar la cuadrícula en el eje X
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Color de la cuadrícula del eje Y
        },
        ticks: {
          font: {
            size: 14,
          },
          stepSize: 1,
        },
      },
    },
    animation: {
      duration: 1000, // Tiempo de animación del gráfico
      easing: 'easeInOutQuad', // Efecto de animación
    },
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" boxShadow="lg">
      {usuariosMasActivos.length > 0 ? (
        <>
          <Bar data={data} options={options} />
        </>
      ) : (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <Spinner size="xl" />
          <Text ml={3}>Cargando datos...</Text>
        </Box>
      )}
    </Box>
  );
};

export default ReporteUsuariosMasActivos;
