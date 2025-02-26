import React, { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, useToast, Container, Text, HStack, VStack, useDisclosure, Button, Input, Select } from "@chakra-ui/react";
import { RxActivityLog } from "react-icons/rx";
import { FaUser } from "react-icons/fa";
import { listarActividadesRecientes, obtenerUsuarioPorId } from '../../../services/api';
import GoBackButton from '../../GoBackButton';
import VerUsuario from "../../administrativo/gestionPedidos/VerUsuario";

const diccionarioTipoEvento = {
  CREACION_PRODUCTO: "Producto creado",
  CREACION_USUARIO: "Usuario registrado",
  CREACION_PEDIDO: "Pedido creado",
  CREACION_PAGO: "Pago registrado",
  CREACION_ENVIO: "Envío creado",
};

const ListaActividades = () => {
  const [actividades, setActividades] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const { isOpen: isUsuarioOpen, onOpen: onUsuarioOpen, onClose: onUsuarioClose } = useDisclosure();
  const toast = useToast();
  const [filtroTipoEvento, setFiltroTipoEvento] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalActividades, setTotalActividades] = useState(0);
  const actividadesPorPagina = 10;
  const totalPaginas = Math.ceil(totalActividades / actividadesPorPagina);

  useEffect(() => {
    cargarActividades(paginaActual, actividadesPorPagina);
  }, [paginaActual, filtroTipoEvento, filtroFecha, busqueda]);

  const cargarActividades = async (pagina, tamanio) => {
    try {
      const data = await listarActividadesRecientes(pagina, tamanio);
      setActividades(data.actividades);
      setTotalActividades(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de actividades.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleVerUsuario = async (usuarioId) => {
    const usuario = await obtenerUsuarioPorId(usuarioId);
    setUsuarioSeleccionado(usuario);
    onUsuarioOpen();
  };

  const actividadesFiltradas = actividades.filter((actividad) => {
    const coincideBusqueda =
      actividad.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideTipoEvento = filtroTipoEvento ? actividad.tipo_evento === filtroTipoEvento : true;

    const coincideFecha = filtroFecha ? new Date(actividad.fecha).toLocaleDateString() === new Date(filtroFecha).toLocaleDateString() : true;

    return coincideBusqueda && coincideTipoEvento && coincideFecha;
  });

  return (
    <Container maxW="container.xl" py={8} color="black">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={4}>
            <GoBackButton />
            <VStack align="flex-start" spacing={0}>
              <HStack>
                <RxActivityLog size="24px" color="#4A5568"/>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  Historial de actividades
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {totalActividades} actividades registradas
              </Text>
            </VStack>
          </HStack>
        </HStack>
        {/* Filtros y Búsqueda */}
        <HStack spacing={4} w="full">
          <Input
            placeholder="Buscar por descripción..."
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
            placeholder="Filtrar por tipo de evento"
            value={filtroTipoEvento}
            onChange={(e) => setFiltroTipoEvento(e.target.value)}
            bg="white"
            border="1px"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500" }}
            color="black" 
            _placeholder={{ color: "gray.500" }}
          >
            <option value="CREACION_PRODUCTO">Productos</option>
            <option value="CREACION_USUARIO">Usuarios</option>
            <option value="CREACION_PEDIDO">Pedidos</option>
            <option value="CREACION_PAGO">Pagos</option>
            <option value="CREACION_ENVIO">Envios</option>
          </Select>
          <Input
            type="date"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            bg="white"
            border="1px"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500" }}
            color="black" 
            _placeholder={{ color: "gray.500" }} 
          />
        </HStack>
        {/* Tabla de Actividades */}
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
                <Th textAlign="center" color="blue.600">Tipo de evento</Th>
                <Th textAlign="center" color="blue.600">Descripción</Th>
                <Th textAlign="center" color="blue.600">Fecha</Th>
                <Th textAlign="center" color="blue.600">Usuario</Th>
              </Tr>
            </Thead>
            <Tbody>
              {actividadesFiltradas.map((actividad) => (
                <Tr 
                  key={actividad.id}
                  _hover={{ bg: 'gray.50' }}
                  transition="background-color 0.2s"
                >
                  <Td textAlign="center" color="gray.700" fontWeight="medium">
                    {diccionarioTipoEvento[actividad.tipo_evento] || actividad.tipo_evento}
                  </Td>
                  <Td textAlign="center" color="gray.600">{actividad.descripcion}</Td>
                  <Td textAlign="center" color="gray.600">
                    {new Date(actividad.fecha).toLocaleString('es-ES', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    })}
                  </Td>
                  <Td textAlign="center" color="gray.600">
                    <Button
                        leftIcon={<FaUser />}
                        size="sm"
                        colorScheme="teal"
                        variant="outline"
                        ml={2}
                        onClick={() => handleVerUsuario(actividad.usuario_id || actividad.usuario?.id)}                  >
                        Ver Usuario
                        </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          {/* Paginación */}
          <HStack spacing={2} justify="center" mt={4} color="black">
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
              isDisabled={paginaActual >= totalPaginas}
            >
              Siguiente
            </Button>
          </HStack>
        </Box>
        {usuarioSeleccionado && (
            <VerUsuario usuario={usuarioSeleccionado} isOpen={isUsuarioOpen} onClose={onUsuarioClose} />
        )}
      </VStack>
    </Container>
  );
};

export default ListaActividades;