import { useState, useEffect } from "react";
import React from 'react';
import {
  Box, Button, Heading, Text, FormControl, FormLabel, Input, Flex, Grid, GridItem, VStack, HStack, useToast, Container, Radio, RadioGroup, Image, Select,
} from "@chakra-ui/react";
import { obtenerUsuarioPorId, obtenerDireccionesEnvioUsuario, crearDireccionEnvio, listarDetallesCarrito, listarProductos, listarMetodosEnvio } from "../../services/api"; // Importa la API de métodos de envío
import { useAuth } from '../../context/AuthContext';
import FormularioDireccion from "../perfilPersonal/FormularioDireccion";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'

const FormularioEnvio = () => {
  initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {locale: 'es-AR'});
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
  const [preferenceId, setPreferenceId] = useState(null);
  const [botonPresionado, setBotonPresionado] = useState(false);
  const [metodoEnvio, setMetodoEnvio] = useState("");
  const [metodosEnvio, setMetodosEnvio] = useState([]); 
  const [costoEnvio, setCostoEnvio] = useState(0);
  const toast = useToast();
  const [direcciones, setDirecciones] = useState(null);
  const [selectedDireccionIndex, setSelectedDireccionIndex] = useState(0);
  const [mostrarFormularioDireccion, setMostrarFormularioDireccion] = useState(false);
  const { userId } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [productos, setProductos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const subProductosPorPagina = 10; // o la cantidad que necesites
  // Creamos un mapa de productos para acceder más fácilmente
  const productosMap = productos.reduce((acc, producto) => {
    acc[producto.id] = producto;
    return acc;
  }, {});


  const isRecipientDataComplete =
  formData.nombre &&
  formData.apellido &&
  formData.telefono &&
  formData.email &&
  formData.codigoPostal &&
  formData.provincia &&
  formData.ciudad &&
  formData.direccion;
  
  // Calcula subtotal y total; el total será el subtotal más el costo de envío calculado
  const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const total = subtotal + costoEnvio;
 
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
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

  const cargarMetodosEnvio = async () => {
    try {
      const data = await listarMetodosEnvio(paginaActual, subProductosPorPagina);
      // Conservamos los datos de la API; ya no asignamos un costo aleatorio
      setMetodosEnvio(data.empresas || []);
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

  // Calculamos el costo total de envío en base a cada producto del carrito
  useEffect(() => {
    const totalShippingCost = cartItems.reduce((acc, item) => {
      const producto = productosMap[item.producto_id];
      // Si el producto tiene costo de envío, se multiplica por la cantidad; de lo contrario, se suma 0
      const costoPorProducto = producto?.costo_envio ? producto.costo_envio * item.cantidad : 0;
      return acc + costoPorProducto;
    }, 0);
    setCostoEnvio(totalShippingCost);
  }, [cartItems, productos, productosMap]);

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

const crearPreferencia = async () => {
  try {
    const totalPagar = total; // total ya es subtotal + costoEnvio
    const response = await fetch(`http://localhost:8000/crear_preferencia/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ total: totalPagar }), // enviamos el total
    });

    if (!response.ok) {
      const errorData = await response.json(); 
      throw new Error(errorData.detail || 'Error al crear la preferencia de pago');
    }

    const data = await response.json();
    setPreferenceId(data.preference_id);
  } catch (error) {
    console.error('Error:', error);
    toast({
      title: "Error",
      description: error.message,
        status: "error",  
      duration: 5000,
      isClosable: true,
    });
  }
};
  
  
  const handleConfirmarCompra = async () => {
    await crearPreferencia();
    setBotonPresionado(true);
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
                <VStack spacing={3} align="stretch" mb={6} bg="gray.50" p={4} borderRadius="md">
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
              {!botonPresionado && (
                <Button 
                colorScheme="blue" 
                size="lg"
                width="100%"
                onClick={handleConfirmarCompra}
                isDisabled={cartItems.length === 0 || loadingCart || !isRecipientDataComplete}
                boxShadow="md"
                _hover={{
                  boxShadow: "lg",
                  transform: "translateY(-2px)"
                }}
                transition="all 0.3s ease"
                id="wallet_container"
              >
                Confirmar Compra
              </Button>
              
              )}
              {preferenceId && <Wallet initialization={{ preferenceId}} />}
              
              </Box>
          </GridItem>
      </Grid>
    </Container>
  );
};

export default FormularioEnvio;
