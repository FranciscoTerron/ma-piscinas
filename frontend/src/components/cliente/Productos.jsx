import React, { useEffect, useState } from "react";
import { Container, VStack, HStack, Text, Box, Grid, Image, Button, Badge, useToast, Input, Select,
  Skeleton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton,
  useDisclosure, IconButton, RangeSlider, RangeSliderTrack, RangeSliderFilledTrack, RangeSliderThumb,
  Flex, useBreakpointValue, InputGroup, InputLeftElement} from "@chakra-ui/react";
import { FiSearch, FiMenu, FiShoppingCart, FiFilter, FiSliders } from 'react-icons/fi';
import { listarProductos, listarCategorias } from "../../services/api";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("todas");
  const [ordenarPor, setOrdenarPor] = useState("relevancia");
  const [rangoPrecio, setRangoPrecio] = useState([0, 1000000]);
  const { isOpen, onOpen, onClose } = useDisclosure();
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

  const productosFiltrados = productos
    .filter(producto => 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategoria === "todas" || producto.categoria === selectedCategoria) &&
      producto.precio >= rangoPrecio[0] &&
      producto.precio <= rangoPrecio[1]
    )
    .sort((a, b) => {
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
          max={1000000}
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
      <Flex mb={6} gap={4} direction={{ base: "column", md: "row" }}>
        <HStack flex={1}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.500"/>
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
              icon={<FiMenu />}
              onClick={onOpen}
              aria-label="Abrir filtros"
            />
          )}
        </HStack>
      </Flex>

      <HStack align="start" spacing={8}>
        {/* Filtros para desktop */}
        {!isMobile && (
          <Box w="250px">
            <FiltersContent />
          </Box>
        )}

        {/* Drawer de filtros para mobile */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Filtros</DrawerHeader>
            <DrawerBody>
              <FiltersContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        {/* Grid de productos */}
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
                  </Box>
                ))}
          </Grid>
        </Box>
      </HStack>
    </Container>
  );
};

export default Productos;