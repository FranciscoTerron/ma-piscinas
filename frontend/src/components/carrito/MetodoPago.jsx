import React, { useState, useEffect } from "react";
import { Box, Heading, Radio, RadioGroup, VStack, Text, Flex, useToast, Image } from "@chakra-ui/react";
import { listarMetodosPago } from "../../services/api";

const MetodosPago = () => {
  const [metodosPago, setMetodosPago] = useState([]);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState("");
  const toast = useToast();
  const [paginaActual, setPaginaActual] = useState(1);
  const subPagosPorPagina = 10;

  // Cargar los métodos de pago desde la BD
  const cargarMetodosPago = async () => {
    try {
      const data = await listarMetodosPago(paginaActual, subPagosPorPagina);
      setMetodosPago(data.metodosPago);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar los métodos de pago.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    cargarMetodosPago();
  }, []);

  return (
    <Box p={6} bg="white" borderRadius="lg" boxShadow="md" mt={6}>
      <Heading as="h2" size="md" color="gray.700" mb={6} borderBottom="2px solid" borderColor="blue.500" pb={2}>
        PAGO
      </Heading>

      <RadioGroup value={metodoSeleccionado} onChange={setMetodoSeleccionado}>
        <VStack align="stretch" spacing={4}>
          {metodosPago.map((metodo) => (
            <Box
              key={metodo.id}
              p={4}
              borderRadius="md"
              borderWidth="1px"
              borderColor={metodoSeleccionado === metodo.id ? "blue.500" : "gray.200"}
              bg={metodoSeleccionado === metodo.id ? "blue.50" : "white"}

            >
              <Radio value={metodo.id} colorScheme="blue">
                <Flex align="center" justify="space-between" width="100%">

                  {/* Imagen del método de pago */}
                  {metodo.imagen && (
                    <Image
                      src={metodo.imagen}
                      width="50px" // Aumenté el tamaño de la imagen
                      height="40px"
                      borderRadius="md"
                      ml={4} // Margen izquierdo para separar el texto de la imagen
                    />
                  )}
                </Flex>
              </Radio>
            </Box>
          ))}
        </VStack>
      </RadioGroup>
    </Box>
  );
};

export default MetodosPago;