import React, { useEffect, useState } from "react";
import { Container,VStack, HStack, Text, useToast, Button} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { listarPedidos } from "../../../services/api";
import GoBackButton from "../../GoBackButton";
import ListarPedidos from "./ListarPedidos";

const GestionPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const toast = useToast();
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 3;
  const totalPaginas = Math.ceil(totalPedidos / pedidosPorPagina);

  useEffect(() => {
    cargarPedidos(paginaActual, pedidosPorPagina);
  }, [paginaActual]);

  const cargarPedidos = async (paginaActual,tamanio) => {
    try {
      const data = await listarPedidos(paginaActual,tamanio);
      setPedidos(data.pedidos);
      setTotalPedidos(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de pedidos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSiguientePagina = () => {
    setPaginaActual(prev => prev + 1);
  };

  const confirmarEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <HStack spacing={4}>
            <GoBackButton />
            <VStack align="flex-start" spacing={0}>
              <HStack>
                <FaEdit size="24px" color="#4A5568" />
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  Gestión de Pedidos
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {totalPedidos} pedidos
              </Text>
            </VStack>
          </HStack>
        </HStack>

        <ListarPedidos
          pedidos={pedidos}
        />

        <HStack spacing={2} justify="center" mt={4} color="black">
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => setPaginaActual(paginaActual - 1)}
            isDisabled={paginaActual === 1}
          >
            Anterior
          </Button>
          <Text>
            Página {paginaActual} de {totalPaginas}
          </Text>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={handleSiguientePagina}
            isDisabled={paginaActual >= totalPaginas}
          >
            Siguiente
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default GestionPedidos;