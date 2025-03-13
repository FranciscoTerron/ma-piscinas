import React from "react";
import {
  Box,
  Image,
  Text,
  Badge,
  IconButton,
  VStack,
  Button,
  Flex,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";

const ProductoItem = ({ producto, handleAddToCart, handleOpenModal, handleProductClick }) => {
  // Colores dinámicos basados en el modo de color
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const priceColor = useColorModeValue("blue.600", "blue.300");
  const discountColor = useColorModeValue("red.500", "red.300");
  const installmentColor = useColorModeValue("green.500", "green.300");

  // Calcular precio con descuento si existe
  const precioConDescuento = producto.descuento && producto.descuento.tipo === "PORCENTAJE"
    ? producto.precio * (1 - producto.descuento.valor / 100)
    : producto.precio;
  
  // Calcular valor de cuota si aplica
  const valorCuota = producto.descuento && producto.descuento.tipo === "CUOTAS_SIN_INTERES"
    ? producto.precio / producto.descuento.valor
    : 0;

  return (
    <Box
      borderWidth="1px"
      borderColor={cardBorder}
      borderRadius="lg"
      overflow="hidden"
      p={4}
      position="relative"
      transition="transform 0.3s ease, box-shadow 0.3s ease"
      _hover={{ 
        transform: "translateY(-5px)", 
        boxShadow: "xl" 
      }}
      bg={cardBg}
      height="100%"
      display="flex"
      flexDirection="column"
    >
      {/* Imagen y Badges */}
      <Box position="relative" role="group" mb={4}>
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          borderRadius="md"
          objectFit="cover"
          h="200px"
          w="full"
          fallbackSrc="https://via.placeholder.com/300x200?text=Imagen+no+disponible"
        />
        
        {/* Overlay con botones al hacer hover */}
        <Flex
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          bg="blackAlpha.600"
          opacity="0"
          transition="all 0.3s ease"
          _groupHover={{ opacity: 1 }}
          justifyContent="center"
          alignItems="center"
          borderRadius="md"
        >
          <Tooltip label="Vista rápida" placement="top">
            <IconButton
              aria-label="Vista rápida"
              icon={<FiEye />}
              size="md"
              borderRadius="full"
              colorScheme="blue"
              variant="solid"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenModal(producto);
              }}
              m={1}
            />
          </Tooltip>
        </Flex>
        
        {/* Badges de descuentos/promociones */}
        {producto.descuento && (
          <Badge
            fontSize="0.85rem"
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
            m={2}
            px={2}
            py={1}
            borderRadius="md"
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
      </Box>

      {/* Información del producto */}
      <Box flex="1" display="flex" flexDirection="column">
        <Text 
          fontWeight="bold" 
          fontSize="lg" 
          noOfLines={2} 
          mb={2}
          lineHeight="tight"
        >
          {producto.nombre}
        </Text>
        
        {/* Precios */}
        {producto.descuento && producto.descuento.tipo === "PORCENTAJE" ? (
          <Flex alignItems="center" mb={1}>
            <Text as="span" textDecoration="line-through" color="gray.500" fontSize="md" mr={2}>
              ${producto.precio.toLocaleString()}
            </Text>
            <Text as="span" color={discountColor} fontWeight="bold" fontSize="xl">
              ${precioConDescuento.toLocaleString()}
            </Text>
          </Flex>
        ) : (
          <Text fontSize="xl" fontWeight="bold" color={priceColor} mb={1}>
            ${producto.precio.toLocaleString()}
          </Text>
        )}
        
        {/* Información de cuotas */}
        {producto.descuento && producto.descuento.tipo === "CUOTAS_SIN_INTERES" && (
          <Text fontSize="sm" color={installmentColor} fontWeight="bold" mb={4}>
            {producto.descuento.valor} cuotas sin interés de ${valorCuota.toLocaleString()}
          </Text>
        )}
        
        {/* Espacio flexible para empujar los botones al fondo */}
        <Box flex="1" />
        
        {/* Botones */}
        <VStack spacing={2} w="full" mt={4}>
          <Button
            colorScheme="blue"
            w="full"
            leftIcon={<FiShoppingCart />}
            _hover={{ transform: "scale(1.02)" }}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(producto);
            }}
          >
            Agregar al carrito
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            w="full"
            _hover={{ transform: "scale(1.02)" }}
            onClick={() => handleProductClick(producto)}
          >
            Ver detalles
          </Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default ProductoItem;