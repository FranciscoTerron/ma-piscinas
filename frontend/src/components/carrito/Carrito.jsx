import { useEffect, useState } from "react";
import { 
  Box, 
  Button, 
  Heading, 
  Text, 
  useToast,
  Spinner,
  Container,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  IconButton,
  Flex,
  Badge
} from "@chakra-ui/react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { 
  obtenerCarrito, 
  eliminarProductoDelCarrito, 
  vaciarCarrito, 
  listarDetallesCarrito,
  actualizarCantidadProducto,
  listarProductos
} from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/react";


const Carrito = () => {
  const [carrito, setCarrito] = useState(null);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [productoToDelete, setProductoToDelete] = useState(null);
  const [isClearAlertOpen, setIsClearAlertOpen] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    cargarCarrito();
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data.productos);
    } catch (error) {
      console.error("Error cargando productos", error);
    }
  };

  const cargarCarrito = async () => {
    try {
      setLoading(true);
      const detalles = await listarDetallesCarrito();
      const data = await obtenerCarrito();
      setCarrito({ ...data, detalles });
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

  const obtenerNombreProducto = (productoId) => {
    const producto = productos.find(p => p.id === productoId);
    return producto ? producto.nombre : "Producto no encontrado";
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(monto);
  }

  const handleActualizarCantidad = async (productoId, nuevaCantidad) => {
    try {
      if (nuevaCantidad === 0) {
        setProductoToDelete(productoId);
        setIsDeleteAlertOpen(true);
        return;
      }
      
      await actualizarCantidadProducto(productoId, nuevaCantidad);
      cargarCarrito();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la cantidad",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await eliminarProductoDelCarrito(productoToDelete);
      toast({
        title: "Producto eliminado",
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
    } finally {
      setIsDeleteAlertOpen(false);
      setProductoToDelete(null);
    }
  };

  const handleContinuarCompra = () => {
    onClose(); // Cierra cualquier modal si está abierto
    navigate("/FormularioEnvio"); // Redirige a la página de formulario de envío
  };

  const handleVaciarCarrito = async () => {
    try {
      await vaciarCarrito();
      setCarrito({ detalles: [] });
      toast({
        title: "Carrito vaciado",
        status: "info",
        duration: 2000,
      });
      setIsClearAlertOpen(false);
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
      <Spinner size="xl" color="blue.500" thickness="4px"/>
    </Container>
  );

  if (error) return (
    <Container centerContent py={10}>
      <Text color="red.500">{error}</Text>
      <Button mt={4} colorScheme="blue" onClick={cargarCarrito}>
        Reintentar
      </Button>
    </Container>
  );

  return (
    <Container maxW="container.lg" py={8} color={"black"}>
      <Box p={6} bg="white" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200">
        <Heading size="lg" mb={6} color="blue.600">
          Carrito
        </Heading>

        {carrito?.detalles?.length ? (
          <>
            <Table variant="simple">
              <Thead bg="blue.50">
                <Tr>
                  <Th color="blue.600">Producto</Th>
                  <Th color="blue.600" textAlign="center">Cantidad</Th>
                  <Th color="blue.600" textAlign="center">Precio Unitario</Th>
                  <Th color="blue.600" textAlign="right">Subtotal</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {carrito.detalles.map((detalle) => (
                  <Tr key={detalle.id} _hover={{ bg: "gray.50" }}>
                    <Td fontWeight="medium">{obtenerNombreProducto(detalle.producto_id)}</Td>
                    <Td textAlign="center">
                      <Flex align="center" justify="center" gap={2}>
                        <IconButton
                          icon={<FaMinus />}
                          size="sm"
                          color={"black"}
                          onClick={() => handleActualizarCantidad(detalle.producto_id, detalle.cantidad - 1)}
                        />
                        <Badge fontSize="md" px={3} py={1} borderRadius="md" color={"black"}>
                          {detalle.cantidad}
                        </Badge>
                        <IconButton
                          icon={<FaPlus />}
                          size="sm"
                          color={"black"}
                          onClick={() => handleActualizarCantidad(detalle.producto_id, detalle.cantidad + 1)}
                        />
                      </Flex>
                    </Td>
                    <Td textAlign="center">{formatearMonto(detalle.subtotal / detalle.cantidad)}</Td>
                    <Td textAlign="right">{formatearMonto(detalle.subtotal)}</Td>
                    <Td textAlign="right">
                      <IconButton
                        icon={<FaTrash />}
                        size="sm"
                        color={"red.900"}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => {
                          setProductoToDelete(detalle.producto_id);
                          setIsDeleteAlertOpen(true);
                        }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>

            <Box mt={6} p={4} bg="gray.50" borderRadius="lg">
              <Flex justify="space-between" align="center">
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  Total:
                </Text>
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  {formatearMonto(calcularTotal())}
                </Text>
              </Flex>
            </Box>

            <Flex justify="space-between" mt={6}>
            <Button
                size="sm"
                color="red.900"
                colorScheme="red"
                variant="ghost"
                border="2px"
                _hover={{ color: 'red.500' }}
                onClick={() => setIsClearAlertOpen(true)}
                leftIcon={<FaTrash />}
              >
                Vaciar Carrito
              </Button>
              <Button 
                colorScheme="blue" 
                size="sm"
                px={6}
                onClick={handleContinuarCompra}
              >
                Continuar Compra
              </Button>
            </Flex>
          </>
        ) : (
          <Box textAlign="center" py={10} bg="gray.50" borderRadius="lg">
            <Text fontSize="lg" color="gray.600">
              Tu carrito está vacío
            </Text>
          </Box>
        )}
      </Box>
      <AlertDialog
  isOpen={isClearAlertOpen}
  leastDestructiveRef={undefined}
  onClose={() => setIsClearAlertOpen(false)}
>
    <AlertDialogOverlay>
      <AlertDialogContent bg="white">
        <AlertDialogHeader 
          fontSize="lg" 
          fontWeight="bold" 
          color="gray.800"
          pb={4}
        >
          Vaciar Carrito
        </AlertDialogHeader>
        <AlertDialogBody color="gray.600">
          ¿Estás seguro que deseas eliminar todos los productos del carrito?
        </AlertDialogBody>
        <AlertDialogFooter>
          <Button 
            onClick={handleVaciarCarrito}
            color="white"
            bg="red.500"
            _hover={{ bg: "red.800" }}
            mr={2}
          >
            Vaciar
          </Button>
          <Button 
            onClick={() => setIsClearAlertOpen(false)}
            variant="outline"
            bg="gray.500"
            _hover={{ bg: "gray.800" }}
            color="white"
          >
            Cancelar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogOverlay>
    </AlertDialog>
      <AlertDialog
        isOpen={isDeleteAlertOpen}
        leastDestructiveRef={undefined}
        onClose={() => setIsDeleteAlertOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader 
              fontSize="lg" 
              fontWeight="bold" 
              color="gray.800"
              pb={4}
            >
              Eliminar Producto
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              ¿Estás seguro que deseas eliminar este producto del carrito?
            </AlertDialogBody>
            <AlertDialogFooter>
            <Button 
                onClick={handleConfirmDelete}
                color="white"
                bg="red.500"
                _hover={{ bg: "red.800" }}
                mr={2}
              >
                Eliminar
              </Button>
              <Button 
                onClick={() => setIsDeleteAlertOpen(false)}
                variant="outline"
                bg="gray.500"
                _hover={{ bg: "gray.800" }}
                color="white"
              >
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default Carrito;
