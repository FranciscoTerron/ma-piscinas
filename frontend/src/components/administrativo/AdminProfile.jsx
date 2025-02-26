import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Button,
  Container,
  useToast,
  Heading
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUsersCog, 
  FaMoneyCheckAlt,
  FaChevronRight, 
  FaTruck,
  FaChartBar,
  FaBox 
} from "react-icons/fa";
import { AiFillProduct } from "react-icons/ai";
import { listarUsuarios, listarProductos, listarPagos, listarEnvios, listarPedidos } from "../../services/api";
import ActividadesRecientes from "../administrativo/actividadesRecientes/ActividadesRecientes";

const AdminProfile = () => {
  const { userName, userRole } = useAuth();
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalProductos, setProductos] = useState([]);
  const [totalPagos, setTotalPagos] = useState(0);
  const [totalEnvios, setTotalEnvios] = useState([]);
  const [totalPedidos, setTotalPedidos] = useState([]);
  const toast = useToast();

  useEffect(() => {
    cargarProductos();
    cargarUsuarios();
    cargarPagos();
    cargarEnvios();
    cargarPedidos();
  }, []);

  const cargarUsuarios = async (paginaActual, usuariosPorPagina) => {
    try {
      const data = await listarUsuarios(paginaActual, usuariosPorPagina);
      // Asumiendo que la respuesta es { usuarios: [...], total: number }
      setTotalUsuarios(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de usuarios.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Otras funciones para cargar productos, pagos, envíos, reportes y pedidos...
  const cargarProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de productos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cargarPagos = async () => {
    try {
      const data = await listarPagos();
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

  const cargarEnvios = async (paginaActual, usuariosPorPagina) => {
    try {
      const data = await listarEnvios(paginaActual, usuariosPorPagina);
      setTotalEnvios(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar envios.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };


  const cargarPedidos = async () => {
    try {
      const data = await listarPedidos();
      setTotalPedidos(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar pedidos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cards = [
    { 
      id: 'user', 
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios, roles y permisos',
      route: '/gestionUsuarios', 
      icon: FaUsersCog,
      stats: `${totalUsuarios} usuarios activos`
    },
    { 
      id: 'product', 
      title: 'Administración de Productos',
      description: 'Inventario, precios y categorías',
      route: '/administracionDeProductos', 
      icon: AiFillProduct,
      stats: `${totalProductos} productos`
    },
    { 
      id: 'pagos', 
      title: 'Gestión de Pagos',
      description: 'Pagos, registros, métodos de pago',
      route: '/gestionPagos', 
      icon: FaMoneyCheckAlt,
      stats: `${totalPagos} pagos`
    },
    { 
      id: 'envios', 
      title: 'Gestión de Envios',
      description: 'Envios, registros, métodos de envio',
      route: '/gestionEnvios', 
      icon: FaTruck,
      stats: `${totalEnvios} envios`
    },
    { 
      id: 'pedidos', 
      title: 'Gestión de Pedidos',
      description: 'Pedidos y sus detalles',
      route: '/pedidos', 
      icon: FaBox ,
      stats: `${totalPedidos} pedidos`
    },
    { 
      id: 'reportes', 
      title: 'Reportes',
      description: 'Analisis, estadisticas',
      route: '/reportes', 
      icon: FaChartBar,
      stats: `Reportes diarios, semanales, mensuales`
    },
  ];

  return (
    <Container maxW="container.xl" bg="white" 
    borderRadius="2xl" 
    boxShadow="xl"
    overflow="hidden">
      {/* Header */}
      <Box 
        bg="blue.50" 
        p={4} 
        color="blue.600"
        borderRadius="2xl"
        mb={2}
      >
        <Heading size="lg" mb={2}>
          📊 Panel de Control
        </Heading>
        <Text fontSize="md" opacity={0.9}>
          Bienvenido, {userName}
        </Text>
        <Badge 
          colorScheme="blue" 
          fontSize="sm" 
          px={3} 
          py={1} 
          borderRadius="full"
        >
          {userRole}
        </Badge>
      </Box>
      
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={6}>
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
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
              borderColor: 'blue.500'
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

      {/* Componente de Actividad Reciente */}
      <ActividadesRecientes />
    </Container>
  );
};

export default AdminProfile;
