import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Box, Image, Text, VStack, HStack, Button, Skeleton, useToast,
  Grid, GridItem, Divider, Input, Icon, Modal, ModalOverlay, ModalContent, 
  ModalHeader, ModalCloseButton, ModalBody, useBreakpointValue, Badge
} from '@chakra-ui/react';
import { FiTruck } from 'react-icons/fi';
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
  const imageRef = useRef(null);
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const { addToCart } = useCart();

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

  const openModal = () => {
    setIsOpen(true);
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

  const handleAddToCart = () => {
    if (producto.stock >= quantity) {
      addToCart({ ...producto, quantity });
      setProducto(prev => ({ ...prev, stock: prev.stock - quantity }));
      toast({
        title: "Producto agregado",
        description: `Has agregado ${quantity} ${producto.nombre} al carrito`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Error",
        description: "No hay suficiente stock",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const gridColumns = useBreakpointValue({ base: 2, md: 3 });

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6}>
          <Skeleton height="400px" width="100%" />
          <Skeleton height="40px" width="100%" />
          <Skeleton height="20px" width="100%" />
          <Skeleton height="20px" width="100%" />
          <Skeleton height="20px" width="100%" />
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8} color="black">
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
        <GridItem>
          <Box
            position="relative"
            overflow="hidden"
            borderRadius="md"
            ref={imageRef}
            onMouseEnter={() => setShowZoom(true)}
            onMouseLeave={() => setShowZoom(false)}
            onMouseMove={handleMouseMove}
            cursor="zoom-in"
            border="1px"
            borderColor="gray.200"
            height="400px"
            boxShadow="md"
            transition="box-shadow 0.3s ease"
            _hover={{ boxShadow: 'lg' }}
          >
            {producto.descuento && (
              <Badge
                fontSize="0.85rem"
                fontWeight="bold"
                bg="red.500"
                color="white"
                position="absolute"
                top={0}
                left={0}
                m={2}
                px={2}
                py={1}
                borderRadius="md"
                zIndex={1}
              >
                {producto.descuento.tipo === "PORCENTAJE" 
                  ? `${producto.descuento.valor}% OFF` 
                  : producto.descuento.tipo === "CUOTAS_SIN_INTERES" 
                    ? `${producto.descuento.valor} Cuotas sin Interés` 
                    : ""}
              </Badge>
            )}
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              width="100%"
              height="100%"
              objectFit="contain"
              transition="transform 0.3s ease"
              transform={showZoom ? "scale(1.05)" : "scale(1)"}
            />
            {showZoom && (
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="100%"
                bg="rgba(255,255,255,0.2)"
                pointerEvents="none"
              >
                <Box
                  position="absolute"
                  top={`${position.y}%`}
                  left={`${position.x}%`}
                  transform="translate(-50%, -50%)"
                  width="100px"
                  height="100px"
                  border="2px solid"
                  borderColor="blue.500"
                  borderRadius="full"
                  bg="rgba(255,255,255,0.3)"
                  pointerEvents="none"
                />
              </Box>
            )}
          </Box>
          <Box mt={4}>
            <Text fontSize="md" fontWeight="medium" mb={3}>Descripción</Text>
            <Text fontSize="sm" color="gray.700">{producto?.descripcion}</Text>
          </Box>
        </GridItem>

        <GridItem>
          <VStack align="start" spacing={6}>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              {producto.nombre}
            </Text>

            <Box width="100%">
              {producto.descuento?.tipo === "PORCENTAJE" ? (
                <Box>
                  <Text fontSize="3xl" fontWeight="bold" color="red.500">
                    ${(producto.precio * (1 - producto.descuento.valor / 100)).toLocaleString()}
                  </Text>
                  <Text as="span" textDecoration="line-through" color="gray.500">
                    ${producto.precio.toLocaleString()}
                  </Text>
                </Box>
              ) : (
                <Text fontSize="3xl" fontWeight="bold" color="gray.800">
                  ${producto.precio.toLocaleString()}
                </Text>
              )}

              {producto.descuento?.tipo === "CUOTAS_SIN_INTERES" && (
                <Text fontSize="lg" color="green.500" fontWeight="bold" mt={2}>
                  {producto.descuento.valor} cuotas sin interés de {' '}
                  ${(producto.precio / producto.descuento.valor).toLocaleString()}
                </Text>
              )}

              <HStack mt={4} mb={2}>
                <Icon as={FiTruck} color="gray.700" />
                <Text fontSize="sm" color="gray.700">
                  {producto.envioGratis ? 'Envío gratis' : 'Envío calculado al finalizar la compra'}
                </Text>
              </HStack>

              <Divider my={4} />

              <HStack spacing={3} my={4}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  CANTIDAD
                </Text>
                <HStack maxW="120px">
                  <Button
                    size="sm"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    isDisabled={quantity <= 1}
                    colorScheme="blue"
                    variant="outline"
                  >
                    -
                  </Button>
                  <Input
                    size="sm"
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    textAlign="center"
                    width="50px"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    isDisabled={quantity >= producto.stock}
                    colorScheme="blue"
                    variant="outline"
                  >
                    +
                  </Button>
                </HStack>
                <Box ml={4}>
                  <Text fontSize="sm" color="gray.500">
                    {producto.stock > 0 
                      ? `¡Solo quedan ${producto.stock} en stock!` 
                      : 'Producto agotado'}
                  </Text>
                </Box>
              </HStack>

              <Button
                onClick={openModal}
                bg="blue.600"
                color="white"
                fontWeight="bold"
                borderRadius="md"
                py={6}
                width="100%"
                _hover={{ bg: "blue.700" }}
                mb={4}
              >
                Calcular Cuotas
              </Button>

              <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Elige un método de pago</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Grid templateColumns={`repeat(${gridColumns}, 1fr)`} gap={4}>
                      {metodosPago.map(metodo => (
                        <Box
                          key={metodo.id}
                          borderWidth="1px"
                          borderRadius="md"
                          overflow="hidden"
                          cursor="pointer"
                          _hover={{ boxShadow: 'lg' }}
                          onClick={() => handleMetodoClick(metodo.id)}
                        >
                          <Image
                            src={metodo.imagen} 
                            alt={metodo.nombre}
                            boxSize="100px"
                            objectFit="contain"
                            mx="auto"
                            mt={2}
                          />
                          <Text textAlign="center" fontWeight="bold" mt={2} mb={2}>
                            {metodo.nombre}
                          </Text>
                        </Box>
                      ))}
                    </Grid>
                    {cuotas.length > 0 && (
                      <VStack spacing={2} mt={4} align="start">
                        {cuotas.map((cuota, index) => (
                          <Text key={index}>{cuota.descripcion}</Text>
                        ))}
                      </VStack>
                    )}
                  </ModalBody>
                </ModalContent>
              </Modal>

              <Button
                colorScheme="blue"
                size="lg"
                width="100%"
                height="56px"
                borderRadius="md"
                my={4}
                onClick={handleAddToCart}
                isDisabled={producto.stock === 0}
              >
                AGREGAR AL CARRITO
              </Button>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default Producto;