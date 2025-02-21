import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  Text,
  Flex,
} from "@chakra-ui/react";
import { listarPedidoDetalles, listarProductos } from "../../../services/api";

const ListarDetallesPedido = ({ pedidoId, isOpen, onClose }) => {
  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const toast = useToast();

  const ITEMS_POR_PAGINA = 3;

  useEffect(() => {
    if (isOpen) {
      cargarDetalles();
      cargarProductos();
    }
  }, [isOpen]);

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

  const cargarDetalles = async () => {
    setLoading(true);
    try {
      const data = await listarPedidoDetalles(pedidoId);
      console.log("ACAAA",data);
      setDetalles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del pedido.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const obtenerNombreProducto = (productoId) => {
    const producto = productos.find((prod) => prod.id === productoId);
    return producto ? producto.nombre : "Desconocido";
  };

  // **Lógica de Paginación**
  const indiceInicial = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const detallesPaginados = detalles.slice(indiceInicial, indiceInicial + ITEMS_POR_PAGINA);
  const totalPaginas = Math.ceil(detalles.length / ITEMS_POR_PAGINA);

  // **Cálculo del Total**
  const total = detalles.reduce((sum, item) => sum + item.subtotal, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
      <ModalContent borderColor="blue.200" bg="white">
        <ModalHeader textAlign="center" bg="blue.100" color="blue.700">
          Detalles del Pedido #{pedidoId}
        </ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody>
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" color="black">
                <Thead>
                  <Tr>
                    <Th color="black">Producto</Th>
                    <Th color="black" textAlign="center">Cantidad</Th>
                    <Th color="black" textAlign="right">Precio</Th>
                    <Th color="black" textAlign="right">Subtotal</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {detallesPaginados.map((detalle) => (
                    <Tr key={detalle.id}>
                      <Td>{obtenerNombreProducto(detalle.producto_id)}</Td>
                      <Td textAlign="center">{detalle.cantidad}</Td>
                      <Td textAlign="right">${detalle.precio_unitario.toFixed(2)}</Td>
                      <Td textAlign="right">${detalle.subtotal.toFixed(2)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {/* **Total de Subtotales** */}
              <Box mt={4} p={3} bg="gray.100" borderRadius="md">
                <Text fontWeight="bold" fontSize="lg" textAlign="right" color={"black"}>
                  Total: ${total.toFixed(2)}
                </Text>
              </Box>

              {/* **Controles de Paginación** */}
              {detalles.length > ITEMS_POR_PAGINA && (
                <Flex justify="center" mt={4} gap={3}>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => setPaginaActual(paginaActual - 1)}
                    isDisabled={paginaActual === 1}
                  >
                    Anterior
                  </Button>
                  <Text fontSize="sm" fontWeight="bold" color="black">
                    Página {paginaActual} de {totalPaginas}
                  </Text>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => setPaginaActual(paginaActual + 1)}
                    isDisabled={paginaActual === totalPaginas}
                  >
                    Siguiente
                  </Button>
                </Flex>
              )}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ListarDetallesPedido;
