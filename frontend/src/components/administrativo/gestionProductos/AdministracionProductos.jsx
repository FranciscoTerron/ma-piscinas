import React, { useEffect, useState } from "react";
import { Box, Grid, VStack, HStack, Text, Icon, Button, Container, useToast,} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {  FaContao ,  FaBell,  FaCog,  FaChevronRight } from "react-icons/fa";
import { AiFillProduct,} from "react-icons/ai";
import { listarProductos, listarCategorias, listarSubcategorias, listarDescuentos } from "../../../services/api";
import GoBackButton from "../../GoBackButton";

const AdministracionProductos = () => {
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [descuentos, setDescuentos] = useState([]);
  const toast = useToast();
  const[totalCategorias,setTotalCategorias] = useState(0);
  const[totalSubCategorias,setTotalSubCategorias] = useState(0);
  const[totalProductos,setTotalProductos] = useState(0);
  const[totalDescuentos,setTotalDescuentos] = useState(0);


  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarSubcategorias();
    cargarDescuentos();
  }, []);


  const cargarDescuentos = async (paginaActual,descuentoPorPagina) => {
    try {
      const data = await listarDescuentos(paginaActual,descuentoPorPagina);
      setDescuentos(data.categorias);
      setTotalDescuentos(data.total)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de descuentos",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };


  const cargarCategorias = async (paginaActual,categoriaPorPagina) => {
     try {
       const data = await listarCategorias(paginaActual,categoriaPorPagina);
       setCategorias(data.categorias);
       setTotalCategorias(data.total)
     } catch (error) {
       toast({
         title: "Error",
         description: "No se pudo cargar la lista de categorias.",
         status: "error",
         duration: 5000,
         isClosable: true,
       });
     }
   };

  const cargarSubcategorias = async (paginaActual,subcategoriaPorPagina) => {
    try {
      const data = await listarSubcategorias(paginaActual,subcategoriaPorPagina);
      setSubcategorias(data.subcategorias);
      setTotalSubCategorias(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de subcategorias.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data.productos);
      setTotalProductos(data.total);
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

  const cards = [
    { 
      id: 'user', 
      title: 'Gestión de Categorias',
      description: 'Administrar categorias para productos',
      route: '/administracionDeCategorias', 
      icon: FaContao,
      stats: `${totalCategorias} categorias | ${totalSubCategorias} subcategorias`
    },
    { 
      id: 'product', 
      title: 'Gestión de Productos',
      description: 'Inventario, precios y categorías',
      route: '/gestionProductos', 
      icon: AiFillProduct,
      stats: `${totalProductos} productos`
    },
     { 
      id: 'descuentos', 
      title: 'Gestión de Descuentos',
      description: 'Descuentos',
      route: '/gestionDescuentos', 
      icon: AiFillProduct,
      stats: `${totalDescuentos} descuentos`
    },
  ];

  return (
    <Container maxW="container.xl" py={8}> 
      <HStack justify="space-between" mb={6}>
        <HStack justify="space-between">
          <HStack spacing={4}>
            <GoBackButton />
            <VStack align="flex-start" spacing={0}>
              <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                Administración de Productos
              </Text>
              <Text color="gray.500" fontSize="sm">
                Inventario, precios y categorías
              </Text>
            </VStack>
          </HStack>
        </HStack>
      </HStack>

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
    </Container>
  );
};

export default AdministracionProductos;
