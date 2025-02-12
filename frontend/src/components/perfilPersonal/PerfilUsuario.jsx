import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  Heading,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { listarUsuarios } from "../../services/api";
import FormularioPersonal from "./FormularioPersonal";
import FormularioContrasenia from "./FormularioContrasenia";
import { useAuth } from "../../context/AuthContext";

const PerfilUsuario = () => {
  const [usuario, setUsuario] = useState(null);
  const {
    isOpen: isOpenPersonal,
    onOpen: onOpenPersonal,
    onClose: onClosePersonal,
  } = useDisclosure();
  const {
    isOpen: isOpenContrasena,
    onOpen: onOpenContrasena,
    onClose: onCloseContrasena,
  } = useDisclosure();
  const { userId } = useAuth();
  const usuarioId = userId;
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const usuarios = await listarUsuarios();
        const userData = usuarios.find((user) => Number(user.id) === Number(usuarioId));

        setUsuario(userData);
      } catch (error) {
        console.error("Error al obtener usuario", error);
      }
    };
    fetchUsuario();
  }, [usuarioId]);

  if (!usuario) return <Text>Cargando perfil...</Text>;

  return (
    <Box maxW="container.md" mx="auto" p={8}>
      <VStack spacing={6} align="stretch">
        <Box color={"black"} bg="white" p={8} borderRadius={10} boxShadow="xl" border="2px solid" borderColor="#00CED1">
          <Heading size="lg">Perfil de Usuario</Heading>
          <Text>Nombre: {usuario.nombre}</Text>
          <Text>Email: {usuario.email}</Text>
          <Text>Teléfono: {usuario.telefono || "No registrado"}</Text>
          <Text>Dirección: {usuario.direccion || "No registrada"}</Text>
          <Button colorScheme="blue" mt={4} mr={3} onClick={onOpenPersonal}>Editar Datos</Button>
          <Button colorScheme="green" mt={4} onClick={onOpenContrasena}>Cambiar Contraseña</Button>
        </Box>
      </VStack>

      {/* Modal para editar datos personales */}
      <Modal isOpen={isOpenPersonal} onClose={onClosePersonal} >
        <ModalOverlay />
        <ModalContent color={"black"} bg="white">
          <ModalHeader>Editar Datos Personales</ModalHeader>
          <ModalCloseButton color={"black"}/>
          <ModalBody>
            <FormularioPersonal usuarioId={usuarioId} user={usuario} onSuccess={onClosePersonal} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal isOpen={isOpenContrasena} onClose={onCloseContrasena}>
        <ModalOverlay />
        <ModalContent color={"black"} bg="white">
          <ModalHeader>Cambiar Contraseña</ModalHeader>
          <ModalCloseButton color={"black"}/>
          <ModalBody>
            <FormularioContrasenia usuarioId={usuarioId} onSuccess={onCloseContrasena} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PerfilUsuario;
