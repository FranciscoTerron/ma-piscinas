import React, { useState, useEffect } from "react";
import { Box, VStack, Text, Heading, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalCloseButton, Flex, Divider, IconButton, Icon, Spinner, Alert, AlertIcon, AlertDialog, AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, useToast,} from "@chakra-ui/react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { crearDireccionEnvio, obtenerDireccionesEnvioUsuario, actualizarDireccionEnvio, eliminarDireccionEnvio,} from "../../services/api";
import FormularioDireccion from "./FormularioDireccion";
import { useAuth } from "../../context/AuthContext";

const DireccionesEnvio = () => {
  const [direcciones, setDirecciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [direccionEditando, setDireccionEditando] = useState(null);
  const [direccionAEliminar, setDireccionAEliminar] = useState(null);
  const { userId } = useAuth();
  const toast = useToast();

  // Disclosures
  const {
    isOpen: isOpenForm,
    onOpen: onOpenForm,
    onClose: onCloseForm,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();

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

  // Confirmar eliminación
  const handleConfirmarEliminar = async () => {
    try {
      await eliminarDireccionEnvio(direccionAEliminar.id);
      setDirecciones(direcciones.filter((dir) => dir.id !== direccionAEliminar.id));
      toast({
        title: "Dirección eliminada",
        description: "La dirección ha sido eliminada correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la dirección.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onCloseDelete();
      setDireccionAEliminar(null);
    }
  };

  // Guardar dirección (crear o actualizar)
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

  // Editar dirección
  const handleEditarDireccion = (direccion) => {
    setDireccionEditando(direccion);
    onOpenForm();
  };

  return (
    <Box
      w="100%"
      p={6}
      borderRadius="lg"
      boxShadow="xl"
      bg="white"
      border="2px solid"
      borderColor="#00CED1"
    >
      <VStack spacing={6} align="start">
        <Heading size="lg" color="teal.600">
          Direcciones de Envío
        </Heading>
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
              <Flex align="center" justify="space-between">
                {/* Información de la dirección */}
                <Flex align="center" flex="1" wrap="wrap" gap={4}>
                  <Flex align="center">
                    <Text fontWeight="bold" mr={1}>Provincia:</Text>
                    <Text maxW="120px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {direccion.provincia}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text fontWeight="bold" mr={1}>Ciudad:</Text>
                    <Text maxW="120px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {direccion.ciudad}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text fontWeight="bold" mr={1}>Código Postal:</Text>
                    <Text maxW="80px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {direccion.codigo_postal}
                    </Text>
                  </Flex>

                  <Flex align="center">
                    <Text fontWeight="bold" mr={1}>Dirección:</Text>
                    <Text maxW="200px" whiteSpace="nowrap" overflow="hidden" textOverflow="ellipsis">
                      {direccion.direccion}
                    </Text>
                  </Flex>
                </Flex>

                {/* Botones de acción fijos a la derecha */}
                <Flex gap={2} flexShrink={0}>
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
                    onClick={() => {
                      setDireccionAEliminar(direccion);
                      onOpenDelete();
                    }}
                  />
                </Flex>
              </Flex>
            </Box>

          ))
        )}

        {/* Modal de eliminación */}
        <AlertDialog isOpen={isOpenDelete} onClose={onCloseDelete}>
          <AlertDialogOverlay>
            <AlertDialogContent bg="white">
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Eliminar Dirección
              </AlertDialogHeader>
              <AlertDialogBody>
                ¿Estás seguro de eliminar la dirección en{" "}
                <Text as="span" fontWeight="semibold">
                  {direccionAEliminar?.provincia}, {direccionAEliminar?.ciudad}
                </Text>
                ? Esta acción no se puede deshacer.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button onClick={onCloseDelete}>Cancelar</Button>
                <Button colorScheme="red" onClick={handleConfirmarEliminar} ml={3}>
                  Eliminar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Button leftIcon={<Icon as={FaPlus} />} colorScheme="teal" onClick={onOpenForm}>
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
