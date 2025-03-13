import React, { useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Flex,
  Box,
  Image,
  Text,
  Badge,
  HStack,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
  Divider,
  useColorModeValue,
  Icon,
  Tooltip,
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import { FiShoppingCart, FiTruck, FiCreditCard, FiPackage, FiHeart, FiShare2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const ProductoModal = ({
  isOpen,
  onClose,
  selectedProduct,
  quantity,
  setQuantity,
  handleAddToCart,
}) => {
  const navigate = useNavigate();

  // Colores dinámicos basados en el modo de color
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const secondaryTextColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const discountBgColor = useColorModeValue("green.500", "green.400");

  // Declarar el hook siempre, sin importar si selectedProduct es null o no
  const handleProductClick = useCallback(() => {
    if (selectedProduct) {
      navigate(`/producto/${selectedProduct.id}`);
    }
  }, [navigate, selectedProduct]);

  // Si no hay producto seleccionado, no se renderiza el modal
  if (!selectedProduct) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" motionPreset="slideInBottom">
      <ModalOverlay backdropFilter="blur(2px)" bg="blackAlpha.600" />
      <ModalContent borderRadius="xl" overflow="hidden" boxShadow="2xl">
        <ModalCloseButton 
          position="absolute" 
          right={4} 
          top={4} 
          zIndex="tooltip" 
          bg={accentColor}
          color="white"
          borderRadius="full"
          size="md"
          _hover={{ bg: "blue.600" }}
        />
        <ModalBody p={0}>
          <Flex direction={{ base: "column", md: "row" }} bg={bgColor}>
            {/* Sección de imagen */}
            <Box 
              w={{ base: "100%", md: "45%" }} 
              p={8} 
              bg="gray.50" 
              position="relative"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                src={selectedProduct.imagen}
                alt={selectedProduct.nombre}
                borderRadius="lg"
                objectFit="contain"
                w="full"
                h="auto"
                maxH="450px"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              />
              {/* Badges posicionados en la esquina superior */}
              <Box position="absolute" top={4} left={4}>
                <HStack spacing={2}>
                  {selectedProduct.descuento && (
                    <Badge colorScheme="red" fontSize="md" px={3} py={1} borderRadius="full">
                      {selectedProduct.descuento.tipo === "PORCENTAJE"
                        ? `-${selectedProduct.descuento.valor}%`
                        : "OFERTA"}
                    </Badge>
                  )}
                  
                  {(selectedProduct.stock || 0) < 5 && (
                    <Badge colorScheme="orange" fontSize="md" px={3} py={1} borderRadius="full">
                      ¡ÚLTIMAS UNIDADES!
                    </Badge>
                  )}
                </HStack>
              </Box>
              
             
            </Box>

            {/* Sección de información */}
            <Box 
              w={{ base: "100%", md: "55%" }} 
              p={8} 
              borderLeft={{ base: "none", md: "1px solid" }}
              borderColor={borderColor}
            >
              {/* Nombre del producto */}
              <Text 
                fontSize={{ base: "2xl", md: "3xl" }} 
                fontWeight="bold" 
                mb={3}
                color={textColor}
                lineHeight="1.2"
              >
                {selectedProduct.nombre}
              </Text>

              {/* Stock */}
              <Flex align="center" mb={4}>
                <Text fontWeight="medium" color={secondaryTextColor} mr={2}>
                  Disponibilidad:
                </Text>
                <Badge 
                  colorScheme={(selectedProduct.stock || 0) > 5 ? "green" : "orange"} 
                  px={3} 
                  py={1} 
                  borderRadius="full"
                  fontSize="sm"
                >
                  {(selectedProduct.stock || 0) > 0 
                    ? `${selectedProduct.stock || 3} ${(selectedProduct.stock || 0) === 1 ? 'Artículo' : 'Artículos'} disponibles` 
                    : "Agotado"}
                </Badge>
              </Flex>

              {/* Banner de descuento */}
              {selectedProduct.descuento && (
                <Box 
                  bg={discountBgColor} 
                  color="white" 
                  p={4} 
                  borderRadius="lg" 
                  my={5}
                  boxShadow="md"
                  position="relative"
                  overflow="hidden"
                >
                  <Box 
                    position="absolute" 
                    top="-15px" 
                    right="-15px" 
                    bg="yellow.400" 
                    transform="rotate(45deg)" 
                    w="80px" 
                    h="30px"
                  />
                  <Text fontSize="lg" fontWeight="bold" textAlign="center">
                    {selectedProduct.descuento.tipo === "PORCENTAJE"
                      ? `¡${selectedProduct.descuento.valor}% de DESCUENTO!`
                      : selectedProduct.descuento.tipo === "CUOTAS_SIN_INTERES"
                      ? `¡${selectedProduct.descuento.valor} Cuotas sin Interés!`
                      : selectedProduct.descuento.tipo === "ENVIO_GRATIS"
                      ? "¡Producto con ENVÍO GRATIS!"
                      : "¡Oferta Especial!"}
                  </Text>
                </Box>
              )}

              <Divider my={5} borderColor={borderColor} />

              {/* Precio y opciones de compra */}
              <Flex 
                justify="space-between" 
                align={{ base: "flex-start", md: "center" }} 
                direction={{ base: "column", md: "row" }} 
                gap={4}
              >
                <Box>
                  {selectedProduct.descuento && selectedProduct.descuento.tipo === "PORCENTAJE" ? (
                    <VStack align="flex-start" spacing={0}>
                      <Text
                        as="span"
                        textDecoration="line-through"
                        color="gray.500"
                        fontSize="lg"
                      >
                        ${selectedProduct.precio.toLocaleString()}
                      </Text>
                      <Text fontSize="3xl" fontWeight="bold" color={accentColor} lineHeight="1">
                        ${(selectedProduct.precio * (1 - selectedProduct.descuento.valor / 100)).toLocaleString()}
                      </Text>
                    </VStack>
                  ) : (
                    <Text fontSize="3xl" fontWeight="bold" color={accentColor}>
                      ${selectedProduct.precio.toLocaleString()}
                    </Text>
                  )}

                  {selectedProduct.descuento && selectedProduct.descuento.tipo === "CUOTAS_SIN_INTERES" && (
                    <Text fontSize="sm" color="green.500" fontWeight="bold" mt={1}>
                      {selectedProduct.descuento.valor} cuotas sin interés de ${(selectedProduct.precio / selectedProduct.descuento.valor).toLocaleString()}
                    </Text>
                  )}
                </Box>

               
              </Flex>

              <Divider my={6} borderColor={borderColor} />

              {/* Beneficios */}
              <Box mb={6}>
                <Text fontSize="lg" fontWeight="bold" mb={3} color={textColor}>
                  Beneficios
                </Text>
                <HStack spacing={4} flexWrap="wrap">
                  {selectedProduct.descuento && selectedProduct.descuento.tipo === "ENVIO_GRATIS" ? (
                    <Tag size="lg" colorScheme="green" borderRadius="full" py={2} px={4}>
                      <TagLeftIcon as={FiTruck} />
                      <TagLabel>Envío Gratis</TagLabel>
                    </Tag>
                  ) : (
                    <Tag size="lg" colorScheme="gray" borderRadius="full" py={2} px={4}>
                      <TagLeftIcon as={FiTruck} />
                      <TagLabel>Envío Rápido</TagLabel>
                    </Tag>
                  )}
                  
                  {selectedProduct.descuento && selectedProduct.descuento.tipo === "CUOTAS_SIN_INTERES" ? (
                    <Tag size="lg" colorScheme="blue" borderRadius="full" py={2} px={4}>
                      <TagLeftIcon as={FiCreditCard} />
                      <TagLabel>{selectedProduct.descuento.valor} Cuotas Sin Interés</TagLabel>
                    </Tag>
                  ) : (
                    <Tag size="lg" colorScheme="gray" borderRadius="full" py={2} px={4}>
                      <TagLeftIcon as={FiCreditCard} />
                      <TagLabel>Múltiples Medios de Pago</TagLabel>
                    </Tag>
                  )}
                  
                  <Tag size="lg" colorScheme="gray" borderRadius="full" py={2} px={4}>
                    <TagLeftIcon as={FiPackage} />
                    <TagLabel>Garantía de 12 meses</TagLabel>
                  </Tag>
                </HStack>
              </Box>

              {/* Descripción */}
              <Box mt={6}>
                <Text fontSize="lg" fontWeight="bold" mb={3} color={textColor}>
                  Descripción
                </Text>
                <Text color={secondaryTextColor} lineHeight="1.7">
                  {selectedProduct.descripcion}
                </Text>
              </Box>

              <Button
                variant="ghost"
                colorScheme="blue"
                mt={6}
                rightIcon={<Text as="span">{"→"}</Text>}
                fontWeight="medium"
                onClick={() => {
                  onClose();
                  handleProductClick();
                }}
                _hover={{ bg: "blue.50", transform: "translateX(4px)" }}
                transition="all 0.2s"
              >
                VER DETALLES COMPLETOS
              </Button>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProductoModal;