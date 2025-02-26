import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Icon, Spinner, useToast, IconButton} from '@chakra-ui/react';
import { AiOutlineClockCircle } from 'react-icons/ai';
import { Link as RouterLink } from 'react-router-dom';
import { RxActivityLog } from "react-icons/rx";
import { listarActividadesRecientes } from '../../../services/api';

const ActividadesRecientes = () => {
  const [actividades, setActividades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const obtenerActividades = async (pagina, tamanio) => {
      try {
        const data = await listarActividadesRecientes(pagina, tamanio);
 
        if (Array.isArray(data.actividades)) {
          // Obtener solo la última actividad de cada tipo de evento
          const ultimasActividades = Object.values(
            data.actividades.reduce((acc, actividad) => {
              const { tipo_evento, fecha } = actividad;
              // Si no existe en el acumulador o esta es más reciente, la reemplazamos
              if (!acc[tipo_evento] || new Date(actividad.fecha) > new Date(acc[tipo_evento].fecha)) {
                acc[tipo_evento] = actividad;
              }
              return acc;
            }, {})
          );
          setActividades(ultimasActividades);
        } else {
          setActividades([]);
        }
      } catch (error) {
        console.error("Error obteniendo actividades:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las actividades recientes.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
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
      <HStack spacing={4}>
        <IconButton
          title='Actividades'
          aria-label="Actividades"
          icon={<RxActivityLog />}
          as={RouterLink}
          to={"/historialDeActividades"}
          variant="outline"
          color="blue.500"
          _hover={{
            bg: "#87CEEB",
            transform: 'scale(1.05)',
            transition: 'all 0.2s ease-in-out'
          }}
          _active={{
              bg: "#4169E1",
              transform: 'scale(0.95)'
          }}
          position="relative" 
          top="-6px"
        />
        <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.700">
          Actividades Recientes
        </Text>
      </HStack>
      <VStack spacing={3} align="stretch">
        {actividades.length === 0 ? (
          <Text color="gray.500">No hay actividades recientes.</Text>
        ) : (
          actividades.map((actividad) => (
            <HStack
              key={actividad.id}
              justify="space-between"
              p={4}
              borderRadius="lg"
              bg="gray.50"
              _hover={{ bg: 'gray.100', transform: 'scale(1.02)', transition: '0.2s' }}
            >
              <HStack spacing={8} alignItems="center">
                <Icon as={AiOutlineClockCircle} color="blue.500" boxSize="1.2em" position="relative" top="-6px" />
                <Text color="gray.700" fontSize="md" fontWeight="medium" flex="1" textAlign="center">
                  {actividad.descripcion}
                </Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                {new Date(actividad.fecha).toLocaleString('es-ES', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </HStack>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default ActividadesRecientes;
