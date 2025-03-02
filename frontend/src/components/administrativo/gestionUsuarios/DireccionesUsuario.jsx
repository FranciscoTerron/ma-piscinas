import React, { useState, useEffect } from "react";
import { Box, Table, Thead, Tbody, Tr, Th, Td, useToast, Spinner, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalCloseButton, ModalBody,} from "@chakra-ui/react";
import { obtenerDireccionesEnvioUsuario } from "../../../services/api";

const DireccionesUsuario = ({ nombreUsuario, usuarioId, isOpen, onClose }) => {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  useEffect(() => {
    if (isOpen) {
      cargarDirecciones();
    }
  }, [isOpen]);

  const cargarDirecciones = async () => {
    setLoading(true);
    try {
      const data = await obtenerDireccionesEnvioUsuario(usuarioId);
      setDirecciones(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar las direcciones del usuario.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
      <ModalContent borderColor="blue.200" bg="white">
        <ModalHeader textAlign="center" bg="blue.100" color="blue.700">
          Direcciones del usuario {nombreUsuario}
        </ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody>
          {loading ? (
            <Spinner size="xl" />
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" color="black">
                <Thead>
                  <Tr>
                    <Th color="black">Provincia</Th>
                    <Th color="black" textAlign="center">Ciudad</Th>
                    <Th color="black" textAlign="center">Código Postal</Th>
                    <Th color="black" textAlign="center">Dirección</Th>
                  </Tr>
                </Thead>
                <Tbody>
                    {direcciones.length > 0 ? (
                        direcciones.map((direccion) => (
                            <Tr key={direccion.id}>
                            <Td textAlign="center">{direccion.provincia}</Td>
                            <Td textAlign="center">{direccion.ciudad}</Td>
                            <Td textAlign="center">{direccion.codigo_postal}</Td>
                            <Td textAlign="center">{direccion.direccion}</Td>
                            </Tr>
                        ))
                        ) : (
                        <Tr>
                            <Td colSpan="6" textAlign="center" color="gray.500">
                            No hay direcciones registradas.
                            </Td>
                        </Tr>
                    )}
                </Tbody>
              </Table>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DireccionesUsuario;
