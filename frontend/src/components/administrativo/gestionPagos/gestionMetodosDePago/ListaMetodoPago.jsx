import React, { useState } from "react"; 
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
  Image,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { eliminarMetodoPago } from "../../../../services/api";

const ListaMetodosPago = ({ metodosPago = [], onEditar, onEliminar }) => {
  const [metodoAEliminar, setMetodoAEliminar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleEliminarMetodo = async () => {
    setIsLoading(true);
    try {
      await eliminarMetodoPago(metodoAEliminar.id);
      onEliminar();
      toast({
        title: "Método de pago eliminado",
        description: "El método de pago ha sido eliminado exitosamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el método de pago. Intente nuevamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const confirmarEliminacion = (metodo) => {
    setMetodoAEliminar(metodo);
    onOpen();
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
              <Th textAlign="center" color="gray.600">Imagen</Th>
              <Th textAlign="center" color="gray.600">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {metodosPago.map((metodo) => (
              <Tr key={metodo.id} _hover={{ bg: "gray.50" }} transition="all 0.2s">
                <Td textAlign="center" fontSize="sm" color="gray.500">#{metodo.id}</Td>
                <Td fontWeight="medium" color="gray.700">{metodo.tipo}</Td>
                <Td color="gray.600">{metodo.nombre}</Td>
                <Td textAlign="center">
                  <Image
                    src={metodo.imagen}
                    alt={metodo.nombre}
                    boxSize="40px"
                    objectFit="cover"
                    borderRadius="md"
                    fallback={<Skeleton boxSize="40px" borderRadius="md" />}
                  />
                </Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Tooltip label="Editar método de pago" hasArrow>
                      <IconButton
                        aria-label="Editar método de pago"
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
                        aria-label="Eliminar método de pago"
                        icon={<FaTrash />}
                        size="sm"
                        color={"red.900"}
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ color: "red.500" }}
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

      {/* Alert Dialog para confirmar eliminación */}
      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="gray.800" pb={4}>
              Eliminar Método de Pago
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              ¿Estás seguro de que deseas eliminar el método de pago "{metodoAEliminar?.nombre}"?
              Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button
                bg="red.500"
                onClick={handleEliminarMetodo}
                _hover={{ bg: "red.800" }}
                isLoading={isLoading}
                leftIcon={<FaTrash />}
                color="white"
              >
                Eliminar
              </Button>
              <Button onClick={onClose} variant="outline" bg="gray.500" _hover={{ bg: "gray.800" }} color="white" isDisabled={isLoading}>
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
