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
import { listarSubcategorias, listarCategorias } from "../../../../../services/api"; // Importa listarCategorias
import GoBackButton from "../../../../GoBackButton";
import FormularioCategoria from "./FormularioSubCate";
import ListaCategorias from "./ListaSubCate";

const GestionSubCate = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [categorias, setCategorias] = useState([]); // Estado para almacenar las categorías
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    cargarSubcategorias();
    cargarCategorias(); // Cargar la lista de categorías al montar el componente
  }, []);

  const cargarSubcategorias = async () => {
    try {
      const data = await listarSubcategorias();
      setSubcategorias(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de subcategorías.",
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

  const handleEditarSubcategoria = (subcategoria) => {
    setSubcategoriaSeleccionada(subcategoria);
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
                  Gestión de Subcategorías
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {subcategorias.length} subcategorías registradas
              </Text>
            </VStack>
          </HStack>
          <Button colorScheme="blue" onClick={() => handleEditarSubcategoria(null)}>
            Agregar Subcategoría
          </Button>
        </HStack>

        <ListaCategorias
          subcategorias={subcategorias}
          categorias={categorias} 
          onEditar={handleEditarSubcategoria}
          onEliminar={cargarSubcategorias}
        />

        <FormularioCategoria
          isOpen={isOpen}
          onClose={onClose}
          subcategoria={subcategoriaSeleccionada} 
          onSubmitSuccess={cargarSubcategorias}
        />
      </VStack>
    </Container>
  );
};

export default GestionSubCate;