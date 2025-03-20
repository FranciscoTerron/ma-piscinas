import React, { useEffect, useState, useRef } from "react";
import { Box, Container, Heading, Text, Button, VStack, HStack, Flex, useColorModeValue, Divider, Icon, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { listarDetallesCarrito, crearPedido, listarPedidoDetalles, listarProductos } from "../../services/api";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const handleDescargarFactura = () => {
    const input = document.getElementById("factura");
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("factura.pdf");
    });
  };

  const FacturaPedido = () => {
    const encontrarProducto = (productoId) => {
      const producto = productos.find(p => p.id === productoId);
      return producto ? producto.nombre : 'Producto no encontrado';
    };

    return (
      <Box 
        id="factura"
        width="100%" 
        bg={bgColor} 
        borderRadius="md" 
        boxShadow="md" 
        p={4} 
        mt={6}
      >
        <VStack spacing={4} align="stretch">
          <Heading size="md" textAlign="center" color={accentColor}>
            Detalle de su Compra
          </Heading>
          
          {/* Cabecera de la tabla */}
          <Flex 
            bg={`${accentColor}15`} 
            p={2} 
            borderRadius="md" 
            fontWeight="bold"
          >
            <Text flex="2">Producto</Text>
            <Text flex="1" textAlign="center">Cantidad</Text>
            <Text flex="1" textAlign="center">Precio Unitario</Text>
            <Text flex="1" textAlign="right">Subtotal</Text>
          </Flex>
          
          {/* Cuerpo de la tabla */}
          <VStack spacing={2} align="stretch" maxH="300px" overflowY="auto">
            {detalles.length > 0 ? (
              detalles.map((detalle, index) => (
                <Flex 
                  key={index} 
                  p={2} 
                  borderBottom="1px solid" 
                  borderColor="gray.200"
                  _hover={{ bg: `${accentColor}05` }}
                >
                  <Text flex="2">{encontrarProducto(detalle.producto_id)}</Text>
                  <Text flex="1" textAlign="center">{detalle.cantidad}</Text>
                  <Text flex="1" textAlign="center">${detalle.precio_unitario}</Text>
                  <Text flex="1" textAlign="right" fontWeight="500">${detalle.subtotal}</Text>
                </Flex>
              ))
            ) : (
              <Text textAlign="center" color="gray.500" py={2}>
                Cargando detalles del pedido...
              </Text>
            )}
          </VStack>
          
          {/* Resumen del pedido */}
          <Divider my={2} />
          <VStack spacing={1} align="stretch">
            <Flex justify="space-between">
              <Text>Subtotal:</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Costo de envío:</Text>
              <Text>${costoEnvio.toFixed(2)}</Text>
            </Flex>
            <Divider my={2} />
            <Flex justify="space-between" fontWeight="bold" fontSize="lg">
              <Text>Total:</Text>
              <Text color={accentColor}>${total.toFixed(2)}</Text>
            </Flex>
          </VStack>
          
          {/* Información adicional */}
          <Box bg={`${accentColor}10`} p={3} borderRadius="md" mt={2}>
            <VStack spacing={1} align="stretch">
              <Text fontSize="sm" fontWeight="medium">Información de Entrega</Text>
              <Text fontSize="sm" color="gray.600">Estado: {pedidoInfo.estado || "Pendiente"}</Text>
              <Text fontSize="sm" color="gray.600">
                Tiempo estimado de entrega: 3-5 días hábiles
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    );
  };

  return (
    <Container maxW="container.lg">
      <Box
        bg={bgColor}
        borderRadius="lg"
        boxShadow="xl"
        p={{ base: 6, md: 10 }}
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
                <Text>{new Date(pedidoInfo.fecha_creacion).toLocaleDateString()}</Text>
              </HStack>
            </VStack>
          </Box>

          <Text fontSize="md" color="gray.500" maxW="md" mx="auto">
            Hemos enviado un correo electrónico con los detalles de su compra.
            Pronto recibirá actualizaciones sobre el estado de su envío.
          </Text>

          {/* Factura de Pedido */}
          <FacturaPedido />

          <Divider my={4} />

          <HStack spacing={4} justify="center">
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
            <Button
              colorScheme="green"
              size="lg"
              px={10}
              onClick={handleDescargarFactura}
              _hover={{
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              transition="all 0.3s ease"
            >
              Descargar Factura
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Container>
  );
};

export default GraciasPorSuCompra;