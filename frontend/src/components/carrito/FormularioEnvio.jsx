import { useState, useEffect } from "react";
import {
  Box, Button, Heading, Text, FormControl, FormLabel, Input, Divider, Flex, Grid, GridItem, VStack, HStack, useToast, Container, Radio, RadioGroup, Image, Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarioPorId, obtenerDireccionesEnvioUsuario, crearDireccionEnvio } from "../../services/api";
import { useAuth } from '../../context/AuthContext';
import FormularioDireccion from "../perfilPersonal/FormularioDireccion"; // Asegúrate de ajustar la ruta según tu estructura

const FormularioEnvio = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    codigoPostal: "",
    provincia: "",
    ciudad: "",
    direccion: "",
  });
  
  const [metodoEnvio, setMetodoEnvio] = useState("domicilio");
  const toast = useToast();
  const navigate = useNavigate();
  const [direcciones, setDirecciones] = useState(null);
  // Estado para la dirección seleccionada (por índice) y para mostrar el formulario de dirección
  const [selectedDireccionIndex, setSelectedDireccionIndex] = useState(0);
  const [mostrarFormularioDireccion, setMostrarFormularioDireccion] = useState(false);
  const { userId } = useAuth();

  const productoEjemplo = {
    nombre: "Hidrolavadora Karcher K3 Black Edition",
    cantidad: 1,
    precio: 260900.00,
    imagen: "/api/placeholder/80/80"
  };
  const costoEnvio = 51229.11;
  const subtotal = productoEjemplo.precio;
  const total = subtotal + costoEnvio;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validarYContinuar = () => {
    const camposRequeridos = ["nombre", "apellido", "telefono", "email", "codigoPostal", "ciudad", "direccion"];
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
    navigate("/pago");
  };

  const formatearMonto = (monto) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(monto);
  };

  // Carga de las direcciones desde la BD
  const cargarDirecciones = async () => {
    try {
      const data = await obtenerDireccionesEnvioUsuario(userId);
      // Si data es un array y tiene al menos una dirección, usamos la primera por defecto
      if (Array.isArray(data) && data.length > 0) {
        setDirecciones(data);
        setSelectedDireccionIndex(0);
        const direccionData = data[0];
        setFormData((prev) => ({
          ...prev,
          codigoPostal: direccionData.codigo_postal || "",
          provincia: direccionData.provincia || "",
          ciudad: direccionData.ciudad || "",
          direccion: direccionData.direccion || "",
        }));
        
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar las direcciones.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Carga de los datos personales del usuario
  const cargarUsuario = async () => {
    try {
      const data = await obtenerUsuarioPorId(userId);
      setFormData((prev) => ({
        ...prev,
        nombre: data.nombre || "",
        apellido: data.apellido || "",
        telefono: data.telefono || "",
        email: data.email || "",
      }));
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la información del usuario.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (userId) {
      cargarUsuario();
      cargarDirecciones();
    }
  }, [userId]);

  // Manejo del cambio de dirección seleccionada en el selector
  const handleDireccionChange = (e) => {
    const index = Number(e.target.value);
    setSelectedDireccionIndex(index);
    const direccionData = direcciones[index];
    console.log("ACA", direccionData);
    setFormData((prev) => ({
      ...prev,
      codigoPostal: direccionData.codigo_postal || "",
      provincia: direccionData.provincia || "",
      ciudad: direccionData.ciudad || "",
      direccion:direccionData.direccion || "",
    }));
  };
  

  const handleGuardarDireccion = async (nuevaDireccion) => {
    try {
      const direccionCreada = await crearDireccionEnvio({
        usuario_id: userId,
        codigo_postal: nuevaDireccion.codigo_postal,
        provincia: nuevaDireccion.provincia,
        ciudad: nuevaDireccion.ciudad,
        direccion: nuevaDireccion.direccion, 
      });
      console.log("Direccion creada:", direccionCreada);
      
      
      setFormData((prev) => ({
        ...prev,
        codigoPostal: direccionCreada?.codigo_postal || nuevaDireccion.codigo_postal,
        provincia: direccionCreada?.provincia || nuevaDireccion.provincia,
        ciudad: direccionCreada?.ciudad || nuevaDireccion.ciudad,
        direccion: direccionCreada?.direccion || direccionCreada?.direccion || nuevaDireccion.direccion,
      }));

      
      
      // Actualizamos la lista de direcciones: si ya existían, agregamos la nueva; de lo contrario, creamos el array
      setDirecciones((prev) => (prev ? [...prev, direccionCreada] : [direccionCreada]));
      
      // Actualizamos el índice para que apunte a la nueva dirección (último elemento)
      setSelectedDireccionIndex((prev) => (prev ? prev.length : 0));
      
      // Ocultamos el formulario de dirección
      setMostrarFormularioDireccion(false);
      cargarDirecciones();

    
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la dirección.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  


  const handleCancelarDireccion = () => {
    setMostrarFormularioDireccion(false);
  };

  return (
    <Container maxW="container.xl" py={6}>
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={8}>
        <GridItem>
          <Box p={6} bg="white" borderRadius="md" boxShadow="sm" mb={6}>
            <Heading as="h2" size="md" color="gray.700" mb={6}>
              DATOS DEL DESTINATARIO
            </Heading>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              {/* Datos personales (no editables) */}
              <GridItem>
                <FormControl isRequired>
                  <FormLabel fontWeight="normal">Nombre</FormLabel>
                  <Input 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleInputChange}
                    borderRadius="md"
                    bg="gray.50"
                    isReadOnly
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
                    isReadOnly
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
                    isReadOnly
                  />
                </FormControl>
              </GridItem>
              
              {/* Si existen direcciones, se muestra el selector y los campos de dirección; si no, se muestra el botón para agregar */}
              {(direcciones && direcciones.length > 0) ? (
                <>
                  {direcciones.length > 1 && (
                    <GridItem colSpan={2}>
                      <FormControl isRequired>
                        <FormLabel fontWeight="normal">Selecciona tu dirección</FormLabel>
                        <Select value={selectedDireccionIndex} onChange={handleDireccionChange}>
                          {direcciones.map((direccion, index) => (
                            <option key={direccion.id || index} value={index}>
                              {direccion.direccion}, {direccion.ciudad}, {direccion.provincia} ({direccion.codigo_postal})
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </GridItem>
                  )}
                  <GridItem colSpan={2}>
                  <FormControl isRequired mt={2}>
                  {!formData.codigoPostal && (
                      <Text mt={2} fontSize="sm">
                        <a 
                          href="https://www.correoargentino.com.ar/formularios/cpa" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: "#3182ce", textDecoration: "underline" }}
                        >
                          No sé mi código postal
                        </a>
                      </Text>
                    )}
                    <FormLabel fontWeight="normal">Código Postal</FormLabel>
                    <Input 
                      name="codigoPostal" 
                      value={formData.codigoPostal} 
                      onChange={handleInputChange}
                      borderRadius="md"
                      bg="gray.50"
                    />
                  </FormControl>

                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <FormLabel fontWeight="normal">Provincia</FormLabel>
                      <Input 
                        name="provincia" 
                        value={formData.provincia} 
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
                        value={formData.ciudad} 
                        onChange={handleInputChange}
                        borderRadius="md"
                        bg="gray.50"
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={2}>
                    <FormControl isRequired>
                      <FormLabel fontWeight="normal">Dirección</FormLabel>
                      <Input 
                        name="direccion" 
                        value={formData.direccion} 
                        onChange={handleInputChange}
                        borderRadius="md"
                        bg="gray.50"
                      />
                    </FormControl>
                  </GridItem>
                </>
              ) : (
                <GridItem colSpan={2}>
                  {mostrarFormularioDireccion ? (
                    <FormularioDireccion
                      onGuardar={handleGuardarDireccion}
                      onCancelar={handleCancelarDireccion}
                    />
                  ) : (
                    <Button onClick={() => setMostrarFormularioDireccion(true)}>
                      Agregar dirección
                    </Button>
                  )}
                </GridItem>
              )}
            </Grid>
          </Box>
          
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
                      <Text>Retiro en tienda</Text>
                      <Text>Gratis</Text>
                    </Flex>
                  </Radio>
                </Box>
              </VStack>
            </RadioGroup>
          </Box>
        </GridItem>
        
        <GridItem>
          <Box p={6} bg="white" borderRadius="md" boxShadow="sm" position="sticky" top="20px">
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
            
            <Box p={4} bg="gray.50" borderRadius="md" mb={6}>
              <Flex justify="space-between" align="center">
                <Text fontSize="lg" fontWeight="bold">Total</Text>
                <Text fontSize="lg" fontWeight="bold" color="blue.500">
                  {formatearMonto(total)}
                </Text>
              </Flex>
            </Box>      
            
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
