import React, { useEffect, useState } from "react";
import { Container,VStack, HStack, Text, useToast} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { listarPedidos } from "../../../services/api";
import GoBackButton from "../../GoBackButton";
import ListarPedidos from "./ListarPedidos";

const GestionPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const toast = useToast();

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const data = await listarPedidos();
      setPedidos(data);
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
                {pedidos.length} pedidos
              </Text>
            </VStack>
          </HStack>
        </HStack>

        <ListarPedidos
          pedidos={pedidos}
        />
      </VStack>
    </Container>
  );
};

export default GestionPedidos;