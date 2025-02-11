import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Container,
  Text,
  HStack,
  VStack,
  Select,
} from "@chakra-ui/react";
import { FaTrash, FaUserCog } from 'react-icons/fa';
import { listarUsuarios, eliminarUsuario, listarRoles, actualizarRol } from "../../../services/api";
import { useAuth } from "../../../context/AuthContext";
import GoBackButton from '../../GoBackButton';

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { userRole } = useAuth();

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

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
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (error) {
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

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between">
          <HStack spacing={4}>
            <GoBackButton />
            <VStack align="flex-start" spacing={0}>
              <HStack>
                <FaUserCog size="24px" color="#4A5568"/>
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  Gestión de Usuarios
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {usuarios.length} usuarios registrados
              </Text>
            </VStack>
          </HStack>
        </HStack>

        {/* Table */}
        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th textAlign="center" color="gray.600">ID</Th>
                <Th textAlign="center" color="gray.600">Nombre</Th>
                <Th textAlign="center" color="gray.600">Email</Th>
                <Th textAlign="center" color="gray.600">Teléfono</Th>
                <Th textAlign="center" color="gray.600">Dirección</Th>
                <Th textAlign="center" color="gray.600">Rol</Th>
                <Th textAlign="center" color="gray.600">Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {usuarios.map((usuario) => (
                <Tr 
                  key={usuario.id}
                  _hover={{ bg: 'gray.50' }}
                  transition="background-color 0.2s"
                >
                  <Td textAlign="center" color="gray.700">{usuario.id}</Td>
                  <Td textAlign="center" color="gray.700" fontWeight="medium">
                    {usuario.nombre}
                  </Td>
                  <Td textAlign="center" color="gray.600">{usuario.email}</Td>
                  <Td textAlign="center" color="gray.600">{usuario.telefono}</Td>
                  <Td textAlign="center" color="gray.600">{usuario.direccion}</Td>
                  <Td textAlign="center" color="gray.600">
                    {userRole === "administrador" ? (
                      <Select
                        value={usuario.rol_id}
                        onChange={(e) => handleCambiarRol(usuario.id, e.target.value)}
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
                    <IconButton
                      aria-label="Eliminar usuario"
                      icon={<FaTrash />}
                      size="sm"
                      color={"red.900"}
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
        </Box>
      </VStack>

      {/* Alert Dialog */}
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
                bg= 'red.500'
                onClick={handleEliminarUsuario}
                _hover={{ bg: 'red.800' }}
              >
                Eliminar
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                bg= 'gray.500'
                _hover={{ bg: 'gray.800' }}
              >
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default GestionUsuarios;