import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  useToast,
} from "@chakra-ui/react";
import { crearMetodoPago, actualizarMetodoPago } from "../../../services/api";

const initialMetodoState = {
  nombre: "",
  tipo: "",
};

const FormularioMetodoPago = ({ isOpen, onClose, onSubmitSuccess, metodo }) => {
  const [formData, setFormData] = useState(initialMetodoState);
  const toast = useToast();

  useEffect(() => {
    if (metodo) {
      setFormData({
        nombre: metodo.nombre,
        tipo: metodo.tipo || "",
      });
    } else {
      setFormData(initialMetodoState);
    }
  }, [metodo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.tipo) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      if (metodo) {
        await actualizarMetodoPago(metodo.id, formData);
        toast({
          title: "Éxito",
          description: "Método de pago actualizado correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await crearMetodoPago(formData);
        toast({
          title: "Éxito",
          description: "Método de pago creado correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onSubmitSuccess();
      onClose();
      setFormData(initialMetodoState);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo realizar la operación.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {metodo ? "Editar Método de Pago" : "Agregar Método de Pago"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del método de pago"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Tipo</FormLabel>
              <Select name="tipo" value={formData.tipo} onChange={handleInputChange}>
                <option value="">Seleccione un tipo</option>
                <option value="EFECTIVO">EFECTIVO</option>
                <option value="CRÉDITO">CREDITO</option>
                <option value="DÉBITO">DEBITO</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {metodo ? "Actualizar" : "Agregar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormularioMetodoPago;
