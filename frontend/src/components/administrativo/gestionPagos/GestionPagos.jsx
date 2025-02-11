import React from "react";
import { 
  Container, VStack, HStack, Text, Box, Icon, Button 
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FaDollarSign, FaCreditCard } from "react-icons/fa";
import GoBackButton from "../../GoBackButton";

const GestionPagos = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Encabezado con botón para volver atrás */}
        <HStack justify="space-between">
          <HStack spacing={4}>
            <GoBackButton />
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                Gestión de Pagos
              </Text>
              <Text color="gray.500" fontSize="sm">
                Administra pagos y métodos de pago
              </Text>
            </VStack>
          </HStack>
        </HStack>

        {/* Tarjetas de navegación */}
        <HStack spacing={6} justify="center">
          {/* Tarjeta para Registro de Pagos */}
          <Box
            w="full"
            maxW="sm"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="2px solid black"
            bg="white"
            cursor="pointer"
            _hover={{ boxShadow: "lg", borderColor: "blue.500" }}
            onClick={() => navigate("/registroPagos")}
          >
            <VStack spacing={3} align="center">
              <Icon as={FaDollarSign} w={10} h={10} color="green.500" />
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Registro de Pagos
              </Text>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                Consulta y administra los pagos realizados.
              </Text>
            </VStack>
          </Box>

          {/* Tarjeta para Métodos de Pago */}
          <Box
            w="full"
            maxW="sm"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="2px solid black"
            bg="white"
            cursor="pointer"
            _hover={{ boxShadow: "lg", borderColor: "blue.500" }}
            onClick={() => navigate("/metodosPago")}
          >
            <VStack spacing={3} align="center">
              <Icon as={FaCreditCard} w={10} h={10} color="blue.500" />
              <Text fontSize="xl" fontWeight="bold" color="gray.800">
                Métodos de Pago
              </Text>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                Administra los métodos de pago disponibles.
              </Text>
            </VStack>
          </Box>
        </HStack>
      </VStack>
    </Container>
  );
};

export default GestionPagos;
