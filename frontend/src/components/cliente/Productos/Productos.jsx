import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import {
  Container, VStack, HStack, Text, Box, Grid, Image, Button, Badge, useToast,
  Input, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  useDisclosure, IconButton, Flex, useBreakpointValue, InputGroup, InputLeftElement,
  Heading, Divider
} from "@chakra-ui/react";
import { FiSearch, FiMenu, FiFilter } from "react-icons/fi";
import { listarProductos, listarCategorias, listarSubcategorias, obtenerProductosDescuento } from "../../../services/api";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useCart } from "../../../context/CartContext";
import 'bootstrap/dist/css/bootstrap.min.css';

import Filtros from './Filtros';
import ProductoItem from './ProductoItem';
import ProductoModal from './ProductoModal';
import ProductoSkeleton from "./ProductoSkeleton";

const Productos = () => {
  // Estados y hooks
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("todas");
  const [selectedSubcategoria, setSelectedSubcategoria] = useState("todas");
  const [ordenarPor, setOrdenarPor] = useState("relevancia");
  const [rangoPrecio, setRangoPrecio] = useState([0, 10000000]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const toast = useToast();
  const toastRef = useRef({});
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  
  // Hook para el modal de producto
  const {
    isOpen: isModalOpen, 
    onOpen: openModal, 
    onClose: closeModal 
  } = useDisclosure();

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    const categoriaFromUrl = searchParams.get("categoria");
    if (categoriaFromUrl) {
      setSelectedCategoria(categoriaFromUrl);
      cargarSubcategorias(categoriaFromUrl);
    }
  }, [searchParams]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData, descuentoData] = await Promise.all([
        listarProductos(),
        listarCategorias(),
        obtenerProductosDescuento(pagina, 10)
      ]);
      
      const productosCombinados = productosData.productos.map(prod => {
        const prodDescuento = descuentoData.productos.find(d => d.id === prod.id);
        return prodDescuento ? { ...prod, descuento: prodDescuento.descuento } : prod;
      });
  
      setProductos(productosCombinados);
      setCategorias(categoriasData.categorias);
      setTotalPaginas(Math.ceil(descuentoData.total / 10));
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
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

  // Función que navega a la vista completa del producto
  const handleProductClick = useCallback((producto) => {
    navigate(`/producto/${producto.id}`);
  }, [navigate]);

  const handleAddToCart = useCallback((producto, qty = 1) => {
    if (isAdding) return; // Evitar múltiples ejecuciones
    setIsAdding(true);
    addToCart({ ...producto, cantidad: qty }); // Pasa la cantidad
    const uniqueId = producto.id;
    if (!toastRef.current[uniqueId]) {
      toastRef.current[uniqueId] = true;
      toast({
        id: `producto-agregado-${uniqueId}`,
        title: "Producto agregado",
        description: `${qty} ${producto.nombre} agregado(s) al carrito`, 
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom-right",
        onCloseComplete: () => {
          delete toastRef.current[uniqueId];
          setIsAdding(false);
        },
      });
    }
    
    if (isModalOpen) closeModal();
  }, [addToCart, toast, isModalOpen, closeModal, isAdding]);
  
  const handleOpenModal = useCallback((producto) => {
    setSelectedProduct(producto); // Establece el producto seleccionado
    setQuantity(1); // Reinicia la cantidad a 1
    openModal(); // Abre el modal
  }, [openModal]);

  const productosFiltrados = useMemo(() => productos
    .filter(producto => {
      const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategoria === "todas" ||
        String(producto.categoria_id) === String(selectedCategoria);
      const matchesSubcategory =
        selectedSubcategoria === "todas" ||
        String(producto.subcategoria_id) === String(selectedSubcategoria);
      const matchesPrice = producto.precio >= rangoPrecio[0] && producto.precio <= rangoPrecio[1];
      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (ordenarPor) {
        case "precio-bajo":
          return a.precio - b.precio;
        case "precio-alto":
          return b.precio - a.precio;
        case "descuento":
          return (b.descuento ? b.descuento.valor : 0) - (a.descuento ? a.descuento.valor : 0);
        default:
          return 0;
      }
    }), [productos, searchTerm, selectedCategoria, selectedSubcategoria, rangoPrecio, ordenarPor]);

  return (
    <Container maxW="container.xl" py={6} color="black">
      {/* Header mejorado con degradado */}
      <Box 
        bg="linear-gradient(90deg,rgb(1, 25, 49) 0%,rgb(13, 139, 230) 100%)"
        color="white"
        py={10}
        px={4}
        borderRadius="lg"
        mb={8}
        boxShadow="lg"
      >
        <Heading 
          as="h1" 
          fontSize={{ base: "28px", md: "35px" }} 
          fontWeight="bold" 
          textAlign="center"
          mb={5}
        >
          Catálogo de Productos
        </Heading>
        
        {/* Barra de búsqueda mejorada */}
        <Flex 
          justify="center" 
          align="center" 
          mb={2}
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <InputGroup 
            size="lg"
            width={{ base: "100%", md: "500px" }}
            bg="white"
            borderRadius="full"
            boxShadow="md"
          >
            <InputLeftElement pointerEvents="none" h="100%">
              <FiSearch color="gray.500" size={20} />
            </InputLeftElement>
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              borderRadius="full"
              pl={10}
              color="black"
              _focus={{
                boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)"
              }}
              size="lg"
            />
          </InputGroup>
          
          {isMobile && (
            <IconButton
              size="lg"
              colorScheme="blue"
              aria-label="Abrir filtros"
              icon={<FiFilter size={20} />}
              onClick={onOpen}
              borderRadius="full"
              variant="solid"
            />
          )}
        </Flex>
        
        {/* Contador de resultados */}
        <Text textAlign="center" fontSize="sm" mt={2}>
          {loading ? 'Cargando productos...' : `${productosFiltrados.length} productos encontrados`}
        </Text>
      </Box>
      
      <HStack align="start" spacing={{ base: 0, md: 8 }}>
        {/* Sidebar de filtros para desktop */}
        {!isMobile && (
          <Box 
            w="270px" 
            bg="white" 
            p={4} 
            borderRadius="md" 
            boxShadow="md"
            position="sticky"
            top="20px"
          >
            <Text fontSize="xl" fontWeight="bold" mb={4} color="#001f3f">Filtros</Text>
            <Divider mb={4} />
            <Filtros
              categorias={categorias}
              subcategorias={subcategorias}
              selectedCategoria={selectedCategoria}
              setSelectedCategoria={setSelectedCategoria}
              selectedSubcategoria={selectedSubcategoria}
              setSelectedSubcategoria={setSelectedSubcategoria}
              ordenarPor={ordenarPor}
              setOrdenarPor={setOrdenarPor}
              rangoPrecio={rangoPrecio}
              setRangoPrecio={setRangoPrecio}
              cargarSubcategorias={cargarSubcategorias}
            />
          </Box>
        )}
        
        {/* Drawer de filtros para mobile */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
          <DrawerOverlay />
          <DrawerContent bg="white" color="black">
            <DrawerHeader 
              bg="linear-gradient(90deg, #001f3f 0%, #0077cc 100%)" 
              color="white"
            >
              Filtros de búsqueda
              <DrawerCloseButton color="white" />
            </DrawerHeader>
            <DrawerBody>
              <Filtros
                categorias={categorias}
                subcategorias={subcategorias}
                selectedCategoria={selectedCategoria}
                setSelectedCategoria={setSelectedCategoria}
                selectedSubcategoria={selectedSubcategoria}
                setSelectedSubcategoria={setSelectedSubcategoria}
                ordenarPor={ordenarPor}
                setOrdenarPor={setOrdenarPor}
                rangoPrecio={rangoPrecio}
                setRangoPrecio={setRangoPrecio}
                cargarSubcategorias={cargarSubcategorias}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        
        {/* Grid de productos */}
        <Box flex={1}>
          {/* Estado de carga o grid de productos */}
          {loading ? (
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
                xl: "repeat(4, 1fr)"
              }}
              gap={6}
            >
              {Array(8)
                .fill(null)
                .map((_, i) => <ProductoSkeleton key={i} />)}
            </Grid>
          ) : productosFiltrados.length > 0 ? (
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
                xl: "repeat(4, 1fr)"
              }}
              gap={6}
            >
              {productosFiltrados.map((producto) => (
                <ProductoItem
                  key={producto.id}
                  producto={producto}
                  handleProductClick={handleProductClick}
                  handleAddToCart={handleAddToCart}
                  handleOpenModal={handleOpenModal} 
                />
              ))}
            </Grid>
          ) : (
            <Flex 
              justify="center" 
              align="center" 
              direction="column" 
              p={10} 
              bg="gray.50" 
              borderRadius="md"
            >
              <Text fontSize="xl" fontWeight="medium" mb={4}>
                No se encontraron productos que coincidan con tu búsqueda
              </Text>
              <Button 
                colorScheme="blue" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategoria("todas");
                  setSelectedSubcategoria("todas");
                  setRangoPrecio([0, 10000000]);
                }}
              >
                Limpiar filtros
              </Button>
            </Flex>
          )}
          
          {/* Paginación (si es necesario) */}
          {totalPaginas > 1 && !loading && (
            <Flex justify="center" mt={8}>
              <Button
                isDisabled={pagina === 1}
                onClick={() => setPagina(pagina - 1)}
                mr={2}
                colorScheme="blue"
                variant="outline"
              >
                Anterior
              </Button>
              <Text alignSelf="center" mx={4}>
                Página {pagina} de {totalPaginas}
              </Text>
              <Button
                isDisabled={pagina === totalPaginas}
                onClick={() => setPagina(pagina + 1)}
                ml={2}
                colorScheme="blue"
                variant="outline"
              >
                Siguiente
              </Button>
            </Flex>
          )}
        </Box>
      </HStack>

      {/* Modal de producto */}
      <ProductoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedProduct={selectedProduct}
        quantity={quantity}
        setQuantity={setQuantity}
        handleAddToCart={handleAddToCart}
      />
    </Container>
  );
};

export default Productos;