import React, { useEffect, useState } from "react";
import {
  Container,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { FaCreditCard } from "react-icons/fa";
import { listarMetodosPago } from "../../../../services/api";
import GoBackButton from "../../../GoBackButton";
import FormularioMetodoPago from "./FormularioMetodoPago";
import ListaMetodosPago from "./ListaMetodoPago";

const MetodosDePago = () => {
  const [metodosPago, setMetodosPago] = useState([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [total, setTotal] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;
  const totalPaginas = Math.ceil(total / porPagina);

  useEffect(() => {
    cargarMetodosPago();
  }, [paginaActual]);

  const cargarMetodosPago = async () => {
    try {
      const data = await listarMetodosPago(paginaActual, porPagina);
      setMetodosPago(data.metodosPago);
      setTotal(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de métodos de pago.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditarMetodo = (metodo) => {
    setMetodoSeleccionado(metodo);
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
                <FaCreditCard size="24px" color="#4A5568" />
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  Gestión de Métodos de Pago
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {total} métodos disponibles
              </Text>
            </VStack>
          </HStack>
          <Button colorScheme="blue" onClick={() => handleEditarMetodo(null)}>
            Agregar Método de Pago
          </Button>
        </HStack>

        <ListaMetodosPago
          metodosPago={metodosPago}
          onEditar={handleEditarMetodo}
          onEliminar={cargarMetodosPago}
        />
        <HStack spacing={2} justify="center" mt={4} color={"black"}>
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
            onClick={() => setPaginaActual(paginaActual + 1)}
            isDisabled={paginaActual === totalPaginas}
          >
            Siguiente
          </Button>
        </HStack>
        <FormularioMetodoPago
          isOpen={isOpen}
          onClose={onClose}
          metodo={metodoSeleccionado}
          onSubmitSuccess={cargarMetodosPago}
        />
      </VStack>
    </Container>
  );
};

export default MetodosDePago;