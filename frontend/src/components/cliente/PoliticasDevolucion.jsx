import React from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
} from '@chakra-ui/react';

const PoliticasDevolucion = () => {
  return (
    <Box 
      width="100%" 
      minHeight="100vh" 
      mx="auto" 
      p={8}
      bg="#F8FBFD" // Fondo claro para toda la pantalla
    >
      <VStack spacing={6} align="stretch">
        {/* Sección principal */}
        <Box 
          bg="white" 
          p={8} 
          borderRadius={10}
          boxShadow="xl"
          border="2px solid"
          borderColor="#00CED1"
        >
          <VStack spacing={6} align="flex-start">
            {/* Título y mensaje de bienvenida */}
            <Box 
              bg="#00CED1"
              p={6} 
              borderRadius="lg" 
              width="full"
              boxShadow="md"
            >
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                color="white"
              >
                Políticas de Devolución
              </Text>
              <Text 
                fontSize="lg" 
                color="white"
              >
                ¿Qué hacer en caso de requerir una devolución?
              </Text>
            </Box>

            {/* Información sobre devoluciones */}
            <Box 
              p={6} 
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <VStack spacing={4} align="flex-start">
                <Text fontSize="md" color="#00008B">
                  En cualquiera de nuestras tiendas podrás cambiarlo por un producto del mismo valor. En caso de que el producto haya sido enviado y se requiera un cambio, el envío será a cargo del comprador.
                </Text>
                <Text fontSize="md" color="#00008B">
                  Todos los productos poseen una garantía, extendida por el fabricante del producto.
                </Text>
                <Text fontSize="md" color="#00008B">
                  Las devoluciones sólo pueden ser realizadas durante los 15 días siguientes a la compra.
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default PoliticasDevolucion;