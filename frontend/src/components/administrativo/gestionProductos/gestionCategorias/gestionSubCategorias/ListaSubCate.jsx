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
import { eliminarSubcategoria } from "../../../../../services/api";

const ListarSubCate = ({ subcategorias, categorias, onEditar, onEliminar }) => {
  const obtenerNombreCategoria = (categoriaId) => {
    const categoria = categorias.find((cat) => cat.id === categoriaId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  const [subcategoriaAEliminar, setSubcategoriaAEliminar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleEliminarSubcategoria = async () => {
    setIsLoading(true);
    try {
      await eliminarSubcategoria(subcategoriaAEliminar.id);
      onEliminar(); // Actualizar la lista de subcategorías
      toast({
        title: "Subcategoría eliminada",
        description: "La subcategoría ha sido eliminada exitosamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la subcategoría. Intente nuevamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const confirmarEliminacion = (subcategoria) => {
    setSubcategoriaAEliminar(subcategoria);
    onOpen();
  };

  return (
    <>
      <Box p={6}
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          border="1px"
          borderColor="gray.200"
          overflow="hidden">
        <Table variant="simple">
          <Thead bg="blue.50">
            <Tr>
              <Th textAlign="center" color="blue.600">ID</Th>
              <Th textAlign="left" color="blue.600">Nombre de la Subcategoría</Th>
              <Th textAlign="left" color="blue.600">Categoría</Th>
              <Th textAlign="center" color="blue.600">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {subcategorias && subcategorias.length > 0 ? (
              subcategorias.map((subcategoria) => (
                <Tr key={subcategoria.id} _hover={{ bg: "gray.50" }} transition="all 0.2s">
                  <Td textAlign="center" fontSize="sm" color="gray.500">#{subcategoria.id}</Td>
                  <Td fontWeight="medium" color="gray.700">{subcategoria.nombre}</Td>
                  <Td color="gray.600"> {obtenerNombreCategoria(subcategoria.categoria_id)}</Td>
                  <Td>
                    <Flex justify="center" gap={2}>
                      <Tooltip label="Editar subcategoría" hasArrow>
                        <IconButton
                          aria-label="Editar subcategoría"
                          icon={<FaEdit />}
                          size="sm"
                          color={"blue.900"}
                          colorScheme="blue"
                          variant="ghost"
                          _hover={{ color: "blue.500" }}
                          onClick={() => onEditar(subcategoria)}
                        />
                      </Tooltip>
                      <Tooltip label="Eliminar subcategoría" hasArrow>
                        <IconButton
                          aria-label="Eliminar subcategoría"
                          icon={<FaTrash />}
                          size="sm"
                          color={"red.900"}
                          colorScheme="red"
                          variant="ghost"
                          _hover={{ color: 'red.500' }}
                          onClick={() => confirmarEliminacion(subcategoria)}
                        />
                      </Tooltip>
                    </Flex>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={4} textAlign="center" color="gray.500" py={6}>
                  No hay subcategorías disponibles.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Alert Dialog para confirmar eliminación de subcategoría */}
      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader 
              fontSize="lg" 
              fontWeight="bold" 
              color="gray.800"
              pb={4}
            >
              Eliminar Subcategoría
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              ¿Estás seguro de que deseas eliminar la subcategoría{" "}
              <Text as="span" fontWeight="bold" color="gray.800">
                {subcategoriaAEliminar?.nombre}
              </Text>
              ? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button
                bg="red.500"
                onClick={handleEliminarSubcategoria}
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

export default ListarSubCate;