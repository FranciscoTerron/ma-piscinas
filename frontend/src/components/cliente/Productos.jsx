import React, { useEffect, useState } from "react";
import {
  Container, VStack, HStack, Text, Box, Grid, Image, Button, Badge, useToast, Input, Select,
  Skeleton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  useDisclosure, IconButton, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb,
  Flex, useBreakpointValue, InputGroup, InputLeftElement
} from "@chakra-ui/react";
import { FiSearch, FiMenu, FiShoppingCart, FiFilter, FiSliders } from 'react-icons/fi';
import { listarProductos, listarCategorias, listarSubcategorias } from "../../services/api";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

const Productos = () => {
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
  const toast = useToast();
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const isMobile = useBreakpointValue({ base: true, md: false });

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
      const [productosData, categoriasData] = await Promise.all([
        listarProductos(),
        listarCategorias()
      ]);
      setProductos(productosData.productos);
      setCategorias(categoriasData.categorias);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos. Por favor, intente nuevamente.",
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
      const data = await listarSubcategorias(1, 100, categoriaId); // Usamos tu servicio con paginación
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

  const productosFiltrados = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoria === "todas" || String(producto.categoria_id) === String(selectedCategoria);
    const matchesSubcategory = selectedSubcategoria === "todas" || String(producto.subcategoria_id) === String(selectedSubcategoria);
    const matchesPrice = producto.precio >= rangoPrecio[0] && producto.precio <= rangoPrecio[1];
    return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
  }).sort((a, b) => {
    switch (ordenarPor) {
      case "precio-bajo":
        return a.precio - b.precio;
      case "precio-alto":
        return b.precio - a.precio;
      case "descuento":
        return (b.descuento || 0) - (a.descuento || 0);
      default:
        return 0;
    }
  });

  const FiltersContent = () => (
    <VStack spacing={4} align="start" w="full">
      {selectedCategoria !== "todas" && (
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" color="blue.600" mb={4}>
          {categorias.find(cat => cat.id === parseInt(selectedCategoria))?.nombre || "Categoría"}
        </Text>
      )}
      <HStack spacing={2}>
        <FiFilter />
        <Text fontSize="lg" fontWeight="bold">Filtros</Text>
      </HStack>
      <Box w="full">
        <Text mb={2}>Categorías</Text>
        <Select 
          value={selectedCategoria}
          onChange={(e) => {
            setSelectedCategoria(e.target.value);
            setSelectedSubcategoria("todas");
            if (e.target.value !== "todas") cargarSubcategorias(e.target.value);
            else setSubcategorias([]); // Limpiar subcategorías si se selecciona "todas"
          }}
          sx={{ '& option': { backgroundColor: 'white !important', color: 'gray.600' } }}
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </Select>
      </Box>
      {selectedCategoria !== "todas" && (
        <Box w="full">
          <Text mb={2}>Subcategorías</Text>
          <Select
            value={selectedSubcategoria}
            onChange={(e) => setSelectedSubcategoria(e.target.value)}
            sx={{ '& option': { backgroundColor: 'white !important', color: 'gray.600' } }}
          >
            <option value="todas">Todas las subcategorías</option>
            {subcategorias.map((subcategoria) => (
              <option key={subcategoria.id} value={subcategoria.id}>
                {subcategoria.nombre}
              </option>
            ))}
          </Select>
        </Box>
      )}
      <Box w="full">
        <Text mb={2}>Ordenar por</Text>
        <Select
          value={ordenarPor}
          onChange={(e) => setOrdenarPor(e.target.value)}
          sx={{ '& option': { backgroundColor: 'white !important', color: 'gray.600' } }}
        >
          <option value="relevancia">Relevancia</option>
          <option value="precio-bajo">Menor precio</option>
          <option value="precio-alto">Mayor precio</option>
          <option value="descuento">Mayor descuento</option>
        </Select>
      </Box>
      <Box w="full">
        <HStack spacing={2} mb={2}>
          <FiSliders />
          <Text>Rango de precio</Text>
        </HStack>
        <RangeSlider
          min={0}
          max={10000000}
          step={1000}
          value={rangoPrecio}
          onChange={setRangoPrecio}
        >
          <RangeSliderTrack>
            <RangeSliderFilledTrack />
          </RangeSliderTrack>
          <RangeSliderThumb index={0} />
          <RangeSliderThumb index={1} />
        </RangeSlider>
        <Flex justify="space-between">
          <Text>${rangoPrecio[0].toLocaleString()}</Text>
          <Text>${rangoPrecio[1].toLocaleString()}</Text>
        </Flex>
      </Box>
    </VStack>
  );

  const ProductoSkeleton = () => (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Skeleton height="200px" mb={4} />
      <Skeleton height="20px" mb={2} />
      <Skeleton height="20px" mb={2} />
      <Skeleton height="20px" mb={2} />
      <Skeleton height="40px" />
    </Box>
  );

  return (
    <Container maxW="container.xl" py={4} color={"black"}>
      <Text fontSize="35px" fontWeight="bold" mb={4} textAlign="center">Productos</Text>
      <Flex mb={6} gap={4} direction={{ base: "column", md: "row" }}>
        <HStack flex={1} justify="flex-start">
          <InputGroup width={{ base: "100%", md: "300px" }}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              border="2px solid gray"
            />
          </InputGroup>
          {isMobile && (
            <IconButton
              variant="outline"
              color="#00008B"
              borderColor="#00008B"
              icon={<FiMenu />}
              onClick={onOpen}
              aria-label="Abrir filtros"
            />
          )}
        </HStack>
      </Flex>
      <HStack align="start" spacing={8}>
        {!isMobile && (
          <Box w="250px" bg="white" borderColor="#00008B">
            <FiltersContent />
          </Box>
        )}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent bg="white" borderColor="#00008B" color={"black"}>
            <DrawerCloseButton color={"black"} />
            <DrawerHeader>Filtros</DrawerHeader>
            <DrawerBody>
              <FiltersContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
        <Box flex={1}>
          <Grid
            templateColumns={{
              base: "repeat(1, 1fr)",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
              xl: "repeat(4, 1fr)"
            }}
            gap={6}
          >
            {loading
              ? Array(8).fill(null).map((_, i) => <ProductoSkeleton key={i} />)
              : productosFiltrados.map((producto) => (
                  <Box
                    key={producto.id}
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    p={4}
                    position="relative"
                    transition="transform 0.2s"
                    _hover={{ transform: "translateY(-4px)" }}
                  >
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      borderRadius="md"
                      mb={3}
                      objectFit="cover"
                      h="200px"
                      w="full"
                    />
                    {producto.descuento && (
                      <Badge
                        colorScheme="blue"
                        position="absolute"
                        top={4}
                        right={4}
                      >
                        {producto.descuento}% OFF
                      </Badge>
                    )}
                    <Text fontWeight="bold" fontSize="lg" noOfLines={2} mb={2}>
                      {producto.nombre}
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" color="blue.600" mb={1}>
                      ${producto.precio.toLocaleString()}
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                      3 cuotas sin interés de ${(producto.precio / 3).toFixed(2)}
                    </Text>
                    <VStack spacing={2} w="full">
                      <Button
                        colorScheme="blue"
                        w="full"
                        leftIcon={<FiShoppingCart />}
                        _hover={{ transform: "scale(1.02)" }}
                        onClick={() => addToCart(producto)}
                      >
                        Agregar al carrito
                      </Button>
                      <Link to={`/producto/${producto.id}`} style={{ width: '100%' }}>
                        <Button
                          variant="outline"
                          colorScheme="blue"
                          w="full"
                          _hover={{ transform: "scale(1.02)" }}
                        >
                          Ver más
                        </Button>
                      </Link>
                    </VStack>
                  </Box>
                ))}
          </Grid>
        </Box>
      </HStack>
    </Container>
  );
};

export default Productos;