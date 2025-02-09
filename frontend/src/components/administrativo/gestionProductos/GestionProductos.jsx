import React, { useEffect, useState } from "react";
import {
  Container,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { listarProductos, listarCategorias } from "../../../services/api";
import GoBackButton from "../../GoBackButton";
import FormularioProducto from "./FormularioProducto";
import ListaProductos from "./ListaProductos";

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de productos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cargarCategorias = async () => {
    try {
      const data = await listarCategorias();
      setCategorias(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de categorías.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
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
                <FaEdit size="24px" color="#4A5568" />
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  Gestión de Productos
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {productos.length} productos disponibles
              </Text>
            </VStack>
          </HStack>
          <Button colorScheme="blue" onClick={() => handleEditarProducto(null)}>
            Agregar Producto
          </Button>
        </HStack>

        <ListaProductos
          productos={productos}
          onEditar={handleEditarProducto}
          onEliminar={cargarProductos}
        />

        <FormularioProducto
          isOpen={isOpen}
          onClose={onClose}
          categorias={categorias}
          producto={productoSeleccionado}
          onSubmitSuccess={cargarProductos}
        />
      </VStack>
    </Container>
  );
};

export default GestionProductos;