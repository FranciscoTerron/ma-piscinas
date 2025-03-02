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
  Flex,
  Avatar,
  Divider,
  Icon,
} from "@chakra-ui/react";
import { FaUserEdit, FaLock } from "react-icons/fa";
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

    const fetchUsuario = async (pagina, tamanio) => {
      try {
        const usuarios = await listarUsuarios(pagina, tamanio);
        const userData = usuarios.usuarios.find((user) => Number(user.id) === Number(usuarioId));
        setUsuario(userData);
      } catch (error) {
        console.error("Error al obtener usuario", error);
      }
    };
    fetchUsuario();
  }, [usuarioId]);

  if (!usuario) return <Text textAlign="center" mt={10} fontSize="lg" fontWeight="bold">Cargando perfil...</Text>;

  return (
    <Box w="100%" mx="auto" p={6} borderRadius="lg" boxShadow="xl" bg="white" border="2px solid" borderColor="#00CED1">
      <VStack spacing={6} align="center">
        <Avatar name={usuario.nombre} size="xl" bg="#00CED1" />
        <Heading size="lg" color="teal.600">Perfil de {usuario.nombreUsuario}</Heading>
        <Divider borderColor="teal.300" />
        <Box textAlign="center" fontSize="md" color="gray.700">
          <Text fontWeight="bold">Nombre: <Text as="span" fontWeight="normal">{usuario.nombre}</Text></Text>
          <Text fontWeight="bold">Apellido: <Text as="span" fontWeight="normal">{usuario.apellido}</Text></Text>
          <Text fontWeight="bold">Email: <Text as="span" fontWeight="normal">{usuario.email}</Text></Text>
          <Text fontWeight="bold">Teléfono: <Text as="span" fontWeight="normal">{usuario.telefono || "No registrado"}</Text></Text>
        </Box>
        <Flex gap={4}>
          <Button leftIcon={<Icon as={FaUserEdit} />} colorScheme="teal" onClick={onOpenPersonal}>Editar Datos</Button>
          <Button leftIcon={<Icon as={FaLock} />} colorScheme="orange" onClick={onOpenContrasena}>Cambiar Contraseña</Button>
        </Flex>
      </VStack>

      {/* Modal para editar datos personales */}
      <Modal isOpen={isOpenPersonal} onClose={onClosePersonal} isCentered>
        <ModalOverlay />
        <ModalContent color="black" bg="white">
          <ModalHeader>Editar Datos Personales</ModalHeader>
          <ModalCloseButton color="black"/>
          <ModalBody>
            <FormularioPersonal usuarioId={usuarioId} user={usuario} onSuccess={onClosePersonal} />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal isOpen={isOpenContrasena} onClose={onCloseContrasena} isCentered>
        <ModalOverlay />
        <ModalContent color="black" bg="white">
          <ModalHeader>Cambiar Contraseña</ModalHeader>
          <ModalCloseButton color="black"/>
          <ModalBody>
            <FormularioContrasenia usuarioId={usuarioId} onSuccess={onCloseContrasena} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PerfilUsuario;
