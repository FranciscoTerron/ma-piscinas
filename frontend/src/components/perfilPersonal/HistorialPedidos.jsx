import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Divider,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { obtenerPedidosUsuario, cancelarPedido } from "../../services/api"; // Asegúrate de importar cancelarPedido
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaTimes } from "react-icons/fa"; // Agrega FaTimes para el ícono de cancelar
import ListarDetallesPedido from "../administrativo/gestionPedidos/ListarDetallesPedido";

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();
  const { isOpen: isDetallesOpen, onOpen: onDetallesOpen, onClose: onDetallesClose } = useDisclosure();
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [pedidoACancelar, setPedidoACancelar] = useState(null); // Estado para el pedido a cancelar
  const toast = useToast();

  // Obtener pedidos del usuario
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const data = await obtenerPedidosUsuario(userId);
        setPedidos(data);
        setIsLoading(false);
      } catch (error) {
        setError("Error al cargar el historial de pedidos.");
        setIsLoading(false);
      }
    };
    fetchPedidos();
  }, [userId]);

  const handleVerDetalles = (pedidoId) => {
    setPedidoSeleccionado(pedidoId);
    onDetallesOpen();
  };

  // Función para manejar la cancelación del pedido
  const handleCancelarPedido = async () => {
    try {
      await cancelarPedido(pedidoACancelar); // Llama a la API para cancelar el pedido
      // Actualiza el estado del pedido en la lista local
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id === pedidoACancelar ? { ...pedido, estado: "CANCELADO" } : pedido
        )
      );
      toast({
        title: "Pedido cancelado",
        description: "El pedido ha sido cancelado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cancelar el pedido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setPedidoACancelar(null); // Limpia el estado del pedido a cancelar
    }
  };

  return (
    <Box
      w="100%"
      p={2}
      borderRadius="lg"
      boxShadow="xl"
      bg="white"
      border="2px solid"
      borderColor="#00CED1"
    >
      <VStack spacing={6} align="start">
        <Heading size="lg" color="teal.600">
          Historial de Pedidos
        </Heading>
        <Divider borderColor="teal.300" />

        {isLoading ? (
          <Spinner size="lg" color="teal.500" />
        ) : error ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        ) : pedidos.length === 0 ? (
          <Text color="gray.600">No hay pedidos registrados.</Text>
        ) : (
          pedidos.map((pedido) => (
            <Box key={pedido.id} w="100%" p={2} borderWidth="1px" borderRadius="lg">
              <Flex align="center" justify="space-between">
                {/* Información del pedido */}
                <Flex align="center" flex="1" wrap="wrap" gap={4}>
                  <Flex align="center">
                    <Text fontWeight="bold" mr={1}>Número de Pedido:</Text>
                    <Text maxW="120px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {pedido.id}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text fontWeight="bold" mr={1}>Fecha:</Text>
                    <Text maxW="120px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {new Date(pedido.fecha_creacion).toLocaleDateString()}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text fontWeight="bold" mr={1}>Estado:</Text>
                    <Text maxW="120px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {pedido.estado}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text fontWeight="bold" mr={1}>Total:</Text>
                    <Text maxW="120px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      ${pedido.total.toFixed(2)}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Button
                      leftIcon={<FaEye />}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={() => handleVerDetalles(pedido.id)}
                      top="-6px"
                    >
                      Ver Detalles
                    </Button>
                    {pedido.estado === "PENDIENTE" && (
                      <Button
                        leftIcon={<FaTimes />}
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        ml={2}
                        onClick={() => setPedidoACancelar(pedido.id)}
                        top="-6px"
                      >
                        Cancelar Pedido
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </Flex>
            </Box>
          ))
        )}
      </VStack>

      {/* Modal de confirmación para cancelar el pedido */}
      {pedidoACancelar && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.5)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex="9999"
        >
          <Box bg="white" p={6} borderRadius="lg" boxShadow="xl">
            <Text fontWeight="bold" mb={4}>
              ¿Estás seguro de que deseas cancelar este pedido?
            </Text>
            <Text mb={4}>Esta acción es irreversible.</Text>
            <Flex justify="flex-end" gap={2}>
              <Button
                colorScheme="gray"
                onClick={() => setPedidoACancelar(null)} 
              >
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={handleCancelarPedido} 
              >
                Sí, cancelar
              </Button>
            </Flex>
          </Box>
        </Box>
      )}

      {/* Modal para ver detalles del pedido */}
      {pedidoSeleccionado && (
        <ListarDetallesPedido
          pedidoId={pedidoSeleccionado}
          isOpen={isDetallesOpen}
          onClose={onDetallesClose}
        />
      )}
    </Box>
  );
};

export default HistorialPedidos;