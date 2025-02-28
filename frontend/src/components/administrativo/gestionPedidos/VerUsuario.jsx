import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  Avatar,
} from "@chakra-ui/react";


const VerUsuario = ({ usuario, isOpen, onClose }) => {
  if (!usuario) return null;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
      <ModalContent borderColor="teal.200" bg="white">
        <ModalHeader textAlign="center" bg="teal.100" color="teal.700">
          Información del Usuario
        </ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody>
          <Box textAlign="center" p={4}>
            <Avatar size="xl" name={usuario.nombre} src={usuario.avatar} mb={4} />
            <Text fontSize="lg" fontWeight="bold" color="gray.800">
              {usuario.nombre}
            </Text>
            <Text fontSize="md" color="gray.600">
              {usuario.email}
            </Text>
            <Text fontSize="md" color="gray.600">
              Teléfono: {usuario.telefono || "No disponible"}
            </Text>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default VerUsuario;