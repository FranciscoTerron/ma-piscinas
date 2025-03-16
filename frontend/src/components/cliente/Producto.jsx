import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Box, Image, Text, VStack, HStack, Button, Skeleton, useToast,
  Grid, GridItem, Divider, Input, Icon, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalCloseButton, ModalBody, useBreakpointValue, Badge,
  Tabs, TabList, Tab, TabPanels, TabPanel, Flex, Tag, SimpleGrid, useDisclosure, SkeletonText,
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,useColorModeValue
} from '@chakra-ui/react';
import { FiTruck, FiShield, FiCreditCard, FiPackage, FiHeart, FiShare2, FiShoppingCart } from 'react-icons/fi';
import { obtenerProducto, listarMetodosPago } from '../../services/api';
import { useCart } from "../../context/CartContext";

const Producto = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [selectedMetodo, setSelectedMetodo] = useState('');
  const [cuotas, setCuotas] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [isAdding, setIsAdding] = useState(false); // Estado para evitar múltiples ejecuciones
  const imageRef = useRef(null);
  const toast = useToast();
  const toastRef = useRef({}); // Referencia para evitar toasts duplicados
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { addToCart } = useCart();
  const borderColor = useColorModeValue("gray.200", "gray.700");
  

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true);
        const response = await obtenerProducto(id);
        setProducto(response);
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar el producto",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id, toast]);

  useEffect(() => {
    const cargarMetodosPago = async () => {
      try {
        const response = await listarMetodosPago();
        setMetodosPago(response.metodosPago);
      } catch (error) {
        console.error("Error al cargar métodos de pago", error);
      }
    };
    cargarMetodosPago();
  }, []);

  const calcularCuotas = (metodoId) => {
    const metodo = metodosPago.find(m => m.id === metodoId);
    setCuotas(metodo ? metodo.cuotas : []);
  };

  const handleMetodoClick = (metodoId) => {
    setSelectedMetodo(metodoId);
    calcularCuotas(metodoId);
  };

  const handleMouseMove = (e) => {
    if (imageRef.current) {
      const { left, top, width, height } = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setPosition({ x, y });
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(value, producto?.stock || 1));
    setQuantity(newQuantity);
  };
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
    
  }, [addToCart, toast, isAdding]);

  const gridColumns = useBreakpointValue({ base: 2, md: 3 });
  const isMobile = useBreakpointValue({ base: true, md: false });

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Skeleton height="30px" width="300px" mb={6} />
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
          <GridItem>
            <Skeleton height="450px" width="100%" borderRadius="md" />
            <Box mt={6}>
              <Skeleton height="24px" width="150px" mb={4} />
              <SkeletonText mt={4} noOfLines={4} spacing={4} />
            </Box>
          </GridItem>
          <GridItem>
            <Skeleton height="40px" width="80%" mb={4} />
            <Skeleton height="50px" width="60%" mb={6} />
            <SkeletonText mt={4} noOfLines={2} spacing={4} />
            <Divider my={6} />
            <HStack spacing={4} mb={6}>
              <Skeleton height="40px" width="120px" />
              <Skeleton height="40px" width="120px" />
            </HStack>
            <Skeleton height="50px" width="100%" mb={4} />
            <Skeleton height="60px" width="100%" mb={4} />
          </GridItem>
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8} className="fade-in">
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={{ base: 8, lg: 12 }}>
        <GridItem>
          {/* Imagen única del producto */}
          <Box
            position="relative"
            overflow="hidden"
            borderRadius="xl"
            ref={imageRef}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
            cursor="zoom-in"
            height="450px"
            bg="white"
            boxShadow="sm"
            transition="all 0.3s ease"
            _hover={{ boxShadow: 'md' }}
            mb={4}
          >
            {/* Badge de descuento mejorado */}
            {producto.descuento && (
              <Badge
                fontSize="0.9rem"
                fontWeight="bold"
                bg={
                  producto.descuento.tipo === "ENVIO_GRATIS" 
                    ? "green.500" 
                    : "red.500"
                }
                color="white"
                position="absolute"
                top={0}
                left={0}
                m={3}
                px={3}
                py={1.5}
                borderRadius="lg"
                zIndex={2}
                boxShadow="sm"
              >
                {producto.descuento.tipo === "PORCENTAJE" 
                  ? `${producto.descuento.valor}% OFF` 
                  : producto.descuento.tipo === "CUOTAS_SIN_INTERES" 
                    ? `${producto.descuento.valor} Cuotas sin Interés` 
                    : producto.descuento.tipo === "ENVIO_GRATIS"
                      ? "ENVÍO GRATIS"
                      : ""}
              </Badge>
            )}

            <Image
              src={producto.imagen || "/placeholder-product.jpg"}
              alt={producto.nombre}
              width="100%"
              height="100%"
              objectFit="contain"
              transition="transform 0.3s ease"
              transform={showZoom ? "scale(1.1)" : "scale(1)"}
            />

            {/* Lupa de zoom */}
            {showZoom && (
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                bg="rgba(255,255,255,0.1)"
                pointerEvents="none"
              >
                <Box
                  position="absolute"
                  top={`${position.y}%`}
                  left={`${position.x}%`}
                  transform="translate(-50%, -50%)"
                  width="120px"
                  height="120px"
                  border="2px solid"
                  borderColor="blue.500"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.2)"
                  pointerEvents="none"
                  boxShadow="0 0 0 1px rgba(0,0,0,0.05)"
                />
              </Box>
            )}
          </Box>

          {/* Información detallada en tabs */}
          <Box mt={8}>
            <Tabs colorScheme="blue" variant="enclosed" borderColor="gray.200">
              <TabList>
                <Tab fontWeight="medium">Descripción</Tab>
                <Tab fontWeight="medium">Opiniones</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Text fontSize="sm" color="gray.700" lineHeight="tall">
                    {producto?.descripcion || 'Sin descripción disponible.'}
                  </Text>
                </TabPanel>
                <TabPanel>
                  <Text fontSize="sm" color="gray.600" textAlign="center" py={4}>
                    Aún no hay opiniones para este producto.
                  </Text>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </GridItem>

        <GridItem>
          <VStack align="start" spacing={6}>
            {/* Nombre del producto */}
            <Box width="100%">
              <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                {producto.nombre}
              </Text>
              <Flex align="center" mt={2}>
                <Text fontSize="sm" color="gray.500">Código: PRD-{id}</Text>
                {producto.stock > 0 ? (
                  <Tag size="sm" colorScheme="green" ml={4} borderRadius="full">En stock</Tag>
                ) : (
                  <Tag size="sm" colorScheme="red" ml={4} borderRadius="full">Agotado</Tag>
                )}
              </Flex>
            </Box>

            {/* Precio y descuentos */}
            <Box 
              width="100%" 
              bg="gray.50" 
              p={4} 
              borderRadius="lg" 
              border="1px" 
              borderColor="gray.200"
            >
              {producto.descuento?.tipo === "PORCENTAJE" ? (
                <Box>
                  <HStack spacing={2} align="center">
                    <Text fontSize="sm" fontWeight="medium" color="gray.500">
                      Precio anterior:
                    </Text>
                    <Text as="span" textDecoration="line-through" color="gray.500">
                      ${producto.precio.toLocaleString()}
                    </Text>
                  </HStack>
                  <HStack mt={1} spacing={2} align="center">
                    <Text fontSize="md" fontWeight="bold" color="gray.700">
                      Precio actual:
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="red.500">
                      ${(producto.precio * (1 - producto.descuento.valor / 100)).toLocaleString()}
                    </Text>
                    <Badge colorScheme="red" ml={2}>
                      {producto.descuento.valor}% OFF
                    </Badge>
                  </HStack>
                </Box>
              ) : (
                <HStack spacing={2} align="center">
                  <Text fontSize="md" fontWeight="bold" color="gray.700">
                    Precio:
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                    ${producto.precio.toLocaleString()}
                  </Text>
                </HStack>
              )}

              {producto.descuento?.tipo === "CUOTAS_SIN_INTERES" && (
                <Box 
                  mt={3}
                  p={3}
                  bg="green.50"
                  borderRadius="md"
                  borderLeft="4px"
                  borderColor="green.500"
                >
                  <HStack>
                    <Icon as={FiCreditCard} color="green.500" />
                    <Text fontSize="md" color="green.700" fontWeight="medium">
                      {producto.descuento.valor} cuotas sin interés de{' '}
                      ${(producto.precio / producto.descuento.valor).toLocaleString()}
                    </Text>
                  </HStack>
                </Box>
              )}
            </Box>

            {/* Envío */}
            <Box 
              width="100%" 
              p={4} 
              borderRadius="lg" 
              bg={producto.envioGratis ? "green.50" : "blue.50"}
              border="1px"
              borderColor={producto.envioGratis ? "green.200" : "blue.200"}
            >
              <HStack>
                <Icon 
                  as={FiTruck} 
                  color={producto.envioGratis ? "green.500" : "blue.500"} 
                  boxSize={5}
                />
                <Box>
                  <Text 
                    fontWeight="medium" 
                    color={producto.envioGratis ? "green.700" : "blue.700"}
                  >
                    {producto.envioGratis ? 'Envío gratis a todo el país' : 'Envío a domicilio'}
                  </Text>
                  <Text fontSize="sm" color={producto.envioGratis ? "green.600" : "blue.600"}>
                    {producto.envioGratis 
                      ? 'Recibe en 48-72 horas hábiles' 
                      : 'Costo calculado durante el checkout'}
                  </Text>
                </Box>
              </HStack>
            </Box>
            <Divider my={2} />

            {/* Botones de acción y selección de cantidad */}
          <Box 
            width="100%" 
            borderRadius="xl" 
            p={6} 
            bg="blue.50" 
            borderWidth="1px" 
            borderColor="blue.100"
            boxShadow="sm"
            mt={4}
          >
            {/* Sección de cantidad con stock */}
            <Flex 
              direction={["column", "row"]} 
              alignItems={["flex-start", "center"]} 
              justifyContent="space-between" 
              mb={6}
            >
              <Text 
                fontSize="md" 
                fontWeight="bold" 
                color="gray.700" 
                mb={[2, 0]}
              >
                CANTIDAD
              </Text>
              
              <Flex alignItems="center">
                <NumberInput
                  min={1}
                  max={producto.stock || 10}
                  w="110px"
                  value={quantity}
                  onChange={(valueString) => setQuantity(parseInt(valueString) || 1)}
                  borderRadius="md"
                  borderColor={borderColor}
                  size="md"
                >
                  <NumberInputField fontWeight="bold" />
                  <NumberInputStepper>
                    <NumberIncrementStepper color="blue.500" />
                    <NumberDecrementStepper color="blue.500" />
                  </NumberInputStepper>
                </NumberInput>
                
                {producto.stock > 0 && (
                  <Badge 
                    ml={3} 
                    px={3} 
                    py={1} 
                    borderRadius="full"
                    colorScheme={producto.stock < 5 ? "orange" : "green"}
                    fontSize="xs"
                    fontWeight="medium"
                  >
                    {producto.stock < 5 
                      ? `¡Solo ${producto.stock} unidades!` 
                      : `${producto.stock} disponibles`}
                  </Badge>
                )}
              </Flex>
            </Flex>
            
            {/* Botones de acción */}
            <Flex 
              direction={["column", "row"]} 
              width="100%" 
              gap={4}
            >
              <Button
                flex={["auto", 1]}
                onClick={onOpen}
                bg="white"
                color="blue.600"
                fontWeight="bold"
                borderRadius="lg"
                height="54px"
                borderWidth={2}
                borderColor="blue.500"
                leftIcon={<FiCreditCard size={18} />}
                _hover={{ 
                  bg: "blue.50", 
                  transform: "translateY(-2px)",
                  transition: "all 0.2s ease"
                }}
                _active={{ 
                  transform: "translateY(0)", 
                  bg: "blue.100" 
                }}
              >
                Ver Opciones de Pago
              </Button>
              
              <Button
                flex={["auto", 1.5]}
                colorScheme="blue"
                leftIcon={<FiShoppingCart size={18} />}
                height="54px"
                fontSize="md"
                fontWeight="bold"
                borderRadius="lg"
                boxShadow="0 4px 6px rgba(49, 130, 206, 0.25)"
                bg="linear-gradient(45deg, #3182CE, #4299E1)"
                _hover={{ 
                  boxShadow: "0 6px 12px rgba(49, 130, 206, 0.3)",
                  transform: "translateY(-2px)",
                  bg: "linear-gradient(45deg, #2B6CB0, #3182CE)",
                  transition: "all 0.2s ease"
                }}
                _active={{ 
                  transform: "translateY(0)",
                  boxShadow: "inset 0 3px 5px rgba(0, 0, 0, 0.1)"
                }}
                onClick={() => handleAddToCart(producto, quantity)} 
              >
                AGREGAR AL CARRITO
              </Button>
            </Flex>
          </Box>

            {/* Beneficios adicionales */}
            <Box width="100%" mt={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <HStack 
                  p={3} 
                  borderRadius="md" 
                  bg="gray.50" 
                  borderLeft="3px solid" 
                  borderColor="blue.500"
                >
                  <Icon as={FiShield} color="blue.600" />
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Garantía de 12 meses
                  </Text>
                </HStack>
                <HStack 
                  p={3} 
                  borderRadius="md" 
                  bg="gray.50" 
                  borderLeft="3px solid" 
                  borderColor="blue.500"
                >
                  <Icon as={FiPackage} color="blue.600" />
                  <Text fontSize="sm" fontWeight="medium" color="gray.700">
                    Devolución gratis
                  </Text>
                </HStack>
              </SimpleGrid>
            </Box>
          </VStack>
        </GridItem>
      </Grid>

      {/* Modal de opciones de pago mejorado */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent borderRadius="xl" p={2}>
          <ModalHeader color="gray.700">Elige un método de pago</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Grid templateColumns={`repeat(${gridColumns}, 1fr)`} gap={4}>
              {metodosPago.map(metodo => (
                <Box
                  key={metodo.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  cursor="pointer"
                  transition="all 0.2s"
                  borderColor={selectedMetodo === metodo.id ? "blue.500" : "gray.200"}
                  bg={selectedMetodo === metodo.id ? "blue.50" : "white"}
                  _hover={{ boxShadow: 'md', borderColor: "blue.300" }}
                  onClick={() => handleMetodoClick(metodo.id)}
                  p={3}
                >
                  <Image
                    src={metodo.imagen} 
                    alt={metodo.nombre}
                    boxSize="80px"
                    objectFit="contain"
                    mx="auto"
                    mt={2}
                  />
                  <Text textAlign="center" fontWeight="medium" mt={3} mb={2}>
                    {metodo.nombre}
                  </Text>
                </Box>
              ))}
            </Grid>
            {cuotas.length > 0 ? (
              <Box mt={6} p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="medium" mb={3} color="gray.700">
                  Opciones de pago disponibles:
                </Text>
                <VStack spacing={2} align="start">
                  {cuotas.map((cuota, index) => (
                    <HStack key={index} spacing={3}>
                      <Box 
                        bg="blue.100" 
                        color="blue.700" 
                        borderRadius="full" 
                        fontSize="xs" 
                        fontWeight="bold"
                        minW="20px" 
                        h="20px" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                      >
                        {index + 1}
                      </Box>
                      <Text fontSize="sm">{cuota.descripcion}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            ) : selectedMetodo ? (
              <Box mt={6} p={4} bg="blue.50" borderRadius="md" textAlign="center">
                <Text>Selecciona las cuotas disponibles para este método de pago</Text>
              </Box>
            ) : null}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Producto;