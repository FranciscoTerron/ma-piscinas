import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { agregarMetodoPago, actualizarMetodoPago } from "../../../services/api";

const FormularioMetodoPago = ({ isOpen, onClose, onSubmitSuccess, metodo }) => {
  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (metodo) {
      setNombre(metodo.nombre || "");
      setTipo(metodo.tipo || "");
    } else {
      setNombre("");
      setTipo("");
    }
  }, [metodo]);

  const handleSubmit = async () => {
    if (!nombre || !tipo) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (metodo) {
        await actualizarMetodoPago(metodo.id, { nombre, tipo });
        toast({
          title: "Método de pago actualizado",
          description: "Se ha actualizado correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await agregarMetodoPago({ nombre, tipo });
        toast({
          title: "Método de pago agregado",
          description: "Se ha registrado correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onSubmitSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema con la operación.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader borderBottom="1px" borderColor="gray.900" color="black">
          {metodo ? "Editar Método de Pago" : "Agregar Método de Pago"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody py={6} color="black">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del método de pago"
                bg="white"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Tipo</FormLabel>
              <Select
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                bg="white"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
              >
                <option value="">Seleccione un tipo</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="CRÉDITO">Crédito</option>
                <option value="DÉBITO">Débito</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter borderTop="1px" borderColor="gray.100" bg="gray.50">
          <Button variant="outline" mr={3} onClick={onClose} isDisabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            loadingText={metodo ? "Actualizando..." : "Agregando..."}
          >
            {metodo ? "Actualizar" : "Agregar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormularioMetodoPago;
