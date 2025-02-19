import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box, Image, Text, VStack, HStack, Button, Badge, Skeleton, useToast,
  Grid, GridItem} from '@chakra-ui/react';
import { FiShoppingCart, FiTruck } from 'react-icons/fi';
import { obtenerProducto } from '../../services/api';
import { useCart } from "../../context/CartContext";

const Producto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true);
        const response = await obtenerProducto(id);
        setProducto(response);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar el producto",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id, toast]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          <Skeleton height="400px" width="100%" />
          <Skeleton height="40px" width="100%" />
          <Skeleton height="20px" width="100%" />
          <Skeleton height="20px" width="100%" />
          <Skeleton height="20px" width="100%" />
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8} color={"black"}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
        <GridItem>
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            borderRadius="lg"
            shadow="lg"
            width="100%"
            height="auto"
          />
        </GridItem>

        <GridItem>
          <VStack align="start" spacing={6}>
            <Box>
              {producto.descuento && (
                <Badge colorScheme="blue" mb={2} p={1}>
                  {producto.descuento}% OFF
                </Badge>
              )}
              <Text fontSize="3xl" fontWeight="bold" mb={2}>
                {producto.nombre}
              </Text>
              <Text fontSize="4xl" fontWeight="bold" color="blue.600">
                ${producto.precio.toLocaleString()}
              </Text>
              <Text color="gray.600">
                3 cuotas sin interés de ${(producto.precio / 3).toFixed(2)}
              </Text>
            </Box>

            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={2}>
                Descripción
              </Text>
              <Text color="gray.700">{producto.descripcion}</Text>
            </Box>

            <Box width="100%">
              <HStack mb={4}>
                <FiTruck size={24} color="blue.600" />
                <Text color="gray.700">
                  {producto.envioGratis ? 'Envío gratis' : 'Envío calculado al finalizar la compra'}
                </Text>
              </HStack>
              
              <Text fontSize="sm" color="gray.600" mb={4}>
                Stock disponible: {producto.stock} unidades
              </Text>

              <Button
                colorScheme="blue"
                size="lg"
                width="100%"
                leftIcon={<FiShoppingCart />}
                mb={2}
                onClick={() => addToCart(producto)}
              >
                Agregar al carrito
              </Button>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default Producto;