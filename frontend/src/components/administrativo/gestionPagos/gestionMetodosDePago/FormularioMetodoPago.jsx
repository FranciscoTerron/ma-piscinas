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
  Box,
  Image,
  Icon,
  Text,
} from "@chakra-ui/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { agregarMetodoPago, actualizarMetodoPago } from "../../../../services/api";

const initialFormData = {
  nombre: "",
  tipo: "",
  imagen: "",
};

const FormularioMetodoPago = ({ isOpen, onClose, onSubmitSuccess, metodo }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (metodo) {
      setFormData({
        nombre: metodo.nombre || "",
        tipo: metodo.tipo || "",
        imagen: "", // Inicia como vacío
      });

      if (metodo.imagen && typeof metodo.imagen === "string" && metodo.imagen.startsWith("http")) {
        setImagenPreview(metodo.imagen);
      } else {
        setImagenPreview(null);
      }
    } else {
      setFormData(initialFormData);
      setImagenPreview(null);
    }
  }, [metodo]);

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

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("tipo", formData.tipo.toUpperCase());
    if (formData.imagen && formData.imagen instanceof File) {
      formDataToSend.append("imagen", formData.imagen);
    }

    try {
      if (metodo) {
        await actualizarMetodoPago(metodo.id, formDataToSend);
        toast({
          title: "Método de pago actualizado",
          description: "Se ha actualizado correctamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        await agregarMetodoPago(formDataToSend);
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
      setFormData(initialFormData);
      setImagenPreview(null);
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
        <ModalCloseButton color={"black"} />
        <ModalBody py={6} color="black">
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nombre</FormLabel>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
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
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                bg="white"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
                sx={{
                  '& option': {
                    backgroundColor: 'white !important',
                    color: 'gray.600',
                  },
                }}
              >
                <option value="">Seleccione un tipo</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="TRANSFERENCIA">Transferencia</option>
              </Select>
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
