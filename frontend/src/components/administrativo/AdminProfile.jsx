import React from 'react';
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

const AdminProfile = () => {
  const { userName, userRole } = useAuth();

  const cards = [
    { 
      id: 'user', 
      title: 'Gestión de Usuarios',
      description: 'Administrar usuarios, roles y permisos',
      route: '/gestionUsuarios', 
      icon: FaUsersCog,
      stats: '24 usuarios activos'
    },
    { 
      id: 'product', 
      title: 'Gestión de Productos',
      description: 'Inventario, precios y categorías',
      route: '/gestionProductos', 
      icon: AiFillProduct,
      stats: '156 productos'
    }
  ];

  const recentActivity = [
    { id: 1, text: "Nuevo usuario registrado", time: "Hace 2 horas" },
    { id: 2, text: "Actualización de inventario", time: "Hace 3 horas" },
    { id: 3, text: "Cambio de precios", time: "Hace 5 horas" }
  ];

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header Section */}
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

      {/* Role Badge */}
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

      {/* Main Grid */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6} mb={6}>
        {cards.map((card) => (
          <Box
            key={card.id}
            as={RouterLink}
            to={card.route}
            bg="white"
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            _hover={{ 
              transform: 'translateY(-2px)',
              boxShadow: 'md',
              borderColor: 'blue.200'
            }}
            transition="all 0.2s"
            border="1px solid"
            borderColor="gray.100"
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
              <Icon as={FaChevronRight} w={5} h={5} color="gray.300" />
            </HStack>
            <Text fontSize="xl" fontWeight="bold" mt={4} color="gray.800">{card.title}</Text>
            <Text color="gray.500" fontSize="sm" mt={2}>{card.description}</Text>
            <Text color="gray.600" fontSize="sm" fontWeight="medium" mt={4}>
              {card.stats}
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Box
        bg="white"
        borderRadius="lg"
        boxShadow="sm"
        p={6}
        border="1px solid"
        borderColor="gray.100"
      >
        <Text fontSize="xl" fontWeight="bold" mb={4} color="gray.800">Actividad Reciente</Text>
        <VStack spacing={4} align="stretch">
          {recentActivity.map((activity) => (
            <HStack 
              key={activity.id} 
              justify="space-between"
              p={3}
              _hover={{ bg: 'gray.50' }}
              borderRadius="md"
            >
              <HStack spacing={3}>
                <Icon as={AiOutlineClockCircle} color="gray.400" />
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