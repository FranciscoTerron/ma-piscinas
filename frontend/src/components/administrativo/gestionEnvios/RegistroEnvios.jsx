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
import { FaTrash, FaTruck } from "react-icons/fa";
import { obtenerEnvios, eliminarEnvio, listarEnvios } from "../../../services/api";
import GoBackButton from "../../GoBackButton";

const RegistrarEnvios = () => {
  const [envios, setEnvios] = useState([]);
  const [envioAEliminar, setEnvioAEliminar] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    cargarEnvios();
  }, []);

  const cargarEnvios = async () => {
    try {
      const data = await listarEnvios();
      setEnvios(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de envíos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEliminarEnvio = async () => {
    try {
      await eliminarEnvio(envioAEliminar.id);
      toast({
        title: "Envío eliminado",
        description: "El envío ha sido eliminado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      cargarEnvios();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el envío.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const confirmarEliminacion = (envio) => {
    setEnvioAEliminar(envio);
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
                <FaTruck size="24px" color="#4A5568" />
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  Registro de Envíos
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {envios.length} envíos registrados
              </Text>
            </VStack>
          </HStack>
        </HStack>

        <Box bg="white" borderRadius="lg" boxShadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden">
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th textAlign="center" color="gray.600">ID</Th>
                <Th textAlign="center" color="gray.600">Fecha</Th>
                <Th textAlign="center" color="gray.600">Destino</Th>
                <Th textAlign="center" color="gray.600">Método de Envío</Th>
                <Th textAlign="center" color="gray.600">Estado</Th>
                <Th textAlign="center" color="gray.600">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {envios.length > 0 ? (
                envios.map((envio) => (
                  <Tr key={envio.id} _hover={{ bg: "gray.50" }} transition="background-color 0.2s">
                    <Td textAlign="center" color="gray.700">#{envio.id}</Td>
                    <Td textAlign="center" color="gray.700">
                      {new Date(envio.fecha).toLocaleDateString()}
                    </Td>
                    <Td textAlign="center" color="gray.700">{envio.destino}</Td>
                    <Td textAlign="center" color="gray.700">{envio.metodo}</Td>
                    <Td textAlign="center" color={envio.estado === "Entregado" ? "green.500" : "red.500"}>
                      {envio.estado}
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        aria-label="Eliminar envío"
                        icon={<FaTrash />}
                        size="sm"
                        color={"red.900"}
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ color: 'red.500' }}
                        onClick={() => confirmarEliminacion(envio)}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" textAlign="center" color="gray.500">
                    No hay envíos registrados.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="gray.800" pb={4}>
              Eliminar Envío
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              ¿Estás seguro de que deseas eliminar el envío con ID {" "}
              <Text as="span" fontWeight="bold" color="gray.800">
                #{envioAEliminar?.id}
              </Text>
              ? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button bg="red.500" color={"white"} onClick={handleEliminarEnvio} _hover={{ bg: 'red.800' }}>
                Eliminar
              </Button>
              <Button onClick={onClose} variant="outline" color="white" bg="gray.500" _hover={{ bg: "gray.800" }}>
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default RegistrarEnvios;
