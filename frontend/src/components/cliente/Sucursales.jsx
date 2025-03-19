import React from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  VStack,
  Grid,
  IconButton,
} from '@chakra-ui/react';

import BotonFlecha from './Productos/BotonFlecha';

const Sucursales = () => {
  const sucursales = [
    {
      id: 1,
      nombre: "MA GAIMAN",
      descripcion: "Venta de Piletas",
      direccion: "Mitre 38, U9105 Gaiman, Chubut",
      codigoPostal: "9105",
      ciudad: "Gaiman",
      pais: "Argentina",
      telefono: "2804275938",
      email: "ma@gmail.com.ar",
      horarios: {
        semana: "Lunes a Viernes de 9hs a 13hs y de 14hs a 18hs",
        sabado: "Sábados de 9hs a 13hs",
      },
      imagen: "https://placehold.co/450",
    },
    {
      id: 2,
      nombre: "MA NEUQUEN",
      descripcion: "Venta de Insumos para piletas",
      direccion: "nose",
      codigoPostal: "8300",
      ciudad: "Neuquen",
      pais: "Argentina",
      telefono: "0800-XXX-XXXX",
      email: "ma@gmail.com.ar",
      horarios: {
        semana: "Lunes a Viernes de 9hs a 13hs y de 14hs a 18hs",
        sabado: "Sábados de 9hs a 13hs",
      },
      imagen: "https://placehold.co/450",
    },
  ];

  return (
    <Box maxW="7xl" mx="auto" px={4} py={12} bg="gray.50">
      {/* Encabezado */}
      <Box textAlign="center" mb={12}>
        <Text as="h1" fontSize="4xl" fontWeight="extrabold" color="blue.800" mb={2}>
          Nuestras Sucursales
        </Text>
        <Box w="24" h="1" bg="blue.500" mx="auto" />
        <Text color="gray.600" mt={4} maxW="2xl" mx="auto">
          Encuentra tu sucursal MA más cercana y visítanos para obtener todos los insumos para tu pileta.
        </Text>
      </Box>

      {/* Mapa */}
      <Box bg="white" rounded="xl" shadow="lg" overflow="hidden" mb={16} border="1px" borderColor="gray.200">
        <Flex bg="blue.800" px={6} py={4} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Box
              as="svg"
              w={6}
              h={6}
              color="white"
              mr={2}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </Box>
            <Text color="white" fontWeight="medium" fontSize="lg">
              Sucursales MA PISCINAS
            </Text>
          </Flex>
          <Text fontSize="sm" color="blue.200">
            Mapa interactivo de nuestras ubicaciones
          </Text>
        </Flex>
        <Box w="full" h="96" rounded="md" position="relative" overflow="hidden">
        <iframe
            src="https://www.google.com/maps/d/embed?mid=1C4tyZoQ-9oYTUCh0LIv8CYlgfgByzME&ehbc=2E312F&noprof=1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Mapa de sucursales MA PISCINAS"
        />
        </Box>
      </Box>

      {/* Listado de Sucursales */}
      <Text as="h1" fontSize="4xl" fontWeight="extrabold" color="blue.800" mb={2}>
          Listado Sucursales
        </Text>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
        {sucursales.map((sucursal) => (
          <Box
            key={sucursal.id}
            bg="white"
            rounded="xl"
            overflow="hidden"
            shadow="lg"
            transition="all 0.3s"
            _hover={{ shadow: '2xl', transform: 'translateY(-4px)' }}
          >
            <Flex direction={{ base: 'column', md: 'row' }}>
              <Box w={{ base: 'full', md: '40%' }} overflow="hidden">
                <Image
                  src={sucursal.imagen}
                  alt={sucursal.nombre}
                  objectFit="cover"
                  w="full"
                  h="full"
                />
              </Box>
              <Box w={{ base: 'full', md: '60%' }} p={6}>
                <Flex alignItems="center" mb={3}>
                  <Box w={2} h={8} bg="blue.500" mr={3} />
                  <Text as="h2" fontSize="xl" fontWeight="bold" color="blue.800">
                    {sucursal.nombre}
                  </Text>
                </Flex>
                <Text color="blue.600" mb={4} fontWeight="medium" fontStyle="italic">
                  {sucursal.descripcion}
                </Text>
                <VStack spacing={4} align="stretch">
                  {/* Dirección */}
                  <Flex alignItems="flex-start">
                    <Box
                      as="svg"
                      w={5}
                      h={5}
                      color="blue.500"
                      mt={1}
                      mr={2}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </Box>
                    <Box color="gray.700">
                      <Text>{sucursal.direccion}</Text>
                      <Text>
                        {sucursal.codigoPostal} {sucursal.ciudad}, {sucursal.pais}
                      </Text>
                    </Box>
                  </Flex>
                  {/* Teléfono y Email */}
                  <Flex alignItems="center">
                    <Box
                      as="svg"
                      w={5}
                      h={5}
                      color="blue.500"
                      mr={2}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </Box>
                    <Box>
                      <Text color="gray.700">{sucursal.telefono}</Text>
                      <Text
                        as="a"
                        href={`mailto:${sucursal.email}`}
                        color="blue.600"
                        _hover={{ textDecoration: 'underline' }}
                      >
                        {sucursal.email}
                      </Text>
                    </Box>
                  </Flex>
                  {/* Horarios */}
                  <Flex alignItems="flex-start">
                    <Box
                      as="svg"
                      w={5}
                      h={5}
                      color="blue.500"
                      mt={1}
                      mr={2}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </Box>
                    <Box color="gray.700">
                      <Text fontWeight="medium" color="blue.800" mb={1}>
                        Horarios:
                      </Text>
                      <Text>{sucursal.horarios.semana}</Text>
                      <Text>{sucursal.horarios.sabado}</Text>
                    </Box>
                  </Flex>
                </VStack>
              </Box>
            </Flex>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default Sucursales;
