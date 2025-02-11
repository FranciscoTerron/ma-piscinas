import React, { useState, useEffect } from "react";
import {
  Box, Table, Thead, Tbody, Tr, Th, Td, IconButton, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody,
  ModalCloseButton, Button, Tooltip, Flex, Text, Heading, Input, Select,
  useDisclosure, useToast
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaPlus, FaExclamationTriangle } from "react-icons/fa";
import { obtenerMetodosPago, agregarMetodoPago, eliminarMetodoPago } from "../../../services/api";

const ListaMetodosPago = () => {
  const [metodos, setMetodos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [metodoAEliminar, setMetodoAEliminar] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [nuevoMetodo, setNuevoMetodo] = useState({ tipo: "", nombre: "" });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    cargarMetodos();
  }, []);

  const cargarMetodos = async () => {
    try {
      const data = await obtenerMetodosPago();
      setMetodos(data);
    } catch (error) {
      console.error("Error al obtener métodos de pago:", error);
    }
  };

  const handleAgregarMetodo = async () => {
    try {
      setIsLoading(true);
      await agregarMetodoPago(nuevoMetodo);
      toast({
        title: "Método agregado",
        description: "El método de pago se agregó correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setIsFormOpen(false);
      cargarMetodos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el método de pago.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmarEliminacion = (metodo) => {
    setMetodoAEliminar(metodo);
    onOpen();
  };

  const handleEliminarMetodo = async () => {
    try {
      setIsLoading(true);
      await eliminarMetodoPago(metodoAEliminar.id);
      toast({
        title: "Método eliminado",
        description: "El método de pago se eliminó correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      cargarMetodos();
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
    }
  };

  return (
    <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Heading size="md" color="gray.700">Métodos de Pago</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="green" onClick={() => setIsFormOpen(true)}>
          Agregar Método
        </Button>
      </Flex>

      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            <Th textAlign="center">ID</Th>
            <Th textAlign="left">Tipo</Th>
            <Th textAlign="left">Nombre</Th>
            <Th textAlign="center">Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {metodos.length > 0 ? (
            metodos.map((metodo) => (
              <Tr key={metodo.id} _hover={{ bg: "gray.50" }}>
                <Td textAlign="center">#{metodo.id}</Td>
                <Td>{metodo.tipo}</Td>
                <Td>{metodo.nombre}</Td>
                <Td textAlign="center">
                  <Flex justify="center" gap={2}>
                    <Tooltip label="Eliminar método">
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
            ))
          ) : (
            <Tr>
              <Td colSpan="4" textAlign="center">No hay métodos de pago registrados.</Td>
            </Tr>
          )}
        </Tbody>
      </Table>

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
          <ModalBody>
            <Text>¿Estás seguro de que deseas eliminar el método de pago <strong>{metodoAEliminar?.nombre}</strong>?</Text>
            <Text mt={2} color="red.500">Esta acción no se puede deshacer.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button colorScheme="red" onClick={handleEliminarMetodo} isLoading={isLoading} leftIcon={<FaTrash />}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para agregar un nuevo método de pago */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Método de Pago</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Tipo</Text>
            <Select
              placeholder="Seleccionar tipo"
              value={nuevoMetodo.tipo}
              onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, tipo: e.target.value })}
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="CRÉDITO">Crédito</option>
              <option value="DÉBITO">Débito</option>
            </Select>
            <Text mt={4}>Nombre</Text>
            <Input
              placeholder="Nombre del método"
              value={nuevoMetodo.nombre}
              onChange={(e) => setNuevoMetodo({ ...nuevoMetodo, nombre: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
            <Button colorScheme="green" onClick={handleAgregarMetodo} isLoading={isLoading}>
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ListaMetodosPago;
