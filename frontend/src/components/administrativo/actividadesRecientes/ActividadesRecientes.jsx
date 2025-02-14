import React, { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { listarActividadesRecientes } from '../../../services/api';

const ActividadesRecientes = () => {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const obtenerActividades = async () => {
      try {
        const data = await listarActividadesRecientes();
        console.log("Datos recibidos en el frontend:", data); // 👀 Verifica aquí
        setActividades(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error obteniendo actividades:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerActividades();
  }, []);

  if (cargando) {
    return <Spinner size="lg" color="blue.500" />;
  }

  return (
    <Box
      bg="white"
      borderRadius="2xl"
      boxShadow="lg"
      p={6}
      border="1px solid #E2E8F0"
    >
      <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.700">
        Actividades Recientes
      </Text>
      <VStack spacing={3} align="stretch">
        {actividades.map((actividad) => (
          <HStack
            key={actividad.id}
            justify="space-between"
            p={4}
            borderRadius="lg"
            bg="gray.50"
            _hover={{ bg: 'gray.100', transform: 'scale(1.02)', transition: '0.2s' }}
          >
            <HStack spacing={3}>
              <Icon as={AiOutlineClockCircle} color="blue.500" />
              <Text color="gray.700">{actividad.descripcion}</Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {new Date(actividad.tiempo).toLocaleString('es-ES', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default ActividadesRecientes;
