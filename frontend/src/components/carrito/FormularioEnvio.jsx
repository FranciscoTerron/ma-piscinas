import { useState } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Divider,
  Flex,
  Grid,
  GridItem,
  VStack,
  HStack,
  useToast,
  Container,
  Radio,
  RadioGroup,
  Badge,
  Image,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from "@chakra-ui/react";
import { FaMapMarkerAlt, FaChevronRight, FaCheck, FaCreditCard } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const FormularioEnvio = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    codigoPostal: "",
    provincia: "Chubut",
    ciudad: "",
    calle: "",
    numero: "",
    departamento: "",
    barrio: "",
    recibirOfertas: true
  });
  
  const [metodoEnvio, setMetodoEnvio] = useState("domicilio");
  const toast = useToast();
  const navigate = useNavigate();

  // Esta sería la información del carrito que normalmente recibirías como prop
  // o cargarías desde una API o contexto global
  const productoEjemplo = {
    nombre: "Hidrolavadora Karcher K3 Black Edition",
    cantidad: 1,
    precio: 260900.00,
    imagen: "/api/placeholder/80/80"
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const validarYContinuar = () => {
    const camposRequeridos = ["nombre", "apellido", "telefono", "email", "codigoPostal", "ciudad", "calle", "numero"];
    for (const campo of camposRequeridos) {
      if (!formData[campo]) {
        toast({
          title: "Campo requerido",
          description: `Por favor completa el campo ${campo}`,
          status: "error",
          duration: 3000,
        });
        return;
      }
    }
    // Simular navegación a la página de pago
    navigate("/pago");
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(monto);
  };

  const costoEnvio = 51229.11;
  const subtotal = productoEjemplo.precio;
  const total = subtotal + costoEnvio;

  return (
    <Container maxW="container.xl" py={6}>

      {/* Main content grid */}
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
        <GridItem>
          {/* Datos de contacto */}
          <Box p={6} bg="white" borderRadius="md" boxShadow="sm" mb={6}>
            <Heading as="h2" size="md" color="gray.700" mb={6}>
              DATOS DE CONTACTO
            </Heading>
            
            <FormControl isRequired mb={4}>
              <FormLabel fontWeight="normal">E-mail</FormLabel>
              <Input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                placeholder="ejemplo@email.com"
                borderRadius="md"
                bg="gray.50"
              />
            </FormControl>
            
            <Checkbox 
              name="recibirOfertas" 
              isChecked={formData.recibirOfertas} 
              onChange={handleInputChange}
              colorScheme="blue"
            >
              Quiero recibir ofertas y novedades por e-mail
            </Checkbox>
          </Box>
          
          {/* Datos del destinatario */}
          <Box p={6} bg="white" borderRadius="md" boxShadow="sm" mb={6}>
            <Heading as="h2" size="md" color="gray.700" mb={6}>
              DATOS DEL DESTINATARIO
            </Heading>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontWeight="normal">Nombre</FormLabel>
                  <Input 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleInputChange}
                    borderRadius="md"
                    bg="gray.50"
                  />
                </FormControl>
              </GridItem>
              
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontWeight="normal">Apellido</FormLabel>
                  <Input 
                    name="apellido" 
                    value={formData.apellido} 
                    onChange={handleInputChange}
                    borderRadius="md"
                    bg="gray.50"
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={2}>
                <FormControl isRequired>
                  <FormLabel fontWeight="normal">Teléfono</FormLabel>
                  <Input 
                    name="telefono" 
                    value={formData.telefono} 
                    onChange={handleInputChange}
                    type="tel"
                    borderRadius="md"
                    bg="gray.50"
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={2}>
                <FormControl isRequired mt={2}>
                  <FormLabel fontWeight="normal">Código Postal</FormLabel>
                  <Input 
                    name="codigoPostal" 
                    value={formData.codigoPostal || "9105"} 
                    onChange={handleInputChange}
                    borderRadius="md"
                    bg="gray.50"
                  />
                </FormControl>
                
                {(formData.codigoPostal || "9105") && (
                  <HStack mt={2} p={2} borderRadius="md" bg="gray.100" spacing={1}>
                    <FaMapMarkerAlt color="gray" />
                    <Text fontSize="sm" color="gray.700">
                      {formData.provincia}
                    </Text>
                    <Button size="xs" colorScheme="blue" variant="link" ml="auto">
                      Cambiar
                    </Button>
                  </HStack>
                )}
              </GridItem>
              
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontWeight="normal">Calle</FormLabel>
                  <Input 
                    name="calle" 
                    value={formData.calle || "dasd"} 
                    onChange={handleInputChange}
                    borderRadius="md"
                    bg="gray.50"
                  />
                </FormControl>
              </GridItem>
              
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontWeight="normal">Número</FormLabel>
                  <Input 
                    name="numero" 
                    value={formData.numero || "34412"} 
                    onChange={handleInputChange}
                    borderRadius="md"
                    bg="gray.50"
                  />
                  <Checkbox size="sm" mt={1}>
                    Sin número
                  </Checkbox>
                </FormControl>
              </GridItem>
              
              <GridItem>
                <FormControl>
                  <FormLabel fontWeight="normal">Departamento (opcional)</FormLabel>
                  <Input 
                    name="departamento" 
                    value={formData.departamento} 
                    onChange={handleInputChange}
                    borderRadius="md"
                    bg="gray.50"
                  />
                </FormControl>
              </GridItem>
              
              <GridItem>
                <FormControl>
                  <FormLabel fontWeight="normal">Barrio (opcional)</FormLabel>
                  <Input 
                    name="barrio" 
                    value={formData.barrio} 
                    onChange={handleInputChange}
                    borderRadius="md"
                    bg="gray.50"
                  />
                </FormControl>
              </GridItem>
              
              <GridItem colSpan={2}>
                <FormControl isRequired>
                  <FormLabel fontWeight="normal">Ciudad</FormLabel>
                  <Input 
                    name="ciudad" 
                    value={formData.ciudad || "D"} 
                    onChange={handleInputChange}
                    borderRadius="md"
                    bg="gray.50"
                  />
                </FormControl>
              </GridItem>
            </Grid>
          </Box>
          
          {/* Método de entrega */}
          <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
            <Heading as="h2" size="md" color="gray.700" mb={6}>
              ENTREGA
            </Heading>
            
            <RadioGroup value={metodoEnvio} onChange={setMetodoEnvio}>
              <VStack align="stretch" spacing={4}>
                <Box 
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor={metodoEnvio === "domicilio" ? "blue.500" : "gray.200"}
                  bg={metodoEnvio === "domicilio" ? "blue.50" : "white"}
                >
                  <Radio value="domicilio" colorScheme="blue">
                    <Flex align="center" justify="space-between" width="100%">
                      <Text fontWeight={metodoEnvio === "domicilio" ? "medium" : "normal"}>
                        Andreani Estándar "Envío a domicilio"
                      </Text>
                      <Text fontWeight="medium">{formatearMonto(costoEnvio)}</Text>
                    </Flex>
                  </Radio>
                </Box>
                
                <Box
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor="gray.200"
                  opacity={0.6}
                >
                  <Radio value="retiro" colorScheme="blue" isDisabled>
                    <Flex align="center" justify="space-between" width="100%">
                      <Text>
                        Retiro en tienda
                      </Text>
                      <Text>Gratis</Text>
                    </Flex>
                  </Radio>
                </Box>
              </VStack>
            </RadioGroup>
            
            <Button 
              mt={4}
              size="sm"
              variant="link"
              color="blue.500"
              onClick={() => {}}
            >
              MÁS OPCIONES
            </Button>
          </Box>
        </GridItem>
        
        {/* Resumen de la compra - columna derecha */}
        <GridItem>
          <Box p={6} bg="white" borderRadius="md" boxShadow="sm" position="sticky" top="20px">
            {/* Producto */}
            <HStack mb={6} spacing={4} align="start">
              <Image 
                src={productoEjemplo.imagen} 
                alt={productoEjemplo.nombre}
                width="80px"
                height="80px"
                objectFit="cover"
                borderRadius="md"
              />
              <Box>
                <Text fontWeight="medium">{productoEjemplo.nombre}</Text>
                <Text fontSize="sm" color="gray.600">
                  x {productoEjemplo.cantidad}
                </Text>
                <Text fontWeight="bold">{formatearMonto(productoEjemplo.precio)}</Text>
              </Box>
            </HStack>
            
            <Divider mb={4} />
            
            {/* Resumen de costos */}
            <VStack spacing={3} align="stretch" mb={6}>
              <Flex justify="space-between">
                <Text>Subtotal</Text>
                <Text>{formatearMonto(subtotal)}</Text>
              </Flex>
              
              <Flex justify="space-between">
                <Text>Costo de envío</Text>
                <Text>{formatearMonto(costoEnvio)}</Text>
              </Flex>
            </VStack>
            
            {/* Total */}
            <Box p={4} bg="gray.50" borderRadius="md" mb={6}>
              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="bold">Total</Text>
                <Text fontSize="lg" fontWeight="bold" color="blue.500">
                  {formatearMonto(total)}
                </Text>
              </Flex>
            </Box>
            
            {/* Código de descuento */}
            <Button 
              leftIcon={<FaCheck />} 
              variant="outline" 
              size="md" 
              width="100%" 
              mb={6}
              borderColor="gray.300"
              color="gray.700"
            >
              Agregar cupón de descuento
            </Button>
            
            {/* Botón de continuar */}
            <Button 
              colorScheme="blue" 
              size="lg"
              width="100%"
              onClick={validarYContinuar}
            >
              Continuar
            </Button>
          </Box>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default FormularioEnvio;