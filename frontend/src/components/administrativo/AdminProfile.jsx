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
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUsersCog, 
  FaBell, 
  FaCog,
  FaChevronRight 
} from "react-icons/fa";
import { 
  AiFillProduct,
  AiOutlineClockCircle 
} from "react-icons/ai";
import { listarUsuarios, listarProductos, listarPagos } from "../../services/api";

const AdminProfile = () => {
  const { userName, userRole } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pagos, setPagos] = useState([]); // Estado para pagos
  const toast = useToast();

  useEffect(() => {
    cargarProductos();
    cargarUsuarios();
    cargarPagos(); // Cargar los pagos al montar el componente
  }, []);

  const cargarUsuarios = async () => {
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
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

  const cargarProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data);
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
      setPagos(data);
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

  const cards = [
    { 
      id: 'user', 
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios, roles y permisos',
      route: '/gestionUsuarios', 
      icon: FaUsersCog,
      stats: `${usuarios.length} usuarios activos`
    },
    { 
      id: 'product', 
      title: 'Gestión de Productos',
      description: 'Inventario, precios y categorías',
      route: '/gestionProductos', 
      icon: AiFillProduct,
      stats: `${productos.length} productos`
    },
    { 
      id: 'pagos', 
      title: 'Gestión de Pagos',
      description: 'Pagos, registros, métodos de pago',
      route: '/gestionPagos', 
      icon: AiFillProduct,
      stats: `${pagos.length} pagos`
    }
  ];

  const recentActivity = [
    { id: 1, text: "Nuevo usuario registrado", time: "Hace 2 horas" },
    { id: 2, text: "Actualización de inventario", time: "Hace 3 horas" },
    { id: 3, text: "Cambio de precios", time: "Hace 5 horas" }
  ];

  return (
    <Container maxW="container.xl" py={8}> 
      <HStack justify="space-between" mb={6}>
        <VStack align="flex-start" spacing={1}>
          <Text fontSize="3xl" fontWeight="bold" color="gray.800">Panel de Control</Text>
          <Text color="gray.600">Bienvenido, {userName}</Text>
        </VStack>
        <HStack spacing={4}>
          <Button variant="ghost" rounded="full" size="sm" colorScheme="gray">
            <Icon as={FaBell} w={5} h={5} />
          </Button>
          <Button variant="ghost" rounded="full" size="sm" colorScheme="gray">
            <Icon as={FaCog} w={5} h={5} />
          </Button>
        </HStack>
      </HStack>

      <Badge 
        colorScheme="blue" 
        fontSize="sm" 
        px={3} 
        py={1} 
        borderRadius="full"
        mb={6}
      >
        {userRole}
      </Badge>

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
            border="2px solid black" // Borde negro
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

      {/* Sección de Actividad Reciente */}
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="md"
        p={6}
        border="2px solid black" // Borde negro
      >
        <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.800">Actividad Reciente</Text>
        <VStack spacing={4} align="stretch">
          {recentActivity.map((activity) => (
            <HStack 
              key={activity.id} 
              justify="space-between"
              p={3}
              border="1px solid black" // Borde negro en cada actividad
              borderRadius="md"
              _hover={{ bg: 'gray.50' }}
            >
              <HStack spacing={3}>
                <Icon as={AiOutlineClockCircle} color="gray.500" />
                <Text color="gray.700">{activity.text}</Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">{activity.time}</Text>
            </HStack>
          ))}
        </VStack>
      </Box>
    </Container>
  );
};

export default AdminProfile;
