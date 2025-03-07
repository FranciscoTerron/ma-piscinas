import { useState, useEffect } from "react";
import React from 'react';
import {
  Box, Button, Heading, Text, FormControl, FormLabel, Input, Divider, Flex, Grid, GridItem, VStack, HStack, useToast, Container, Radio, RadioGroup, Image, Select,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarioPorId, obtenerDireccionesEnvioUsuario, crearDireccionEnvio, listarDetallesCarrito, listarProductos, listarMetodosEnvio } from "../../services/api"; // Importa la API de métodos de envío
import { useAuth } from '../../context/AuthContext';
import FormularioDireccion from "../perfilPersonal/FormularioDireccion";
import MetodosPago from "./MetodoPago";

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
  const [metodosEnvio, setMetodosEnvio] = useState([]); // Estado para almacenar los métodos de envío
  const toast = useToast();
  const navigate = useNavigate();
  const [direcciones, setDirecciones] = useState(null);
  const [selectedDireccionIndex, setSelectedDireccionIndex] = useState(0);
  const [mostrarFormularioDireccion, setMostrarFormularioDireccion] = useState(false);
  const { userId } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const subProductosPorPagina = 10; // o la cantidad que necesites
  const productosMap = productos.reduce((acc, producto) => {
    acc[producto.id] = producto;
    return acc;
  }, {});

   // Calcula los totales dinámicamente
   const costoEnvio = 51229.11;
   const subtotal = cartItems.reduce((acc, item) => acc + (item.subtotal), 0);
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

  // Carga de los métodos de envío desde la BD
  const cargarMetodosEnvio = async () => {
    try {
      const data = await listarMetodosEnvio(paginaActual, subProductosPorPagina);
  
      // Accede a la propiedad "empresas" dentro de "data"
      const empresas = data.empresas;
  
      // Asignar un costo aleatorio a cada método de envío
      const metodosConCosto = empresas.map(empresa => ({
        ...empresa,
        costo: Math.floor(Math.random() * 10000) + 1000, // Costo aleatorio entre 1000 y 11000
      }));
  
      setMetodosEnvio(metodosConCosto); // Actualiza el estado con los métodos de envío
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar los métodos de envío.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const cargarProductos = async () => {
    try {
      const data = await listarProductos(paginaActual, subProductosPorPagina);
      setProductos(data.productos);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar los productos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Agrega esta función para cargar el carrito
  const cargarCarrito = async () => {
    try {
      const data = await listarDetallesCarrito();
      setCartItems(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el carrito",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoadingCart(false);
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
      cargarCarrito();
      cargarProductos();
      cargarMetodosEnvio(); 
    }
  }, [userId, paginaActual]);

  // Manejo del cambio de dirección seleccionada en el selector
  const handleDireccionChange = (e) => {
    const index = Number(e.target.value);
    setSelectedDireccionIndex(index);
    const direccionData = direcciones[index];
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
    <Container maxW="container.xl" py={6} px={4}>
    <Grid 
      templateColumns={{ base: "1fr", md: "1fr 1fr" }} 
      gap={8}
      position="relative"
    >
      <GridItem>
        <Box 
          p={6} 
          bg="white" 
          borderRadius="lg" 
          boxShadow="md" 
          mb={6}
          transition="all 0.3s ease"
          _hover={{
            boxShadow: "lg",
            transform: "translateY(-5px)"
          }}
        >
          <Heading 
            as="h2" 
            size="md" 
            color="gray.700" 
            mb={6} 
            borderBottom="2px solid" 
            borderColor="blue.500" 
            pb={2}
          >
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
          
       
        {/* Sección de entrega */}
        <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
          <Heading as="h2" size="md" color="gray.700" mb={6} borderBottom="2px solid" borderColor="blue.500" pb={2}>
            ENTREGA
          </Heading>
          <RadioGroup value={metodoEnvio} onChange={setMetodoEnvio}>
            <VStack align="stretch" spacing={4}>
              {metodosEnvio.map((metodo) => (
                <Box
                  key={metodo.id}
                  p={4}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={metodoEnvio === metodo.id ? "blue.500" : "gray.200"}
                  bg={metodoEnvio === metodo.id ? "blue.50" : "white"}
                >
                  <Radio value={metodo.id} colorScheme="blue">
                    <Flex align="center" justify="space-between" width="100%">
                      <Text fontWeight={metodoEnvio === metodo.id ? "medium" : "normal"}>
                        {metodo.nombre}
                      </Text>
                      <Text fontWeight="medium">{formatearMonto(metodo.costo)}</Text>
                    </Flex>
                  </Radio>
                </Box>
              ))}
            </VStack>
          </RadioGroup>
        </Box>

        {/* Sección de pago */}
        <MetodosPago />
      </GridItem>
        
          <GridItem>
            <Box 
              p={6} 
              bg="white" 
              borderRadius="lg" 
              boxShadow="md" 
              position="sticky" 
              top="20px"
              transition="all 0.3s ease"
              _hover={{
                boxShadow: "lg",
                transform: "translateY(-5px)"
              }}
            >
              {loadingCart ? (
                <Text textAlign="center" color="gray.500">Cargando productos...</Text>
              ) : cartItems.length === 0 ? (
                <Text textAlign="center" color="gray.500">No hay productos en el carrito</Text>
              ) : (
                <>
                  {/* Lista de productos */}
                  {cartItems.map((item) => {
                    const producto = productosMap[item.producto_id]; // Asumimos que hay un producto_id
                    if (!producto) return null; // Si no se encuentra el producto, no renderizamos nada

                    return (
                      <Box 
                        key={item.id} 
                        mb={4} 
                        display="flex" 
                        alignItems="center"
                        bg="gray.50" 
                        p={3} 
                        borderRadius="md"
                      >
                        <Image 
                          src={producto.imagen || "/imagen-placeholder.jpg"} 
                          alt={producto.nombre} 
                          width="80px" 
                          height="80px"
                          objectFit="cover"
                          borderRadius="md"
                          mr={4}
                        />
                        <HStack align="start" spacing={1}>
                          <Text fontWeight="medium" mr="2">Nombre: {producto.nombre}</Text>
                          <Text fontWeight="medium" mr="2">Cantidad: {item.cantidad}</Text>
                          <Text fontWeight="medium">Subtotal: {formatearMonto(item.subtotal)}</Text>
                        </HStack>
                      </Box>
                    );
                  })}

                  {/* Resumen de costos */}
                  <VStack 
                    spacing={3} 
                    align="stretch" 
                    mb={6} 
                    bg="gray.50" 
                    p={4} 
                    borderRadius="md"
                  >
                    <Flex justify="space-between">
                      <Text color="gray.600">Subtotal</Text>
                      <Text fontWeight="medium">{formatearMonto(subtotal)}</Text>
                    </Flex>
                    <Flex justify="space-between">
                      <Text color="gray.600">Costo de envío</Text>
                      <Text fontWeight="medium">{formatearMonto(costoEnvio)}</Text>
                    </Flex>
                  </VStack>

                  <Box 
                    p={4} 
                    bg="blue.50" 
                    borderRadius="md" 
                    mb={6}
                    border="1px solid"
                    borderColor="blue.100"
                  >
                    <Flex justify="space-between" align="center">
                      <Text fontSize="lg" fontWeight="bold" color="gray.700">Total</Text>
                      <Text 
                        fontSize="lg" 
                        fontWeight="bold" 
                        color="blue.600"
                      >
                        {formatearMonto(total)}
                      </Text>
                    </Flex>
                  </Box>
                </>
              )}
              
              <Button 
                colorScheme="blue" 
                size="lg"
                width="100%"
                onClick={validarYContinuar}
                isDisabled={cartItems.length === 0 || loadingCart}
                boxShadow="md"
                _hover={{
                  boxShadow: "lg",
                  transform: "translateY(-2px)"
                }}
                transition="all 0.3s ease"
              >
                Confirmar Compra
              </Button>
            </Box>
          </GridItem>
      </Grid>
    </Container>
  );
};

export default FormularioEnvio;
