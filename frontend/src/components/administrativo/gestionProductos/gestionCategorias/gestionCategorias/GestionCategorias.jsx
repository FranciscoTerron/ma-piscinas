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
  IconButton,
  Input,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { listarCategorias } from "../../../../../services/api";
import GoBackButton from "../../../../GoBackButton";
import FormularioCategoria from "./FormularioCategoria";
import ListaCategorias from "./ListaCategoria";

const GestionCategoria = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [categoriasPorPagina, setCategoriasPorPagina] = useState(3);
  const [totalCategorias, setTotalCategorias] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const totalPaginas = Math.ceil(totalCategorias / categoriasPorPagina);

  useEffect(() => {
    cargarCategorias(paginaActual, categoriasPorPagina);
  }, [paginaActual, categoriasPorPagina]);

  const cargarCategorias = async (pagina, tamanio) => {
    try {
      const data = await listarCategorias(pagina, tamanio);
      setCategorias(data.categorias);
      setTotalCategorias(data.total);
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

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handleSiguientePagina = () => {
    setPaginaActual(prev => prev + 1);
  };

  const categoriasFiltradas = categorias.filter((categoria) => {
    const textoBusqueda = busqueda.toLowerCase();
    return (
      categoria.nombre.toLowerCase().includes(textoBusqueda) ||
      categoria.descripcion.toLowerCase().includes(textoBusqueda)
    );
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
                  Gestión de Categorías
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {totalCategorias} categorías registradas
              </Text>
            </VStack>
          </HStack>
          <Button colorScheme="blue" onClick={() => handleEditarCategoria(null)}>
            Agregar Categoría
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

        <Box overflowX="auto">
          <ListaCategorias
            categorias={categoriasFiltradas}
            onEditar={handleEditarCategoria}
            onEliminar={() => cargarCategorias(paginaActual, categoriasPorPagina)}
          />
        </Box>

        <FormularioCategoria
          isOpen={isOpen}
          onClose={onClose}
          categoria={categoriaSeleccionada}
          onSubmitSuccess={() => cargarCategorias(paginaActual, categoriasPorPagina)}
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

export default GestionCategoria;
