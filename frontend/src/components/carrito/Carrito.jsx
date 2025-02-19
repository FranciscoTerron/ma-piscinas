import { useEffect, useState } from "react";
import { 
  Box, 
  Button, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  Image, 
  Divider, 
  Spinner,
  useToast,
  Badge,
  Container
} from "@chakra-ui/react";
import { 
  obtenerCarrito, 
  eliminarProductoDelCarrito, 
  vaciarCarrito, 
  listarDetallesCarrito 
} from "../../services/api";

const Carrito = () => {
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const detalles = await listarDetallesCarrito(); // Usando la API para obtener detalles
      const data = await obtenerCarrito();
      setCarrito({
        ...data,
        detalles: detalles // Incorporando los detalles del carrito
      });
      setError(null);
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      setError("No se pudo cargar el carrito");
      toast({
        title: "Error",
        description: "No se pudo cargar el carrito",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarProducto = async (productoId) => {
    try {
      await eliminarProductoDelCarrito(productoId);
      toast({
        title: "Producto eliminado",
        description: "El producto se eliminó del carrito",
        status: "success",
        duration: 2000,
      });
      cargarCarrito();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleVaciarCarrito = async () => {
    try {
      await vaciarCarrito();
      setCarrito({ detalles: [] });
      toast({
        title: "Carrito vaciado",
        description: "Se han eliminado todos los productos",
        status: "info",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo vaciar el carrito",
        status: "error",
        duration: 3000,
      });
    }
  };

  const calcularTotal = () => {
    if (!carrito?.detalles?.length) return 0;
    return carrito.detalles.reduce((total, detalle) => 
      total + (detalle.cantidad * detalle.subtotal), 0
    );
  };

  if (loading) return (
    <Container centerContent py={10}>
      <Spinner 
        size="xl" 
        color="blue.500" 
        thickness="4px"
        speed="0.65s"
      />
    </Container>
  );

  if (error) return (
    <Container centerContent py={10}>
      <Text color="red.500">{error}</Text>
      <Button 
        mt={4} 
        colorScheme="blue" 
        onClick={cargarCarrito}
      >
        Reintentar
      </Button>
    </Container>
  );

  return (
    <Container maxW="container.md" py={8}>
      <Box 
        p={6} 
        bg="white" 
        borderRadius="xl" 
        boxShadow="lg"
        border="1px"
        borderColor="blue.100"
      >
        <Heading 
          size="lg" 
          mb={6} 
          color="blue.600"
          textAlign="center"
        >
          Mi Carrito
        </Heading>
        
        {carrito?.detalles?.length ? (
          <VStack spacing={4} align="stretch">
            {carrito.detalles.map((detalle) => (
              <Box 
                key={detalle.id} 
                p={4} 
                borderWidth="1px"
                borderRadius="lg"
                borderColor="blue.100"
                bg="blue.50"
                _hover={{ bg: "blue.100" }}
                transition="all 0.2s"
              >
                <HStack justifyContent="space-between">
                  <HStack spacing={4}>
                    {/*<Image 
                      boxSize="80px"
                      objectFit="cover"
                      src={detalle.producto.imagen} 
                      alt={detalle.producto.nombre}
                      borderRadius="md"
                      fallbackSrc="https://via.placeholder.com/80"
                    />*/}
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold" color="blue.700">
                        {detalle.producto_id}
                      </Text>
                      <Badge colorScheme="blue">
                        Cantidad: {detalle.cantidad}
                      </Badge>
                      <Text color="blue.600" fontSize="lg" fontWeight="semibold">
                        ${detalle.subtotal}
                      </Text>
                    </VStack>
                  </HStack>
                  <Button 
                    colorScheme="red" 
                    size="sm"
                    onClick={() => handleEliminarProducto(detalle.producto_id)}
                  >
                    Eliminar
                  </Button>
                </HStack>
              </Box>
            ))}
            
            <Divider my={4} borderColor="blue.200" />
            
            <Box p={4} bg="blue.50" borderRadius="lg">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="bold" color="blue.700">
                  Total:
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.700">
                  ${calcularTotal().toFixed(2)}
                </Text>
              </HStack>
            </Box>

            <Button 
              colorScheme="red" 
              onClick={handleVaciarCarrito}
              size="lg"
              mt={4}
            >
              Vaciar Carrito
            </Button>
          </VStack>
        ) : (
          <Box 
            textAlign="center" 
            py={10}
            bg="blue.50"
            borderRadius="lg"
          >
            <Text fontSize="lg" color="blue.600">
              No hay productos en el carrito.
            </Text>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Carrito;