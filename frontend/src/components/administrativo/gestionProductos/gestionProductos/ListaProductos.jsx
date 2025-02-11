import React, { useState, useEffect } from "react";
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
  Image,
  Badge,
  useToast,
  Tooltip,
  Flex,
  Text,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { eliminarProducto } from "../../../../services/api";

const ListaProductos = ({ productos, onEditar, onEliminar }) => {
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleEliminarProducto = async () => {
    setIsLoading(true);
    try {
      await eliminarProducto(productoAEliminar.id);
      onEliminar(); // Actualizar la lista de productos
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto. Intente nuevamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const confirmarEliminacion = (producto) => {
    setProductoAEliminar(producto);
    onOpen();
  };

  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return (
        <Badge colorScheme="red" variant="subtle">
          Sin stock
        </Badge>
      );
    } else if (stock <= 10) {
      return (
        <Badge colorScheme="yellow" variant="subtle">
          Stock bajo ({stock})
        </Badge>
      );
    }
    return (
      <Badge colorScheme="green" variant="subtle">
        {stock} unidades
      </Badge>
    );
  };

  return (
    <>
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th textAlign="center" color="gray.600">ID</Th>
              <Th textAlign="left" color="gray.600">Producto</Th>
              <Th textAlign="left" color="gray.600">Descripción</Th>
              <Th textAlign="right" color="gray.600">Precio</Th>
              <Th textAlign="center" color="gray.600">Stock</Th>
              <Th textAlign="center" color="gray.600">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {productos.map((producto) => (
              <Tr 
                key={producto.id} 
                _hover={{ bg: "gray.50" }} 
                transition="all 0.2s"
              >
                <Td textAlign="center" fontSize="sm" color="gray.500">
                  #{producto.id}
                </Td>
                <Td>
                  <Flex align="center" gap={3}>
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      boxSize="40px"
                      objectFit="cover"
                      borderRadius="md"
                      fallback={<Skeleton boxSize="40px" borderRadius="md" />}
                    />
                    <Text fontWeight="medium" color="gray.700">
                      {producto.nombre}
                    </Text>
                  </Flex>
                </Td>
                <Td color="gray.600">
                  <Tooltip label={producto.descripcion} hasArrow>
                    <Text noOfLines={2}>{producto.descripcion}</Text>
                  </Tooltip>
                </Td>
                <Td textAlign="right" fontWeight="medium" color="gray.700">
                  ${producto.precio.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                </Td>
                <Td textAlign="center">
                  {getStockBadge(producto.stock)}
                </Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Tooltip label="Editar producto" hasArrow>
                      <IconButton
                        aria-label="Editar producto"
                        icon={<FaEdit />}
                        size="sm"
                        color={"blue.900"}
                        colorScheme="blue"
                        variant="ghost"
                        _hover={{ color: "blue.500" }}
                        onClick={() => onEditar(producto)}
                      />
                    </Tooltip>
                    <Tooltip label="Eliminar producto" hasArrow>
                      <IconButton
                        aria-label="Eliminar producto"
                        icon={<FaTrash />}
                        size="sm"
                        color={"red.900"}
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ color: 'red.500' }}
                        onClick={() => confirmarEliminacion(producto)}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Alert Dialog para confirmar eliminación de producto */}
      <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader 
              fontSize="lg" 
              fontWeight="bold" 
              color="gray.800"
              pb={4}
            >
              Eliminar Producto
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              ¿Estás seguro de que deseas eliminar el producto{" "}
              <Text as="span" fontWeight="bold" color="gray.800">
                {productoAEliminar?.nombre}
              </Text>
              ? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button
                bg="red.500"
                onClick={handleEliminarProducto}
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

export default ListaProductos;