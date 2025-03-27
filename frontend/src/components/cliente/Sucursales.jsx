import React from 'react';
import {
  Box,
  Flex,
  Text,
  Image,
  VStack,
  Grid,
  useBreakpointValue,
} from '@chakra-ui/react';

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
        <Text as="h1" fontSize={{ base: "2xl", md: "4xl" }} fontWeight="extrabold" color="blue.800">
          Nuestras Sucursales
        </Text>
        <Box w="24" h="1" bg="blue.500" mx="auto" />
        <Text color="gray.600" mt={4} maxW="2xl" mx="auto">
          Encuentra tu sucursal MA más cercana y visítanos para obtener todos los insumos para tu pileta.
        </Text>
      </Box>

      {/* Mapa */}
      <Box bg="white" rounded="xl" shadow="lg" overflow="hidden" mb={12} border="1px" borderColor="gray.200">
        <Flex bg="blue.800" px={6} py={4} justifyContent="space-between" alignItems="center">
          <Text color="white" fontWeight="medium" fontSize={{ base: "md", md: "lg" }}>
            Sucursales MA PISCINAS
          </Text>
          <Text fontSize="sm" color="blue.200">
            Mapa interactivo de nuestras ubicaciones
          </Text>
        </Flex>
        <Box w="full" h={{ base: "64", md: "96" }} overflow="hidden">
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
      <Text as="h2" fontSize={{ base: "2xl", md: "3xl" }} fontWeight="extrabold" color="blue.800" mb={4}>
        Listado de Sucursales
      </Text>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
        {sucursales.map((sucursal) => (
          <Box key={sucursal.id} bg="white" rounded="xl" overflow="hidden" shadow="lg" transition="all 0.3s"
            _hover={{ shadow: "2xl", transform: "translateY(-4px)" }}>
            <Flex direction={{ base: "column", md: "row" }}>
              <Box w={{ base: "full", md: "40%" }} overflow="hidden">
                <Image src={sucursal.imagen} alt={sucursal.nombre} objectFit="cover" w="full" h="full" />
              </Box>
              <Box w={{ base: "full", md: "60%" }} p={6}>
                <Text as="h3" fontSize="xl" fontWeight="bold" color="blue.800" mb={2}>
                  {sucursal.nombre}
                </Text>
                <Text color="blue.600" fontStyle="italic" mb={3}>{sucursal.descripcion}</Text>
                <VStack spacing={3} align="stretch">
                  <Text color="gray.700">
                    📍 {sucursal.direccion}, {sucursal.codigoPostal} {sucursal.ciudad}, {sucursal.pais}
                  </Text>
                  <Text color="gray.700">📞 {sucursal.telefono}</Text>
                  <Text as="a" href={`mailto:${sucursal.email}`} color="blue.600" _hover={{ textDecoration: "underline" }}>
                    📧 {sucursal.email}
                  </Text>
                  <Box>
                    <Text fontWeight="medium" color="blue.800">🕒 Horarios:</Text>
                    <Text>{sucursal.horarios.semana}</Text>
                    <Text>{sucursal.horarios.sabado}</Text>
                  </Box>
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
