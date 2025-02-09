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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
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
import { FaTrash, FaEdit, FaExclamationTriangle } from "react-icons/fa";
import { eliminarProducto } from "../../../services/api";

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
                        colorScheme="blue"
                        variant="ghost"
                        _hover={{ bg: "blue.50" }}
                        onClick={() => onEditar(producto)}
                      />
                    </Tooltip>
                    <Tooltip label="Eliminar producto" hasArrow>
                      <IconButton
                        aria-label="Eliminar producto"
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ bg: "red.50" }}
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

      {/* Modal de confirmación de eliminación */}
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center" gap={2}>
              <FaExclamationTriangle color="#E53E3E" />
              <Text>Eliminar Producto</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>
              ¿Estás seguro de que deseas eliminar el producto{" "}
              <strong>{productoAEliminar?.nombre}</strong>?
            </Text>
            <Text mt={2} color="red.500" fontSize="sm">
              Esta acción no se puede deshacer.
            </Text>
          </ModalBody>
          <ModalFooter bg="gray.50">
            <Button 
              variant="outline" 
              mr={3} 
              onClick={onClose}
              isDisabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              colorScheme="red" 
              onClick={handleEliminarProducto}
              isLoading={isLoading}
              leftIcon={<FaTrash />}
            >
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ListaProductos;