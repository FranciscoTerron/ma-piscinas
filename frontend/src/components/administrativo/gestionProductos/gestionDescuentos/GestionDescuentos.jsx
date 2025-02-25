import React, { useEffect, useState } from "react";
import {
  Container,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  useDisclosure,
  Input,
  Select
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { listarDescuentos } from "../../../../services/api";
import GoBackButton from "../../../GoBackButton";
import FormularioDescuento from "./FormularioDescuentos";
import ListaDescuentos from "./ListaDescuentos";

const GestionDescuentos = () => {
  const [descuentos, setDescuentos] = useState([]);
  const [descuentoSeleccionado, setDescuentoSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [descuentosPorPagina, setDescuentosPorPagina] = useState(10);
  const [totalDescuentos, setTotalDescuentos] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const totalPaginas = Math.ceil(totalDescuentos / descuentosPorPagina);

  useEffect(() => {
    cargarDescuentos();
  }, [paginaActual, descuentosPorPagina]);

  const cargarDescuentos = async (paginaActual,descuentosPorPagina ) => {
    try {
      const response = await listarDescuentos(paginaActual, descuentosPorPagina);
      setDescuentos(response.descuentos);
      setTotalDescuentos(response.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de descuentos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditarDescuento = (descuento) => {
    setDescuentoSeleccionado(descuento);
    onOpen();
  };

  const handleSiguientePagina = () => setPaginaActual(prev => prev + 1);
  const handlePaginaAnterior = () => paginaActual > 1 && setPaginaActual(prev => prev - 1);

  const descuentosFiltrados = descuentos.filter(descuento => 
    descuento.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    descuento.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

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
                  Gestión de Descuentos
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {totalDescuentos} descuentos disponibles
              </Text>
            </VStack>
          </HStack>
          <Button colorScheme="blue" onClick={() => handleEditarDescuento(null)}>
            Nuevo Descuento
          </Button>
        </HStack>

        <Input
          placeholder="Buscar por nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          bg="white"
          border="1px"
          borderColor="gray.300"
          color="black"
          _placeholder={{ color: "gray.500" }}
        />

        <ListaDescuentos
          descuentos={descuentosFiltrados}
          onEditar={handleEditarDescuento}
          onEliminar={cargarDescuentos}
        />

        <FormularioDescuento
          isOpen={isOpen}
          onClose={onClose}
          onSubmitSuccess={() => {
            cargarDescuentos();
            setDescuentoSeleccionado(null);
          }}
          descuento={descuentoSeleccionado}
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

export default GestionDescuentos;