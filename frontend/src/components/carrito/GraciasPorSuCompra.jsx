import React, { useEffect, useState, useRef  } from "react";
import { Box, Container, Heading, Text, Button, VStack, HStack, Flex, useColorModeValue, Divider, Icon, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { listarDetallesCarrito, crearPedido, listarPedidoDetalles, listarProductos } from "../../services/api"; 

const GraciasPorSuCompra = () => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const { userId } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const toast = useToast();
  const [pedidoInfo, setPedidoInfo] = useState({});
  const pedidoCreado = useRef(false);
  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  console.log("productos", productos);
  console.log("detalles", detalles);
  const costoEnvio = 0;
  const subtotal = cartItems.reduce((acc, item) => acc + (item.subtotal), 0);
  const total = subtotal + costoEnvio;

  useEffect(() => {
    if (userId) {
      cargarCarrito();
      cargarProductos();
    }
    window.scrollTo(0, 0);
  }, [userId]);

  useEffect(() => {
    if (cartItems.length > 0 && userId && !loadingCart && !pedidoCreado.current) {
      pedidoCreado.current = true;
      const pedidoData = {
        total: total,
        usuario_id: userId,
        estado: "PENDIENTE",
      };
  
      crearPedidoEnBackend(pedidoData);
    }
  }, [cartItems, userId, total, loadingCart]);
  
  const crearPedidoEnBackend = async (pedidoData) => {
    try {
      const nuevoPedido = await crearPedido(pedidoData);
      try {
        const data = await listarPedidoDetalles(nuevoPedido.id);
        setDetalles(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los detalles del pedido.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
      setPedidoInfo(nuevoPedido);
      toast({
        title: "Pedido creado",
        description: "El pedido se ha creado correctamente",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al crear el pedido:", error); 
      toast({
        title: "Error",
        description: "No se pudo crear el pedido",
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
  const handleVolverAlInicio = () => {
    navigate("/inicio");
  };

  const cargarCarrito = async () => {
    try {
      const data = await listarDetallesCarrito();
      setCartItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el carrito",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingCart(false);
    }
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
                <Text fontWeight="bold">{pedidoInfo.id}</Text>
              </HStack>
              <HStack justify="space-between">
                <Text fontWeight="medium">Fecha:</Text>
                <Text>{pedidoInfo.fecha_creacion}</Text>
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