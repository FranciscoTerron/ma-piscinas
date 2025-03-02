import React, { useEffect, useState } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, useDisclosure, AlertDialog, AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast, Container, Text, HStack,
  VStack, Select, Input,} from "@chakra-ui/react";
import { FaTrash, FaUserCog } from 'react-icons/fa';
import { FiMapPin } from 'react-icons/fi';
import { listarUsuarios, eliminarUsuario, listarRoles, actualizarRol } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import GoBackButton from '../../GoBackButton';
import DireccionesUsuario from "./DireccionesUsuario";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { userRole } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState(""); 
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 10;
  const totalPaginas = Math.ceil(totalUsuarios / usuariosPorPagina);
  const { isOpen: isDetallesOpen, onOpen: onDetallesOpen, onClose: onDetallesClose } = useDisclosure();
  const [usuarioSeleccionado, setUsuarioeleccionado] = useState(null);
  const [usuarioNombreSeleccionado, setNombreUsuario] = useState(null);

  const handleVerDetalles = (nombreUsuario, usuarioId) => {
    setNombreUsuario(nombreUsuario);
    setUsuarioeleccionado(usuarioId);
    onDetallesOpen();
  };

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, [paginaActual]);
  

  const cargarRoles = async () => {
    try {
      const data = await listarRoles();
      setRoles(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de roles.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cargarUsuarios = async () => {
    try {  
      const data = await listarUsuarios(paginaActual, usuariosPorPagina);    
      setUsuarios(data.usuarios);
      setTotalUsuarios(data.total);
    } catch (error) {
      console.error("❌ Error cargando usuarios:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de usuarios.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  
  const handleEliminarUsuario = async () => {
    try {
      await eliminarUsuario(usuarioAEliminar.id);
      toast({
        title: "Usuario eliminado",
        description: "El usuario ha sido eliminado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      cargarUsuarios();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el usuario.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const handleSiguientePagina = () => {
    setPaginaActual(prev => prev + 1);
  };

  const confirmarEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    onOpen();
  };

  const handleCambiarRol = async (usuarioId, nuevoRolId) => {
    if (userRole !== "administrador") {
      toast({
        title: "Error",
        description: "Solo los administradores pueden cambiar roles.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await actualizarRol(usuarioId, nuevoRolId);
      toast({
        title: "Rol actualizado",
        description: "El rol del usuario ha sido actualizado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      cargarUsuarios();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const obtenerNombreRol = (rolId) => {
    const rol = roles.find((r) => r.id === rolId);
    return rol ? rol.nombre : "Desconocido";
  };

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.email.toLowerCase().includes(busqueda.toLowerCase());
    
    const rolUsuario = String(usuario.rol_id);
    const coincideRol = filtroRol ? rolUsuario === filtroRol : true;
  
    return coincideBusqueda && coincideRol;
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
                <FaUserCog size="24px" color="#4A5568"/>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  Gestión de Usuarios
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {totalUsuarios} usuarios registrados
              </Text>
            </VStack>
          </HStack>
        </HStack>
        <HStack spacing={4} w="full">
          <Input
            placeholder="Buscar por nombre o email..."
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
            placeholder="Filtrar por rol"
            value={String(filtroRol)}
            onChange={(e) => setFiltroRol(e.target.value)}
            bg="white"
            border="1px"
            borderColor="gray.300"
            _focus={{ borderColor: "blue.500" }}
            color="black" 
            _placeholder={{ color: "gray.500" }}
            sx={{
              '& option': {
                backgroundColor: 'white !important',
                color: 'gray.600'
              }
            }}
          >
            {roles.map((rol) => (
              <option key={rol.id} value={String(rol.id)}>
                {rol.nombre}
              </option>
            ))}
          </Select>
        </HStack>
        {/* Tabla de Usuarios */}
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
                <Th textAlign="center" color="blue.600">Nombre</Th>
                <Th textAlign="center" color="blue.600">Apellido</Th>
                <Th textAlign="center" color="blue.600">Email</Th>
                <Th textAlign="center" color="blue.600">Teléfono</Th>
                <Th textAlign="center" color="blue.600">Rol</Th>
                <Th textAlign="center" color="blue.600">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {usuariosFiltrados.map((usuario) => (
                <Tr 
                  key={usuario.id}
                  _hover={{ bg: 'gray.50' }}
                  transition="background-color 0.2s"
                >
                  <Td textAlign="center" color="gray.700">{usuario.id}</Td>
                  <Td textAlign="center" color="gray.700" fontWeight="medium">{usuario.nombre}</Td>
                  <Td textAlign="center" color="gray.700" fontWeight="medium">{usuario.apellido}</Td>
                  <Td textAlign="center" color="gray.600">{usuario.email}</Td>
                  <Td textAlign="center" color="gray.600">{usuario.telefono}</Td>
                  <Td textAlign="center" color="gray.600">
                    {userRole === "administrador" ? (
                      <Select
                        value={usuario.rol_id} 
                        onChange={(e) => handleCambiarRol(usuario.id, parseInt(e.target.value))} 
                        sx={{
                          '& option': {
                            backgroundColor: 'white !important',
                            color: 'gray.600'
                          }
                        }}
                      >
                        {roles.map((rol) => (
                          <option key={rol.id} value={rol.id}>
                            {rol.nombre}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      obtenerNombreRol(usuario.rol_id)
                    )}
                  </Td>
                  <Td textAlign="center">
                    <Button leftIcon={<FiMapPin />} size="sm" colorScheme="blue" variant="outline" onClick={() => handleVerDetalles(usuario.nombreUsuario ,usuario.id)}>
                      Ver Direcciones
                    </Button>
                    <IconButton
                      ml={6}
                      aria-label="Eliminar usuario"
                      icon={<FaTrash />}
                      size="sm"
                      color="red.900"
                      colorScheme="red"
                      variant="ghost"
                      _hover={{ color: 'red.500' }}
                      onClick={() => confirmarEliminacion(usuario)}
                      isDisabled={userRole !== "administrador"}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
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
              onClick={handleSiguientePagina}
              isDisabled={paginaActual >= totalPaginas}
            >
              Siguiente
            </Button>
          </HStack>
        </Box>
      </VStack>

      {/* Alert Dialog para eliminar usuario */}
      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader 
              fontSize="lg" 
              fontWeight="bold" 
              color="gray.800"
              pb={4}
            >
              Eliminar Usuario
            </AlertDialogHeader>
            <AlertDialogBody color="gray.600">
              ¿Estás seguro de que deseas eliminar al usuario{" "}
              <Text as="span" fontWeight="bold" color="gray.800">
                {usuarioAEliminar?.nombre}
              </Text>
              ? Esta acción no se puede deshacer.
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button
                bg="red.500"
                onClick={handleEliminarUsuario}
                _hover={{ bg: 'red.800' }}
              >
                Eliminar
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                bg="gray.500"
                _hover={{ bg: 'gray.800' }}
              >
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {usuarioSeleccionado && (
        <DireccionesUsuario nombreUsuario={usuarioNombreSeleccionado} usuarioId={usuarioSeleccionado} isOpen={isDetallesOpen} onClose={onDetallesClose} />
      )}
    </Container>
  );
};

export default GestionUsuarios;
