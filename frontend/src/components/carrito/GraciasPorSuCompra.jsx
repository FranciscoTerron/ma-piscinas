import React, { useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  useColorModeValue,
  Divider,
  Icon
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const GraciasPorSuCompra = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  // Información de la compra (esto podría venir de un estado global o de parámetros de URL)
  const orderInfo = {
    orderNumber: Math.floor(100000 + Math.random() * 900000), // Número de orden aleatorio de 6 dígitos
    date: new Date().toLocaleDateString('es-AR'),
  };

  useEffect(() => {
    // Aquí podrías realizar cualquier acción necesaria al cargar la página
    // Por ejemplo, limpiar el carrito, actualizar el estado global, etc.
    window.scrollTo(0, 0);
  }, []);

  const handleVolverAlInicio = () => {
    navigate("/inicio"); // Navega a la página de inicio
  };

  return (
    <Container maxW="container.lg" py={12}>
      <Box
        bg={bgColor}
        borderRadius="lg"
        boxShadow="xl"
        p={{ base: 6, md: 10 }}
        my={10}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        {/* Círculos decorativos de fondo */}
        <Box
          position="absolute"
          top="-50px"
          left="-50px"
          width="200px"
          height="200px"
          borderRadius="full"
          bg={`${accentColor}10`}
          zIndex={0}
        />
        <Box
          position="absolute"
          bottom="-30px"
          right="-30px"
          width="150px"
          height="150px"
          borderRadius="full"
          bg={`${accentColor}10`}
          zIndex={0}
        />

        <VStack spacing={6} position="relative" zIndex={1}>
          <Flex
            w="100px"
            h="100px"
            borderRadius="full"
            bg={`${accentColor}20`}
            justify="center"
            align="center"
            mb={2}
          >
            {/* Icono de verificación creado con SVG en lugar de importar CheckCircleIcon */}
            <Icon viewBox="0 0 24 24" w={16} h={16} color={accentColor}>
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </Icon>
          </Flex>

          <Heading
            as="h1"
            size="xl"
            fontWeight="bold"
            color={accentColor}
            textTransform="uppercase"
            letterSpacing="wide"
          >
            ¡Gracias por su compra!
          </Heading>

          <Text fontSize="lg" color="gray.600">
            Su pedido ha sido procesado con éxito.
          </Text>

          <Box
            p={6}
            bg={`${accentColor}10`}
            borderRadius="md"
            width="100%"
            maxW="md"
            mx="auto"
          >
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="medium">Número de orden:</Text>
                <Text fontWeight="bold">{orderInfo.orderNumber}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="medium">Fecha:</Text>
                <Text>{orderInfo.date}</Text>
              </HStack>
            </VStack>
          </Box>

          <Text fontSize="md" color="gray.500" maxW="md" mx="auto">
            Hemos enviado un correo electrónico con los detalles de su compra.
            Pronto recibirá actualizaciones sobre el estado de su envío.
          </Text>

          <Divider my={4} />

          <Button
            colorScheme="blue"
            size="lg"
            px={10}
            onClick={handleVolverAlInicio}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.3s ease"
          >
            Volver al inicio
          </Button>
        </VStack>
      </Box>
    </Container>
  );
};

export default GraciasPorSuCompra;