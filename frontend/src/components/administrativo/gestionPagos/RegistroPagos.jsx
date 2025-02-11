import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Container,
  Text,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { FaTrash, FaMoneyBillWave } from "react-icons/fa";
import { obtenerPagos, eliminarPago, listarPagos } from "../../../services/api";
import GoBackButton from "../../GoBackButton";

const RegistroPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [pagoAEliminar, setPagoAEliminar] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    cargarPagos();
  }, []);

  const cargarPagos = async () => {
    try {
      const data = await listarPagos();
      console.log("Datos recibidos:", data); // Verifica los datos recibidos
      setPagos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de pagos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEliminarPago = async () => {
    try {
      await eliminarPago(pagoAEliminar.id);
      toast({
        title: "Pago eliminado",
        description: "El pago ha sido eliminado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      cargarPagos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el pago.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const confirmarEliminacion = (pago) => {
    setPagoAEliminar(pago);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={4}>
            <GoBackButton />
            <VStack align="flex-start" spacing={0}>
              <HStack>
                <FaMoneyBillWave size="24px" color="#4A5568" />
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  Registro de Pagos
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {pagos.length} pagos registrados
              </Text>
            </VStack>
          </HStack>
        </HStack>

        {/* Tabla de pagos */}
        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th textAlign="center" color="gray.600">ID</Th>
                <Th textAlign="center" color="gray.600">Fecha</Th>
                <Th textAlign="center" color="gray.600">Monto</Th>
                <Th textAlign="center" color="gray.600">Método de Pago</Th>
                <Th textAlign="center" color="gray.600">Estado</Th>
                <Th textAlign="center" color="gray.600">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pagos.length > 0 ? (
                pagos.map((pago) => (
                  <Tr key={pago.id} _hover={{ bg: "gray.50" }} transition="background-color 0.2s">
                    <Td textAlign="center" color="gray.700">#{pago.id}</Td>
                    <Td textAlign="center" color="gray.700">
                      {new Date(pago.fecha).toLocaleDateString()}
                    </Td>
                    <Td textAlign="center" color="gray.700">${pago.monto.toFixed(2)}</Td>
                    <Td textAlign="center" color="gray.700">{pago.metodo}</Td>
                    <Td textAlign="center" color={pago.estado === "Completado" ? "green.500" : "red.500"}>
                      {pago.estado}
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        aria-label="Eliminar pago"
                        icon={<FaTrash />}
                        size="sm"
                        color={"red.900"}
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ color: 'red.500' }}
                        onClick={() => confirmarEliminacion(pago)}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" textAlign="center" color="gray.500">
                    No hay pagos registrados.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      {/* Alert Dialog para eliminación */}
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="gray.800" pb={4}>
              Eliminar Pago
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              ¿Estás seguro de que deseas eliminar el pago con ID{" "}
              <Text as="span" fontWeight="bold" color="gray.800">
                #{pagoAEliminar?.id}
              </Text>
              ? Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button
                bg="red.500"
                color={"white"}
                onClick={handleEliminarPago}
                _hover={{ bg: 'red.800' }}
              >
                Eliminar
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                color="white"
                bg="gray.500"
                _hover={{ bg: "gray.800" }}
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

export default RegistroPagos;
