import React, { useEffect, useState } from "react";
import { Box, Grid, VStack, HStack, Text, Icon, Button, Container, useToast } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { FaDollarSign, FaCreditCard, FaChevronRight } from "react-icons/fa";
import GoBackButton from "../../GoBackButton";
import { listarPagos, listarMetodosPago } from "../../../services/api";

const GestionPagos = () => {
  const [totalPagos, setTotalPagos] = useState([]);
  const [totalMetodosPago, setTotalMetodosPago] = useState([]);
  const toast = useToast();

  useEffect(() => {
    cargarPagos();
    cargarMetodosPago();
  }, []);

  const cargarPagos = async (paginaActual, usuariosPorPagina) => {
    try {
      const data = await listarPagos(paginaActual, usuariosPorPagina);
      setTotalPagos(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de pagos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cargarMetodosPago = async (paginaActual, porPagina) => {
    try {
      const data = await listarMetodosPago(paginaActual, porPagina);
      setTotalMetodosPago(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de métodos de pago.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cards = [
    { 
      id: 'pagos', 
      title: 'Registro de Pagos',
      description: 'Consulta y administra los pagos realizados.',
      route: '/registroPagos', 
      icon: FaDollarSign,
      stats: `${totalPagos} pagos registrados`
    },
    { 
      id: 'metodosPago', 
      title: 'Métodos de Pago',
      description: 'Administra los métodos de pago disponibles.',
      route: '/metodosPago', 
      icon: FaCreditCard,
      stats: `${totalMetodosPago} métodos de pago`
    },
  ];

  return (
    <Container maxW="container.xl" py={8}> 
      <HStack justify="space-between" mb={6}>
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

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6} mb={6}>
        {cards.map((card) => (
          <Box
            key={card.id}
            as={RouterLink}
            to={card.route}
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            border="2px solid black"
            _hover={{ 
              transform: "translateY(-2px)",
              boxShadow: "lg",
              borderColor: "blue.500"
            }}
            transition="all 0.2s"
          >
            <HStack justify="space-between">
              <Icon 
                as={card.icon}
                w={10}
                h={10}
                color="blue.500"
                p={2}
                bg="blue.50"
                borderRadius="lg"
              />
              <Icon as={FaChevronRight} w={5} h={5} color="gray.400" />
            </HStack>
            <Text fontSize="xl" fontWeight="bold" mt={4} color="gray.800">{card.title}</Text>
            <Text color="gray.500" fontSize="sm" mt={2}>{card.description}</Text>
            <Text color="gray.600" fontSize="sm" fontWeight="medium" mt={4}>
              {card.stats}
            </Text>
          </Box>
        ))}
      </Grid>
    </Container>
  );
};

export default GestionPagos;
