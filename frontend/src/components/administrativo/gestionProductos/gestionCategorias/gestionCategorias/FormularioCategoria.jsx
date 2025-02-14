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
  Button,
  useToast,
} from "@chakra-ui/react";
import { crearCategoria, actualizarCategoria } from "../../../../../services/api";

const initialCategoriaState = {
  nombre: "",
  descripcion: "",
};

const FormularioCategoria = ({ isOpen, onClose, onSubmitSuccess, categoria }) => {
  const [formData, setFormData] = useState(initialCategoriaState);
  const toast = useToast();

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
      });
    } else {
      setFormData(initialCategoriaState);
    }
  }, [categoria]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (categoria) {
        await actualizarCategoria(categoria.id, formData);
        toast({
          title: "Éxito",
          description: "Categoría actualizada correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await crearCategoria(formData);
        toast({
          title: "Éxito",
          description: "Categoría agregada correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      onSubmitSuccess();
      onClose();
      setFormData(initialCategoriaState);
    } catch (error) {
      console.error("Error al enviar la categoría:", error);
      toast({
        title: "Error",
        description: "No se pudo realizar la operación.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader borderBottom="1px" borderColor="gray.900" color={"black"}>
          {categoria ? "Editar Categoría" : "Agregar Nueva Categoría"}
        </ModalHeader>
        <ModalCloseButton color={"black"}/>
        <ModalBody bg="white" py={6} color={"black"}>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre de la categoría"
              bg="white"
              border="1px"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300" }}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Descripción</FormLabel>
            <Input
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              placeholder="Descripción de la categoría"
              bg="white"
              border="1px"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300" }}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter borderTop="1px" borderColor="gray.100" bg="gray.50">
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {categoria ? "Actualizar" : "Agregar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormularioCategoria;
