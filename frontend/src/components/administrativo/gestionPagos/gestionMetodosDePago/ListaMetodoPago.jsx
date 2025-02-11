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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
  Tooltip,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { obtenerMetodosPago, eliminarMetodoPago } from "../../../../services/api";

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
                        color={"blue.900"}
                        colorScheme="blue"
                        variant="ghost"
                        _hover={{ color: "blue.500" }}
                        onClick={() => onEditar(metodo)}
                      />
                    </Tooltip>
                    <Tooltip label="Eliminar método de pago" hasArrow>
                      <IconButton
                        aria-label="Eliminar método"
                        icon={<FaTrash />}
                        size="sm"
                        color={"red.900"}
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ color: 'red.500' }}
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

      {/* Alert Dialog para eliminar método de pago */}
      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader 
              fontSize="lg" 
              fontWeight="bold" 
              color="gray.800"
              pb={4}
            >
              Eliminar Método de Pago
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              ¿Estás seguro de que deseas eliminar el método de pago{" "}
              <Text as="span" fontWeight="bold" color="gray.800">
                {metodoAEliminar?.nombre}
              </Text>
              ? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
            <Button
                bg="red.500"
                onClick={handleEliminarMetodo}
                isLoading={isLoading}
                _hover={{ bg: 'red.800' }}
                leftIcon={<FaTrash />}
                color="white"
              >
                Eliminar
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                bg="gray.500"
                _hover={{ bg: "gray.800" }}
                isDisabled={isLoading}
                color="white"
              >
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ListaMetodosPago;