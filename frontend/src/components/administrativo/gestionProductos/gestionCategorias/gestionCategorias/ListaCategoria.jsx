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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { eliminarCategoria } from "../../../../../services/api";

const ListaCategorias = ({ categorias, onEditar, onEliminar }) => {
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleEliminarCategoria = async () => {
    setIsLoading(true);
    try {
      await eliminarCategoria(categoriaAEliminar.id);
      onEliminar(); // Actualizar la lista de categorías
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría. Intente nuevamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const confirmarEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    onOpen();
  };

  return (
    <>
      <Box bg="white" borderRadius="xl" boxShadow="sm" border="1px solid" borderColor="gray.200" overflow="hidden">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th textAlign="center" color="gray.600">ID</Th>
              <Th textAlign="left" color="gray.600">Nombre</Th>
              <Th textAlign="left" color="gray.600">Descripción</Th>
              <Th textAlign="center" color="gray.600">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {categorias.map((categoria) => (
              <Tr key={categoria.id} _hover={{ bg: "gray.50" }} transition="all 0.2s">
                <Td textAlign="center" fontSize="sm" color="gray.500">#{categoria.id}</Td>
                <Td fontWeight="medium" color="gray.700">{categoria.nombre}</Td>
                <Td color="gray.600">{categoria.descripcion}</Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Tooltip label="Editar categoría" hasArrow>
                      <IconButton
                        aria-label="Editar categoría"
                        icon={<FaEdit />}
                        size="sm"
                        color={"blue.900"}
                        colorScheme="blue"
                        variant="ghost"
                        _hover={{ color: "blue.500" }}
                        onClick={() => onEditar(categoria)}
                      />
                    </Tooltip>
                    <Tooltip label="Eliminar categoría" hasArrow>
                      <IconButton
                        aria-label="Eliminar categoría"
                        icon={<FaTrash />}
                        size="sm"
                        color={"red.900"}
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ color: 'red.500' }}
                        onClick={() => confirmarEliminacion(categoria)}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Alert Dialog para confirmar eliminación de categoría */}
      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader 
              fontSize="lg" 
              fontWeight="bold" 
              color="gray.800"
              pb={4}
            >
              Eliminar Categoría
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              ¿Estás seguro de que deseas eliminar la categoría{" "}
              <Text as="span" fontWeight="bold" color="gray.800">
                {categoriaAEliminar?.nombre}
              </Text>
              ? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button
                bg="red.500"
                onClick={handleEliminarCategoria}
                _hover={{ bg: "red.800" }}
                isLoading={isLoading}
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
                color="white"
                isDisabled={isLoading}
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

export default ListaCategorias;