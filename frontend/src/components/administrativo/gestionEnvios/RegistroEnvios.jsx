import React, { useEffect, useState } from "react";
import { Box, Input,  Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, useDisclosure,
  AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody,
  AlertDialogFooter, useToast, Container, Text, HStack, VStack, Select} from "@chakra-ui/react";
import { FaTrash, FaTruck } from "react-icons/fa";
import { eliminarEnvio, listarEnvios, listarMetodosEnvios } from "../../../services/api";
import GoBackButton from "../../GoBackButton";

const RegistrarEnvios = () => {
  const [envios, setEnvios] = useState([]);
  const [metodosEnvios, setMetodosEnvios] = useState([]);
  const [envioAEliminar, setEnvioAEliminar] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [total, setTotal] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;
  const totalPaginas = Math.ceil(total / porPagina);
  const [busqueda, setBusqueda] = useState("");
  const [filtroMetodo, setFiltroMetodo] = useState("");
  useEffect(() => {
    cargarEnvios();
    cargarMetodosEnvio();
  }, [paginaActual]);

  const cargarEnvios = async (paginaActual, usuariosPorPagina) => {
    try {
      const data = await listarEnvios(paginaActual, usuariosPorPagina);
      setEnvios(data.envios);
      setTotal(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de envíos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cargarMetodosEnvio = async (paginaActual, usuariosPorPagina) => {
    try {
      const data = await listarMetodosEnvios(paginaActual, usuariosPorPagina);
      setMetodosEnvios(data.empresas);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de envíos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEliminarEnvio = async () => {
    try {
      await eliminarEnvio(envioAEliminar.id);
      toast({
        title: "Envío eliminado",
        description: "El envío ha sido eliminado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      cargarEnvios();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el envío.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const confirmarEliminacion = (envio) => {
    setEnvioAEliminar(envio);
    onOpen();
  };

  const obtenerNombreMetodosEnvios = (metodoEnvioId) => {
    const empresa = metodosEnvios.find((r) => r.id === metodoEnvioId);
    return empresa ? empresa.nombre : "Desconocido";
  };
  
  const filtrados = envios.filter((envio) => {
    const empresa = obtenerNombreMetodosEnvios(envio.empresa_id).toLowerCase();
    const coincideBusqueda =
      envio.estado.toLowerCase().includes(busqueda.toLowerCase()) ||
      empresa.includes(busqueda.toLowerCase())
    
    const coincideMetodo = filtroMetodo 
      ? String(envio.empresa_id) === filtroMetodo 
      : true;

    return coincideBusqueda && coincideMetodo;
  });

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <HStack spacing={4}>
            <GoBackButton />
            <VStack align="flex-start" spacing={0}>
              <HStack>
                <FaTruck size="24px" color="#4A5568" />
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  Registro de Envíos
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {total} envíos registrados
              </Text>
            </VStack>
          </HStack>
        </HStack>
        {/* Nuevos Filtros */}
        <HStack spacing={4} w="full">
          <Input
            placeholder="Buscar por estado, metodo de envio..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            bg="white"
            border="1px"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500" }}
            color="black" 
            _placeholder={{ color: "gray.500" }} 
          />
          <Select
            placeholder="Filtrar por método"
            value={filtroMetodo}
            onChange={(e) => setFiltroMetodo(e.target.value)}
            bg="white"
            border="1px"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500" }}
            color="black"
            sx={{
              '& option': {
                backgroundColor: 'white !important',
                color: 'gray.600'
              }
            }}
          >
            {metodosEnvios.map((metodo) => (
              <option key={metodo.id} value={String(metodo.id)}>
                {metodo.nombre}
              </option>
            ))}
          </Select>
        </HStack>
        <Box 
          p={6}
          bg="white"
          borderRadius="xl"
          boxShadow="lg"
          border="1px"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Table variant="simple">
            <Thead bg="blue.50">
              <Tr>
                <Th textAlign="center" color="blue.600">ID</Th>
                <Th textAlign="center" color="blue.600">Código</Th>
                <Th textAlign="center" color="blue.600">Dirección</Th>
                <Th textAlign="center" color="blue.600">Método de Envío</Th>
                <Th textAlign="center" color="blue.600">Estado</Th>
                <Th textAlign="center" color="blue.600">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtrados.length > 0 ? (
                filtrados.map((envio) => (
                  <Tr key={envio.id} _hover={{ bg: "gray.50" }} transition="background-color 0.2s">
                    <Td textAlign="center" color="gray.700">#{envio.id}</Td>
                    <Td textAlign="center" color="gray.700">{envio.codigoSeguimiento}</Td>
                    <Td textAlign="center" color="gray.700">{envio.direccion}</Td>
                    <Td textAlign="center" color="gray.700">{obtenerNombreMetodosEnvios(envio.empresa_id)}</Td>
                    <Td textAlign="center" color={envio.estado === "Entregado" ? "green.500" : "red.500"}>
                      {envio.estado}
                    </Td>
                    <Td textAlign="center">
                      <IconButton
                        aria-label="Eliminar envío"
                        icon={<FaTrash />}
                        size="sm"
                        color={"red.900"}
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ color: 'red.500' }}
                        onClick={() => confirmarEliminacion(envio)}
                      />
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan="6" textAlign="center" color="gray.500">
                    No hay envíos registrados.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
          <HStack spacing={2} justify="center" mt={4} color={"black"}>
            <Button
              colorScheme="blue"
              size="sm"
              onClick={() => setPaginaActual(paginaActual - 1)}
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
              onClick={() => setPaginaActual(paginaActual + 1)}
              isDisabled={paginaActual === totalPaginas}
            >
              Siguiente
            </Button>
          </HStack>
        </Box>
      </VStack>

      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="gray.800" pb={4}>
              Eliminar Envío
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              ¿Estás seguro de que deseas eliminar el envío con ID {" "}
              <Text as="span" fontWeight="bold" color="gray.800">
                #{envioAEliminar?.id}
              </Text>
              ? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button bg="red.500" color={"white"} onClick={handleEliminarEnvio} _hover={{ bg: 'red.800' }}>
                Eliminar
              </Button>
              <Button onClick={onClose} variant="outline" color="white" bg="gray.500" _hover={{ bg: "gray.800" }}>
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default RegistrarEnvios;
