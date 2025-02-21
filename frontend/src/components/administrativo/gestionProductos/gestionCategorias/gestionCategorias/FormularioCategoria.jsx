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
  Box,
  VStack,
  Icon,
  Image,
  Skeleton,

} from "@chakra-ui/react";
import { crearCategoria, actualizarCategoria } from "../../../../../services/api";
import { FaCloudUploadAlt } from "react-icons/fa";
import { Text } from "@chakra-ui/react";


const initialCategoriaState = {
  nombre: "",
  descripcion: "",
  imagen: "",

};

const FormularioCategoria = ({ isOpen, onClose, onSubmitSuccess, categoria }) => {
  const [formData, setFormData] = useState(initialCategoriaState);
  const toast = useToast();
  const [imagenPreview, setImagenPreview] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        imagen: "",
      });
      if (categoria.imagen && typeof categoria.imagen === "string" && categoria.imagen.startsWith("http")) {
        setImagenPreview(categoria.imagen);
      } else {
        setImagenPreview(null);
      }
    } else {
      setFormData(initialCategoriaState);
      setImagenPreview(null);
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
    if (!formData.nombre) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es obligatorio.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
    setIsSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("descripcion", formData.descripcion || ""); // Asegurar que no sea null
  
    if (formData.imagen && formData.imagen instanceof File) {
      formDataToSend.append("imagen", formData.imagen);
    }
  
    try {
      if (categoria) {
        await actualizarCategoria(categoria.id, formDataToSend);
        toast({
          title: "Éxito",
          description: "Categoría actualizada correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await crearCategoria(formDataToSend);
        toast({
          title: "Éxito",
          description: "Categoría agregada correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
      onSubmitSuccess();
      onClose();
      setFormData(initialCategoriaState);
      setImagenPreview(null);
    } catch (error) {
      console.error("Error al enviar la categoría:", error);
      toast({
        title: "Error",
        description: "No se pudo realizar la operación.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match("image.*")) {
        toast({
          title: "Error",
          description: "Seleccione un archivo de imagen válido (jpg, png, etc).",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          imagen: file,
        }));
      };
      reader.readAsDataURL(file);
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
          <FormControl>
          <FormLabel>Imagen</FormLabel>
          <Box
            borderWidth={2}
            borderRadius="md"
            borderStyle="dashed"
            borderColor="gray.300"
            p={4}
            textAlign="center"
            cursor="pointer"
            onClick={() => document.getElementById("imagen-input").click()}
            _hover={{ bg: "gray.50" }}
          >
            <Input
              id="imagen-input"
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              display="none"
            />
            {imagenPreview ? (
              <Image
                src={imagenPreview}
                alt="Preview"
                maxH="200px"
                mx="auto"
                borderRadius="md"
              />
            ) : (
              <VStack spacing={2}>
                <Icon as={FaCloudUploadAlt} w={10} h={10} color="gray.400" />
                <Text color="gray.500">Click para seleccionar una imagen</Text>
              </VStack>
           )}
          </Box>
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
