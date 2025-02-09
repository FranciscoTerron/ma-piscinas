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
  Box,
  Image,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { crearProducto, actualizarProducto, listarCategorias } from '../../../services/api';

const initialProductoState = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagen: "",
  categoriaId: "",
};

const FormularioProducto = ({ isOpen, onClose, onSubmitSuccess, producto }) => {
  const [formData, setFormData] = useState(initialProductoState);
  const [categorias, setCategorias] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const toast = useToast();

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        imagen: producto.imagen,
        categoriaId: producto.categoria_id,
      });
      setImagenPreview(producto.imagen);
    } else {
      setFormData(initialProductoState);
      setImagenPreview(null);
    }
  }, [producto]);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const data = await listarCategorias();
      setCategorias(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de categorías.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
      if (!file.type.match('image.*')) {
        toast({
          title: "Error",
          description: "Por favor seleccione un archivo de imagen válido (jpg, png, etc).",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          imagen: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const formDataToSend = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      categoria_id: parseInt(formData.categoriaId),
      imagen: formData.imagen.name,
    };

    try {
      if (producto) {
        await actualizarProducto(producto.id, formDataToSend);
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        await crearProducto(formDataToSend);
        toast({
          title: "Éxito",
          description: "Producto agregado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      onSubmitSuccess();
      onClose();
      setFormData(initialProductoState);
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader borderBottom="1px" borderColor="gray.900" color={"black"}>
          {producto ? "Editar Producto" : "Agregar Nuevo Producto"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody bg="white" py={6} color={"black"}>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Nombre</FormLabel>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del producto"
                bg="white"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Input
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción del producto"
                bg="white"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Precio</FormLabel>
              <Input
                name="precio"
                type="number"
                value={formData.precio}
                onChange={handleInputChange}
                placeholder="Precio del producto"
                bg="white"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Stock</FormLabel>
              <Input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="Stock disponible"
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
                onClick={() => document.getElementById('imagen-input').click()}
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
                    <Text color="gray.500">
                      Click para seleccionar una imagen
                    </Text>
                    <Text fontSize="sm" color="gray.400">
                      (JPG, PNG)
                    </Text>
                  </VStack>
                )}
              </Box>
            </FormControl>

            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select
                name="categoriaId"
                value={formData.categoriaId}
                onChange={handleInputChange}
                placeholder="Seleccione una categoría"
                bg="white"
                border="1px"
                borderColor="gray.200"
                _hover={{ borderColor: "gray.300" }}
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter borderTop="1px" borderColor="gray.100" bg="gray.50">
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {producto ? "Actualizar" : "Agregar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormularioProducto;