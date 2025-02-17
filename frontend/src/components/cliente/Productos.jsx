import React, { useEffect, useState } from "react";
import { 
  Container, VStack, HStack, Text, Box, Grid, Image, Button, Badge, useToast, Input, Select,
  Skeleton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  useDisclosure, IconButton, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb,
  Flex, useBreakpointValue, InputGroup, InputLeftElement,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Divider
} from "@chakra-ui/react";
import { FiSearch, FiMenu, FiShoppingCart, FiFilter, FiSliders } from 'react-icons/fi';
import { listarProductos, listarCategorias } from "../../services/api";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("todas");
  const [ordenarPor, setOrdenarPor] = useState("relevancia");
  const [rangoPrecio, setRangoPrecio] = useState([0, 10000000]);
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useToast();
  
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [productosData, categoriasData] = await Promise.all([
        listarProductos(),
        listarCategorias()
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
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

  const productosFiltrados = productos.filter(producto => {
    // Filtro por búsqueda
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    // Filtro por categoría 
    const matchesCategory = 
      selectedCategoria === "todas" || 
      String(producto.categoria_id) === String(selectedCategoria);
    
    // Filtro por rango de precio
    const matchesPrice = 
      producto.precio >= rangoPrecio[0] && 
      producto.precio <= rangoPrecio[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
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
      <HStack spacing={2}>
        <FiFilter />
        <Text fontSize="lg" fontWeight="bold">Filtros</Text>
      </HStack>
      
      <Box w="full">
        <Text mb={2}>Categorías</Text>
        <Select 
          value={selectedCategoria}
          onChange={(e) => setSelectedCategoria(e.target.value)}
          sx={{
            '& option': {
              backgroundColor: 'white !important',
              color: 'gray.600'
            }
          }}
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.nombre}
            </option>
          ))}
        </Select>
      </Box>

      <Box w="full">
        <Text mb={2}>Ordenar por</Text>
        <Select
          value={ordenarPor}
          onChange={(e) => setOrdenarPor(e.target.value)}
          sx={{
            '& option': {
              backgroundColor: 'white !important',
              color: 'gray.600'
            }
          }}
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
        <HStack flex={1}>
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            border="2px solid gray"
          />
          {isMobile && (
            <IconButton
              icon={<FiMenu />}
              onClick={onDrawerOpen}
              aria-label="Abrir filtros"
            />
          )}
        </HStack>
      </Flex>

      <HStack align="start" spacing={8}>
        {!isMobile && (
          <Box w="250px">
            <FiltersContent />
          </Box>
        )}

        <Drawer isOpen={isDrawerOpen} placement="right" onClose={onDrawerClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
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
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      noOfLines={2}
                      mb={2}
                    >
                      {producto.nombre}
                    </Text>
                    <Text
                      fontSize="xl"
                      fontWeight="bold"
                      color="blue.600"
                      mb={1}
                    >
                      ${producto.precio.toLocaleString()}
                    </Text>
                    <Text fontSize="sm" color="gray.600" mb={4}>
                      3 cuotas sin interés de ${(producto.precio / 3).toFixed(2)}
                    </Text>
                    <Button
                      colorScheme="blue"
                      w="full"
                      size="lg"
                      leftIcon={<FiShoppingCart />}
                      _hover={{ transform: "scale(1.02)" }}
                    >
                      Agregar al carrito
                    </Button>
                    <Button
                      mt={2}
                      w="full"
                      colorScheme="teal"
                      onClick={() => {
                        setSelectedProduct(producto);
                        onModalOpen();
                      }}
                    >
                      Ver más
                    </Button>
                  </Box>
                ))}
          </Grid>
        </Box>
      </HStack>

      {selectedProduct && (
        <Modal 
          isOpen={isModalOpen} 
          onClose={() => { onModalClose(); setSelectedProduct(null); }} 
          size="xl"
          scrollBehavior="inside"
        >
          {/* Overlay con opacidad más ligera */}
          <ModalOverlay bg="rgba(0, 0, 0, 0.3)" />
          <ModalContent 
            borderRadius="lg" 
            border="2px solid" 
            borderColor="blue.200" 
            boxShadow="xl"
            bg="white"
          >
            <ModalHeader textAlign="center" bg="blue.100" color="blue.700">
              {selectedProduct.nombre}
            </ModalHeader>
            <ModalCloseButton color="blue.700" />
            <ModalBody
              sx={{
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "#E0F7FA", // fondo celeste claro
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#81D4FA", // celeste medio
                  borderRadius: "8px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#4FC3F7", // celeste más oscuro al pasar el mouse
                },
              }}
            >
              <Image
                src={selectedProduct.imagen}
                alt={selectedProduct.nombre}
                borderRadius="md"
                mb={4}
                w="100%"
              />
              <Flex align="center" justify="space-between" mb={4}>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  ${selectedProduct.precio.toLocaleString()}
                </Text>
                {selectedProduct.descuento && (
                  <Badge colorScheme="red" fontSize="lg" p={2}>
                    {selectedProduct.descuento}% OFF
                  </Badge>
                )}
              </Flex>
              <Divider mb={4} />
              <Text fontSize="md" color="black">
                <strong>Descripción: </strong>
                {selectedProduct.descripcion || "No hay descripción disponible para este producto."}
              </Text>
              <Text fontSize="md" color="black" mt={2}>
                <strong>Stock: </strong>
                {selectedProduct.stock || "No hay stock disponible"}
              </Text>
            </ModalBody>
            <ModalFooter justifyContent="center">
              <Button colorScheme="blue" onClick={() => { onModalClose(); setSelectedProduct(null); }}>
                Cerrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default Productos;
