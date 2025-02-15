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
  Image,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { agregarMetodoEnvio, actualizarMetodoEnvio } from "../../../../services/api";

const initialEmpresaState = {
  nombre: "",
  direccion: "",
  telefono: "",
  imagen: "",
};

const FormularioMetodoEnvio = ({ isOpen, onClose, onSubmitSuccess, empresa }) => {
  const [formData, setFormData] = useState(initialEmpresaState);
  const [imagenPreview, setImagenPreview] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (empresa) {
      setFormData({
        nombre: empresa.nombre || "",
        direccion: empresa.direccion || "",
        telefono: empresa.telefono || "",
        imagen: "", 
      });

      if (empresa.imagen && typeof empresa.imagen === "string" && empresa.imagen.startsWith("http")) {
        setImagenPreview(empresa.imagen);
      } else {
        setImagenPreview(null);
      }
    } else {
      setFormData(initialEmpresaState);
      setImagenPreview(null);
    }
  }, [empresa]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = async () => {
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la empresa es obligatorio.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("direccion", formData.direccion);
    formDataToSend.append("telefono", formData.telefono);

    if (empresa) {
      if (formData.imagen && formData.imagen instanceof File) {
        formDataToSend.append("imagen", formData.imagen);
      }
    } else {
      if (!formData.imagen || !(formData.imagen instanceof File)) {
        toast({
          title: "Error",
          description: "Debe seleccionar un archivo de imagen válido.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      formDataToSend.append("imagen", formData.imagen);
    }

    try {
      if (empresa) {
        await actualizarMetodoEnvio(empresa.id, formDataToSend);
        toast({
          title: "Éxito",
          description: "Empresa actualizada correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await agregarMetodoEnvio(formDataToSend);
        toast({
          title: "Éxito",
          description: "Empresa agregada correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      onSubmitSuccess();
      onClose();
      setFormData(initialEmpresaState);
      setImagenPreview(null);
    } catch (error) {
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
        <ModalHeader borderBottom="1px" borderColor="gray.900" color="black">
          {empresa ? "Editar Empresa" : "Agregar Empresa"}
        </ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody py={6} color="black">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Nombre de la empresa" />
            </FormControl>
            <FormControl>
              <FormLabel>Dirección</FormLabel>
              <Input name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Dirección de la empresa" />
            </FormControl>
            <FormControl>
              <FormLabel>Teléfono</FormLabel>
              <Input name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Teléfono de contacto" />
            </FormControl>
            <FormControl>
              <FormLabel>Imagen</FormLabel>
              <Box borderWidth={2} borderRadius="md" borderStyle="dashed" borderColor="gray.300" p={4} textAlign="center" cursor="pointer" onClick={() => document.getElementById("imagen-input").click()} _hover={{ bg: "gray.50" }}>
                <Input id="imagen-input" type="file" accept="image/*" onChange={handleImagenChange} display="none" />
                {imagenPreview ? <Image src={imagenPreview} alt="Preview" maxH="200px" mx="auto" borderRadius="md" /> : <VStack spacing={2}><Icon as={FaCloudUploadAlt} w={10} h={10} color="gray.400" /><Text color="gray.500">Click para seleccionar una imagen</Text></VStack>}
              </Box>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter borderTop="1px" borderColor="gray.100" bg="gray.50">
          <Button variant="outline" mr={3} onClick={onClose}>Cancelar</Button>
          <Button colorScheme="blue" onClick={handleSubmit}>{empresa ? "Actualizar" : "Agregar"}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormularioMetodoEnvio;
