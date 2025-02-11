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
import { listarCategorias } from "../../../../services/api";
import GoBackButton from "../../../GoBackButton";
import FormularioCategoria from "./FormularioCategoria";
import ListaCategorias from "./ListaCategoria";

const GestionCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    cargarCategorias();
  }, []);

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

  const handleEditarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
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
                  Gestión de Categorías
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {categorias.length} categorías registradas
              </Text>
            </VStack>
          </HStack>
          <Button colorScheme="blue" onClick={() => handleEditarCategoria(null)}>
            Agregar Categoría
          </Button>
        </HStack>

        <ListaCategorias
          categorias={categorias}
          onEditar={handleEditarCategoria}
          onEliminar={cargarCategorias}
        />

        <FormularioCategoria
          isOpen={isOpen}
          onClose={onClose}
          categoria={categoriaSeleccionada}
          onSubmitSuccess={cargarCategorias}
        />
      </VStack>
    </Container>
  );
};

export default GestionCategoria;