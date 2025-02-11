import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Badge,
  useToast,
  Tooltip,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaExclamationTriangle } from "react-icons/fa";
import { obtenerMetodosPago, eliminarMetodoPago } from "../../../services/api";

const ListaMetodosPago = ({ onEditar }) => {
  const [metodos, setMetodos] = useState([]);
  const [metodoAEliminar, setMetodoAEliminar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    fetchMetodosPago();
  }, []);

  const fetchMetodosPago = async () => {
    try {
      const data = await obtenerMetodosPago();
      setMetodos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los métodos de pago.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const confirmarEliminacion = (metodo) => {
    setMetodoAEliminar(metodo);
    onOpen();
  };

  const handleEliminarMetodo = async () => {
    setIsLoading(true);
    try {
      await eliminarMetodoPago(metodoAEliminar.id);
      setMetodos((prev) => prev.filter((m) => m.id !== metodoAEliminar.id));
      toast({
        title: "Método eliminado",
        description: "El método de pago ha sido eliminado exitosamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el método de pago.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <>
      <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th textAlign="center" color="gray.600">ID</Th>
              <Th textAlign="left" color="gray.600">Tipo</Th>
              <Th textAlign="left" color="gray.600">Nombre</Th>
              <Th textAlign="center" color="gray.600">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {metodos.map((metodo) => (
              <Tr key={metodo.id} _hover={{ bg: "gray.50" }} transition="all 0.2s">
                <Td textAlign="center" fontSize="sm" color="gray.500">#{metodo.id}</Td>
                <Td color="gray.700" fontWeight="medium">{metodo.tipo}</Td>
                <Td color="gray.600">{metodo.nombre}</Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Tooltip label="Editar método de pago" hasArrow>
                      <IconButton
                        aria-label="Editar método"
                        icon={<FaEdit />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        _hover={{ bg: "blue.50" }}
                        onClick={() => onEditar(metodo)}
                      />
                    </Tooltip>
                    <Tooltip label="Eliminar método de pago" hasArrow>
                      <IconButton
                        aria-label="Eliminar método"
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ bg: "red.50" }}
                        onClick={() => confirmarEliminacion(metodo)}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center" gap={2}>
              <FaExclamationTriangle color="#E53E3E" />
              <Text>Eliminar Método de Pago</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>
              ¿Estás seguro de que deseas eliminar el método de pago <strong>{metodoAEliminar?.nombre}</strong>?
            </Text>
            <Text mt={2} color="red.500" fontSize="sm">Esta acción no se puede deshacer.</Text>
          </ModalBody>
          <ModalFooter bg="gray.50">
            <Button variant="outline" mr={3} onClick={onClose} isDisabled={isLoading}>Cancelar</Button>
            <Button colorScheme="red" onClick={handleEliminarMetodo} isLoading={isLoading} leftIcon={<FaTrash />}>Eliminar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListaMetodosPago;