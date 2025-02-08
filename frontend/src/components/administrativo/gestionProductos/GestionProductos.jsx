import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useDisclosure,
  useToast,
  VStack,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { listarProductos, eliminarProducto, crearProducto, listarCategorias } from "../../../services/api";
import GoBackButton from "../../GoBackButton";


const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const toast = useToast();

  // Para el diálogo de eliminación
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Para el modal de creación de producto
  const {
    isOpen: isOpenCrear,
    onOpen: onOpenCrear,
    onClose: onCloseCrear,
  } = useDisclosure();

  // Estado para los datos del nuevo producto
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoriaId: "", // Aquí se guardará el id de la categoría seleccionada
  });

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  // Función para cargar los productos desde la API
  const cargarProductos = async () => {
    try {
      const data = await listarProductos();
      setProductos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de productos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

const abrirModalEditar = (producto) => {
  setProductoEditado({
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    stock: producto.stock,
    imagen: producto.imagen,
    categoriaId: producto.categoria?.id || "", 
  });
  onOpenEditar();
};

  // Función para cargar las categorías desde la API
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

  // Función para abrir el diálogo de eliminación
  const confirmarEliminacion = (producto) => {
    setProductoAEliminar(producto);
    onOpen();
  };

  // Función para eliminar el producto
  const handleEliminarProducto = async () => {
    try {
      await eliminarProducto(productoAEliminar.id);
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      cargarProductos();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  // Manejar el cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAgregarProducto = async () => {
    const productoData = {
      nombre: nuevoProducto.nombre,
      descripcion: nuevoProducto.descripcion,
      precio: parseFloat(nuevoProducto.precio), // Convertir a número
      stock: parseInt(nuevoProducto.stock), // Convertir a entero
      imagen: nuevoProducto.imagen || "https://via.placeholder.com/150", // Imagen por defecto
      categoria_id: parseInt(nuevoProducto.categoriaId) // Convertir a entero
    };
  
    console.log("Enviando producto:", productoData);
    try {
      const response = await fetch("http://localhost:8000/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en la solicitud:", errorData);
        toast({
          title: "Error",
          description: "No se pudo agregar el producto.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.log("Producto agregado con éxito");
        toast({
          title: "Éxito",
          description: "Producto agregado correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        cargarProductos(); // Recargar la lista de productos
        onCloseCrear(); // Cerrar modal
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const handleEditarProducto = async () => {
    const productoData = {
      nombre: productoEditado.nombre,
      descripcion: productoEditado.descripcion,
      precio: parseFloat(productoEditado.precio),
      stock: parseInt(productoEditado.stock),
      imagen: productoEditado.imagen || "https://via.placeholder.com/150",
      categoria_id: parseInt(productoEditado.categoriaId) // Convertir a entero
    };
  
    try {
      const response = await fetch(`http://localhost:8000/productos/${productoEditado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productoData),
      });
  
      if (!response.ok) {
        throw new Error("Error al actualizar el producto");
      }
  
      toast({
        title: "Éxito",
        description: "Producto actualizado correctamente.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
  
      cargarProductos(); // Recargar lista
      onCloseEditar(); // Cerrar modal
  
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el producto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Encabezado */}
        <HStack justify="space-between">
          <HStack spacing={4}>
            <GoBackButton />
            <VStack align="flex-start" spacing={0}>
              <HStack>
                <FaEdit size="24px" color="#4A5568" />
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  Gestión de Productos
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {productos.length} productos disponibles
              </Text>
            </VStack>
          </HStack>
          {/* Botón para agregar un nuevo producto */}
          <Button colorScheme="blue" onClick={onOpenCrear}>
            Agregar Producto
          </Button>
        </HStack>

        {/* Tabla de productos */}
        <Box
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          border="1px solid"
          borderColor="gray.200"
          overflow="hidden"
        >
          <Table variant="simple">
          <Thead bg="gray.50">
                <Tr>
                    <Th textAlign="center" color="gray.600">ID</Th>
                    <Th textAlign="center" color="gray.600">Nombre</Th>
                    <Th textAlign="center" color="gray.600">Descripción</Th>
                    <Th textAlign="center" color="gray.600">Precio</Th>
                    <Th textAlign="center" color="gray.600">Stock</Th>
                    <Th textAlign="center" color="gray.600">Imagen</Th>
                    <Th textAlign="center" color="gray.600">Categoría</Th>
                    <Th textAlign="center" color="gray.600">Acciones</Th>
                </Tr>
                </Thead>
                <Tbody>
                {productos.map((producto) => (
                    <Tr key={producto.id} _hover={{ bg: "gray.50" }} transition="background-color 0.2s">
                    <Td textAlign="center" color="gray.700">{producto.id}</Td>
                    <Td textAlign="center" color="gray.700" fontWeight="medium">{producto.nombre}</Td>
                    <Td textAlign="center" color="gray.600">{producto.descripcion}</Td>
                    <Td textAlign="center" color="gray.600">${producto.precio}</Td>
                    <Td textAlign="center" color="gray.600">{producto.stock}</Td>
                    <Td textAlign="center" color="gray.600">
                        <img src={producto.imagen} alt="Producto" width="50" height="50" />
                    </Td>
                    <Td textAlign="center" color="gray.600">{producto.categoria?.nombre || "Sin categoría"}</Td>
                    <Td textAlign="center">
                        <IconButton
                        aria-label="Editar producto"
                        icon={<FaEdit />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                        _hover={{ bg: "blue.50" }}
                        onClick={() => {
                            // Lógica para editar
                        }}
                        />
                        <IconButton
                        aria-label="Eliminar producto"
                        icon={<FaTrash />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ bg: "red.50" }}
                        onClick={() => confirmarEliminacion(producto)}
                        />
                    </Td>
                    </Tr>
                ))}
                </Tbody>

          </Table>
        </Box>
      </VStack>

      {/* Modal para agregar un nuevo producto */}
      <Modal isOpen={isOpenCrear} onClose={onCloseCrear}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Nuevo Producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
                <FormLabel>Nombre</FormLabel>
                <Input
                name="nombre"
                value={nuevoProducto.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del producto"
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Descripción</FormLabel>
                <Input
                name="descripcion"
                value={nuevoProducto.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción del producto"
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Precio</FormLabel>
                <Input
                name="precio"
                type="number"
                value={nuevoProducto.precio}
                onChange={handleInputChange}
                placeholder="Precio del producto"
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Stock</FormLabel>
                <Input
                name="stock"
                type="number"
                value={nuevoProducto.stock}
                onChange={handleInputChange}
                placeholder="Stock disponible"
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Imagen (URL)</FormLabel>
                <Input
                name="imagen"
                value={nuevoProducto.imagen}
                onChange={handleInputChange}
                placeholder="URL de la imagen"
                />
            </FormControl>

            <FormControl mb={4}>
                <FormLabel>Categoría</FormLabel>
                <Select
                name="categoriaId"
                value={nuevoProducto.categoriaId}
                onChange={handleInputChange}
                placeholder="Seleccione una categoría"
                >
                {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                    </option>
                ))}
                </Select>
            </FormControl>
        </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onCloseCrear}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleAgregarProducto}>
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Diálogo de confirmación para eliminar producto */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Eliminar Producto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            ¿Estás seguro de que deseas eliminar el producto{" "}
            <strong>{productoAEliminar?.nombre}</strong>? Esta acción no se puede deshacer.
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={handleEliminarProducto}>
              Eliminar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default GestionProductos;
