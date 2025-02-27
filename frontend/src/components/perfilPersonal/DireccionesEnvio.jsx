import React, { useState, useEffect } from "react";
import { Box, VStack, Text, Heading, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader,
  ModalBody, ModalCloseButton, Flex, Divider, IconButton, Icon, Spinner, Alert, AlertIcon,} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { crearDireccionEnvio, obtenerDireccionesEnvioUsuario, actualizarDireccionEnvio, eliminarDireccionEnvio,} from "../../services/api";
import FormularioDireccion from "./FormularioDireccion";
import { useAuth } from "../../context/AuthContext";

const DireccionesEnvio = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [direccionEditando, setDireccionEditando] = useState(null);
  const {
    isOpen: isOpenForm,
    onOpen: onOpenForm,
    onClose: onCloseForm,
  } = useDisclosure();
  const { userId } = useAuth();

  // Obtener direcciones del usuario
  useEffect(() => {
    const fetchDirecciones = async () => {
      try {
        const data = await obtenerDireccionesEnvioUsuario(userId);
        setDirecciones(data);
        setIsLoading(false);
      } catch (error) {
        setError("Error al cargar las direcciones de envío.");
        setIsLoading(false);
      }
    };
    fetchDirecciones();
  }, [userId]);

  // Crear o actualizar una dirección
  const handleGuardarDireccion = async (direccionData) => {
    try {
      if (direccionEditando) {
        // Actualizar dirección
        const data = await actualizarDireccionEnvio(direccionEditando.id, direccionData);
        setDirecciones(
          direcciones.map((dir) => (dir.id === direccionEditando.id ? data : dir))
        );
      } else {
        // Crear dirección
        const data = await crearDireccionEnvio({ ...direccionData, usuario_id: userId });
        setDirecciones([...direcciones, data]);
      }
      onCloseForm();
      setDireccionEditando(null);
    } catch (error) {
      setError("Error al guardar la dirección.");
    }
  };

  // Eliminar una dirección
  const handleEliminarDireccion = async (direccionId) => {
    try {
      await eliminarDireccionEnvio(direccionId);
      setDirecciones(direcciones.filter((dir) => dir.id !== direccionId));
    } catch (error) {
      setError("Error al eliminar la dirección.");
    }
  };

  // Abrir modal para editar una dirección
  const handleEditarDireccion = (direccion) => {
    setDireccionEditando(direccion);
    onOpenForm();
  };

  return (
    <Box w="100%" p={6} borderRadius="lg" boxShadow="xl" bg="white" border="2px solid" borderColor="#00CED1">
      <VStack spacing={6} align="start">
        <Heading size="lg" color="teal.600">Direcciones de Envío</Heading>
        <Divider borderColor="teal.300" />

        {isLoading ? (
          <Spinner size="lg" color="teal.500" />
        ) : error ? (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        ) : direcciones.length === 0 ? (
          <Text color="gray.600">No hay direcciones registradas.</Text>
        ) : (
          direcciones.map((direccion) => (
            <Box key={direccion.id} w="100%" p={4} borderWidth="1px" borderRadius="lg">
              <Flex justify="space-between" align="center">
                <Box>
                  <Text fontWeight="bold">
                    Ciudad: <Text as="span" fontWeight="normal">{direccion.ciudad}</Text>,  
                    Código Postal: <Text as="span" fontWeight="normal">{direccion.codigo_postal}</Text>,  
                    Provincia: <Text as="span" fontWeight="normal">{direccion.provincia}</Text>
                  </Text>
                </Box>
                <Flex gap={2}>
                  <IconButton
                    icon={<Icon as={FaEdit} />}
                    colorScheme="teal"
                    aria-label="Editar"
                    onClick={() => handleEditarDireccion(direccion)}
                  />
                  <IconButton
                    icon={<Icon as={FaTrash} />}
                    colorScheme="red"
                    aria-label="Eliminar"
                    onClick={() => handleEliminarDireccion(direccion.id)}
                  />
                </Flex>
              </Flex>
            </Box>
          ))
        )}

        <Button
          leftIcon={<Icon as={FaPlus} />}
          colorScheme="teal"
          onClick={() => {
            setDireccionEditando(null);
            onOpenForm();
          }}
        >
          Agregar Dirección
        </Button>
      </VStack>

      {/* Modal para crear/editar dirección */}
      <Modal isOpen={isOpenForm} onClose={onCloseForm} isCentered>
        <ModalOverlay />
        <ModalContent color="black" bg="white">
          <ModalHeader>{direccionEditando ? "Editar Dirección" : "Agregar Dirección"}</ModalHeader>
          <ModalCloseButton color="black" />
          <ModalBody>
            <FormularioDireccion
              direccion={direccionEditando}
              onGuardar={handleGuardarDireccion}
              onCancelar={onCloseForm}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DireccionesEnvio;