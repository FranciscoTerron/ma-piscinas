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
import { crearProducto, actualizarProducto, listarCategorias, listarSubcategorias, verificarNombreProducto } from "../../../../services/api"; // Añadimos listarSubcategorias
import { useAuth } from "../../../../context/AuthContext";

const initialProductoState = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagen: null,
  categoriaId: "",
  subcategoriaId: "", // Aseguramos que esté incluido
  costoCompra: "",
};

const FormularioProducto = ({ isOpen, onClose, onSubmitSuccess, producto }) => {
  const [formData, setFormData] = useState(initialProductoState);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [imagenPreview, setImagenPreview] = useState(null);
  const toast = useToast();
  const { userId } = useAuth();

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        stock: producto.stock,
        imagen: null,
        categoriaId: producto.categoria_id,
        subcategoriaId: producto.subcategoria_id || "", // Aseguramos que esté incluido
        costoCompra: producto.costo_compra || "",
      });
      if (producto.imagen && typeof producto.imagen === "string" && producto.imagen.startsWith("http")) {
        setImagenPreview(producto.imagen);
      } else {
        setImagenPreview(null);
      }
    } else {
      setFormData(initialProductoState);
      setImagenPreview(null);
      setSubcategorias([]); // Limpiar subcategorías al crear nuevo producto
    }
    cargarCategorias();
  }, [producto]);

  useEffect(() => {
    if (formData.categoriaId) {
      cargarSubcategorias(formData.categoriaId);
    }
  }, [formData.categoriaId]);

  const cargarCategorias = async () => {
    try {
      const data = await listarCategorias();
      setCategorias(data.categorias);
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

  const cargarSubcategorias = async (categoriaId) => {
    try {
      const data = await listarSubcategorias(1, 100, categoriaId);
      setSubcategorias(data.subcategorias || []);
    } catch (error) {
      console.error("Error al cargar subcategorías:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las subcategorías.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === "precio" || name === "stock" || name === "costoCompra") && value < 0) {
      toast({
        title: "Valor inválido",
        description: "No se permiten valores negativos.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
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
      setImagenPreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        imagen: file,
      }));
    }
  };

  const handleSubmit = async () => {
    console.log("Datos del formulario:", formData); // Agrega esto
    if (!formData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto es obligatorio.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!formData.descripcion.trim()) {
      toast({
        title: "Error",
        description: "La descripción no puede estar vacía.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (formData.precio === "" || isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
      toast({
        title: "Error",
        description: "Ingrese un precio válido mayor a 0.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (formData.stock === "" || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      toast({
        title: "Error",
        description: "Ingrese un stock válido (mínimo 0).",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    if (!formData.categoriaId) {
      toast({
        title: "Error",
        description: "Seleccione una categoría.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    if (formData.costoCompra !== "" && (isNaN(formData.costoCompra) || parseFloat(formData.costoCompra) < 0)) {
      toast({
        title: "Error",
        description: "Ingrese un costo de compra válido (mínimo 0).",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const nombreTrim = formData.nombre.trim();
      const nombreExiste = await verificarNombreProducto(nombreTrim);
      if (nombreExiste && (!producto || producto.nombre.trim() !== nombreTrim)) {
        toast({
          title: "Error",
          description: "Ya existe un producto con ese nombre.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
    } catch (error) {
      console.error("Error al verificar nombre:", error.response?.data || error.message);
      toast({
        title: "Error",
        description: "No se pudo verificar el nombre del producto: " + (error.response?.data?.detail || error.message),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("nombre", formData.nombre);
    formDataToSend.append("descripcion", formData.descripcion);
    formDataToSend.append("precio", parseFloat(formData.precio));
    formDataToSend.append("stock", parseInt(formData.stock));
    formDataToSend.append("categoria_id", parseInt(formData.categoriaId));
    formDataToSend.append("usuario_id", parseInt(userId));
    if (formData.costoCompra !== "") {
      formDataToSend.append("costo_compra", parseFloat(formData.costoCompra));
    }
    if (formData.subcategoriaId) {  // Aseguramos que se envíe subcategoria_id
      formDataToSend.append("subcategoria_id", parseInt(formData.subcategoriaId));
    }
    if (formData.imagen && formData.imagen instanceof File) {
      formDataToSend.append("imagen", formData.imagen);
    } else if (!producto) {
      toast({
        title: "Error",
        description: "Debe seleccionar un archivo de imagen válido.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      let nuevoProducto;
      if (producto) {
        console.log("Actualizando producto con ID:", producto.id, "Datos:", Object.fromEntries(formDataToSend));
        nuevoProducto = await actualizarProducto(producto.id, formDataToSend);
        toast({
          title: "Éxito",
          description: "Producto actualizado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.log("Creando nuevo producto con datos:", Object.fromEntries(formDataToSend));
        nuevoProducto = await crearProducto(formDataToSend);
        toast({
          title: "Éxito",
          description: `Producto agregado con código: ${nuevoProducto.codigo}`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      console.log("Respuesta del backend:", nuevoProducto);  // Agrega esto para depurar
      onSubmitSuccess(nuevoProducto);
      onClose();
      setFormData(initialProductoState);
      setImagenPreview(null);
      setSubcategorias([]);  // Limpiar subcategorías
      
    } catch (error) {
      console.error("Error al enviar el producto:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      toast({
        title: "Error",
        description: "No se pudo realizar la operación: " + (error.response?.data?.detail || error.message),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
      setFormData(initialProductoState);
      setImagenPreview(null);
      setSubcategorias([]);  // Limpiar subcategorías
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader borderBottom="1px" borderColor="gray.900" color="black">
          {producto ? "Editar Producto" : "Agregar Nuevo Producto"}
        </ModalHeader>
        <ModalCloseButton color="black" />
        <ModalBody bg="white" py={6} color="black">
          <VStack spacing={4}>
            {producto && (
              <FormControl>
                <FormLabel>Código</FormLabel>
                <Input
                  value={producto.codigo}
                  isReadOnly
                  bg="gray.100"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: "gray.300" }}
                />
              </FormControl>
            )}
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
              <FormLabel>Costo de Compra</FormLabel>
              <Input
                name="costoCompra"
                type="number"
                value={formData.costoCompra}
                onChange={handleInputChange}
                placeholder="Costo de compra (opcional)"
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
                    <Text fontSize="sm" color="gray.400">(JPG, PNG)</Text>
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
                sx={{
                  "& option": {
                    backgroundColor: "white !important",
                    color: "gray.600",
                  },
                }}
              >
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>
            {formData.categoriaId && (
              <FormControl>
                <FormLabel>Subcategoría (Opcional)</FormLabel>
                <Select
                  name="subcategoriaId"
                  value={formData.subcategoriaId}
                  onChange={handleInputChange}
                  placeholder="Seleccione una subcategoría"
                  bg="white"
                  border="1px"
                  borderColor="gray.200"
                  _hover={{ borderColor: "gray.300" }}
                  sx={{
                    "& option": {
                      backgroundColor: "white !important",
                      color: "gray.600",
                    },
                  }}
                >
                  <option value="">Sin subcategoría</option>
                  {subcategorias.map((subcategoria) => (
                    <option key={subcategoria.id} value={subcategoria.id}>
                      {subcategoria.nombre}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
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