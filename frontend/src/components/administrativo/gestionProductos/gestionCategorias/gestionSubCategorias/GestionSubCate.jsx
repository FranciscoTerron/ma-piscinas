import React, { useEffect, useState } from "react";
import {
  Container,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  useDisclosure,
  Box,
  Input,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { listarSubcategorias, listarCategorias } from "../../../../../services/api";
import GoBackButton from "../../../../GoBackButton";
import FormularioCategoria from "./FormularioSubCate";
import ListaCategorias from "./ListaSubCate";

const GestionSubCate = () => {
  const [subcategorias, setSubcategorias] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategoriaSeleccionada, setSubcategoriaSeleccionada] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [subcategoriasPorPagina] = useState(3);
  const [totalSubCategorias, setTotalSubCategorias] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const totalPaginas = Math.ceil(totalSubCategorias / subcategoriasPorPagina);

  useEffect(() => {
    cargarSubcategorias(paginaActual, subcategoriasPorPagina);
    cargarCategorias();
  }, [paginaActual, subcategoriasPorPagina]);

  const cargarSubcategorias = async (pagina, tamanio) => {
    try {
      const data = await listarSubcategorias(pagina, tamanio);
      setSubcategorias(data.subcategorias);
      setTotalSubCategorias(data.total);
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
      setCategorias(data.categorias);
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

  const handleSubmitSuccess = (nuevaSubcategoria) => {
    if (subcategoriaSeleccionada) {
      // Si es una edición, actualiza la subcategoría existente
      setSubcategorias((prev) =>
        prev.map((sub) =>
          sub.id === nuevaSubcategoria.id ? nuevaSubcategoria : sub
        )
      );
    } else {
      // Si es una nueva subcategoría, agrégala al estado
      setSubcategorias((prev) => [...prev, nuevaSubcategoria]);
      setTotalSubCategorias((prev) => prev + 1); // Actualiza el contador total
    }
  };

  const handleEliminar = () => {
    cargarSubcategorias(paginaActual, subcategoriasPorPagina); 
  };

  const handleSiguientePagina = () => {
    setPaginaActual((prev) => prev + 1);
  };

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const subCategoriasFiltradas = (subcategorias || []).filter((subcategoria) => {
    const textoBusqueda = busqueda.toLowerCase();
    return subcategoria.nombre.toLowerCase().includes(textoBusqueda);
  });

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
                {totalSubCategorias} subcategorías registradas
              </Text>
            </VStack>
          </HStack>
          <Button
            colorScheme="blue"
            onClick={() => handleEditarSubcategoria(null)}
          >
            Agregar Subcategoría
          </Button>
        </HStack>

        <Input
          placeholder="Buscar por nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          bg="white"
          border="1px"
          borderColor="gray.300"
          _focus={{ borderColor: "blue.500" }}
          color="black"
          _placeholder={{ color: "gray.500" }}
        />

        <ListaCategorias
          subcategorias={subCategoriasFiltradas}
          categorias={categorias}
          onEditar={handleEditarSubcategoria}
          onEliminar={handleEliminar}
        />

        <FormularioCategoria
          isOpen={isOpen}
          onClose={onClose}
          subcategoria={subcategoriaSeleccionada}
          onSubmitSuccess={handleSubmitSuccess} // Pasar la función actualizada
        />

        <HStack spacing={2} justify="center" mt={4} color="black">
          <Button
            colorScheme="blue"
            size="sm"
            onClick={handlePaginaAnterior}
            isDisabled={paginaActual === 1}
          >
            Anterior
          </Button>
          <Text>
            Página {paginaActual} de {totalPaginas}
          </Text>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={handleSiguientePagina}
            isDisabled={paginaActual >= totalPaginas}
          >
            Siguiente
          </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default GestionSubCate;