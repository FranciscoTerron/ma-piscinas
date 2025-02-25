import React, { useEffect, useState } from "react";
import {
  Container,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  useDisclosure,
  Input,
  Select
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { listarProductos, listarCategorias, listarSubcategorias } from "../../../../services/api";
import GoBackButton from "../../../GoBackButton";
import FormularioProducto from "./FormularioProducto";
import ListaProductos from "./ListaProductos";

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);  
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(3);
  const [totalProductos, setTotalProductos] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const totalPaginas = Math.ceil(totalProductos / productosPorPagina);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [subcategoriaSeleccionada, setSubCategoriaSeleccionada] = useState("");


 useEffect(() => {
  cargarProductos();
  cargarCategorias();
  cargarSubcategorias();
  }, [paginaActual, productosPorPagina]);

// Nuevo efecto para cargar subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    const cargarSubcategorias = async () => {
      if (categoriaSeleccionada) {
        try {
          const data = await listarSubcategorias(1, 100, categoriaSeleccionada);
          setSubcategorias(data.subcategorias || []);
        } catch (error) {
          console.error("Error al cargar subcategorías:", error);
        }
      }
    };
    cargarSubcategorias();
  }, [categoriaSeleccionada]);
  const cargarProductos = async () => {
    try {
      const data = await listarProductos(paginaActual, productosPorPagina);
      setProductos(data.productos);
      setTotalProductos(data.total);
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

  const cargarSubcategorias = async () => {
    try {
      const data = await listarSubcategorias(1, 100);
      setSubcategorias(data.subcategorias || []);
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

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    onOpen();
  };

  
  const handleSiguientePagina = () => {
    setPaginaActual(prev => prev + 1);
  };

  const handlePaginaAnterior = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };
  // Manejar cambio en categoría seleccionada
const handleCategoriaChange = (e) => {
  setCategoriaSeleccionada(e.target.value);
};

  
const productosFiltrados = productos.filter((producto) => {
  const textoBusqueda = busqueda.toLowerCase();
  const coincideBusqueda =producto.nombre.toLowerCase().includes(textoBusqueda) ||  producto.descripcion.toLowerCase().includes(textoBusqueda);
  const nombreCategoria = String(producto.categoria_id);
  const coincideNombre = categoriaSeleccionada ? nombreCategoria === categoriaSeleccionada : true; 

  const coincideSubcategoria = subcategoriaSeleccionada 
    ? producto.subcategoria_id === subcategoriaSeleccionada
    : true;
    
  return coincideBusqueda && coincideNombre && coincideSubcategoria;
});


  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
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
                {totalProductos} productos disponibles
              </Text>
            </VStack>
          </HStack>
          <Button colorScheme="blue" onClick={() => handleEditarProducto(null)}>
            Agregar Producto
          </Button>
        </HStack>

        <HStack spacing={4}>
          <Input
            placeholder="Buscar por nombre o descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            bg="white"
            border="1px"
            borderColor="gray.300"
            color="black"
            _placeholder={{ color: "gray.500" }}
          />

          <Select
            placeholder="Filtrar por categoría"
            value={categoriaSeleccionada}
            onChange={handleCategoriaChange}
            bg="white"
            border="1px"
            borderColor="gray.300"
            color="black"
            sx={{
              '& option': {
                backgroundColor: 'white !important',
                color: 'gray.600'
              }
            }}
          >
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </Select>
        </HStack>

        <ListaProductos
          productos={productosFiltrados}
          categorias={categorias}
          subcategorias={subcategorias} 
          onEditar={handleEditarProducto}
          onEliminar={cargarProductos} // Eliminar parámetros
        />

          <FormularioProducto
            isOpen={isOpen}
            onClose={onClose}
            onSubmitSuccess={cargarProductos}
            categorias={categorias}
            subcategorias={subcategorias} // Pasar subcategorías al formulario
            producto={productoSeleccionado}
          />
         
         <HStack spacing={2} justify="center" mt={4} color="black">
           <Button
            colorScheme="blue"
            size="sm"
            onClick={handlePaginaAnterior}
            isDisabled={paginaActual === 1}
          >
          Anterior
          </Button>
          <Text>
           Página {paginaActual} de {totalPaginas}
          </Text>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={handleSiguientePagina}
            isDisabled={paginaActual >= totalPaginas}
          > 
          Siguiente
         </Button>
        </HStack>
      </VStack>
    </Container>
  );
};

export default GestionProductos;