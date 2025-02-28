import React, { useState, useEffect } from "react";
import { Box, VStack, Text, Heading, Spinner, Alert, AlertIcon, Flex, Divider,} from "@chakra-ui/react";
import { obtenerPedidosUsuario } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useAuth();

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

  return (
    <Box
      w="100%"
      p={6}
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
            <Box key={pedido.id} w="100%" p={4} borderWidth="1px" borderRadius="lg">
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
                </Flex>
              </Flex>
            </Box>
          ))
        )}
      </VStack>
    </Box>
  );
};

export default HistorialPedidos;