import React from 'react';
import {
  Box,
  VStack,
  Text,
  Image,
} from '@chakra-ui/react';

const QuienesSomos = () => {
    const imagenQuienesSomos = "https://res.cloudinary.com/dytfdvlse/image/upload/v1739234873/samples/man-on-a-escalator.jpg";
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
            {/* Imagen y mensaje de bienvenida */}
            <Box 
              width="full"
              textAlign="center"
            >
              <Image
                src={imagenQuienesSomos} // URL de una imagen de ejemplo
                alt="Imagen de Cuatro Estaciones"
                borderRadius="md"
                mb={6}
              />
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
                  ¡Hola!
                </Text>
                <Text 
                  fontSize="lg" 
                  color="white"
                >
                  Somos Cuatro Estaciones, vendemos desde estufas, radiadores y calderas hasta insumos de pileta, accesorios de jardín y más.
                </Text>
              </Box>
            </Box>

            {/* Descripción de la empresa */}
            <Box 
              p={6} 
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <Text fontSize="md" color="#00008B">
                Brindamos la mejor atención a nuestros clientes, siendo líderes en ventas en el sur de la provincia con lanzamientos de nuevos productos, de las mejores marcas.
              </Text>
            </Box>

            {/* Años de experiencia */}
            <Box 
              p={6} 
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <Text fontSize="md" color="#00008B" fontWeight="bold">
                10 años de experiencia en el mercado.
              </Text>
            </Box>

            {/* Políticas de cambio y devolución */}
            <Box 
              p={6} 
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <Text fontSize="md" color="#00008B">
                Cualquier problema que tenga, tenemos políticas de cambio y devolución. Puede consultar con nosotros a nuestro número o mail que figura en nuestra página.
              </Text>
            </Box>

            {/* Atención personalizada */}
            <Box 
              p={6} 
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <Text fontSize="md" color="#00008B">
                Le ofrecemos atención personalizada en nuestro local, llamando a nuestro número fijo o vía Whatsapp. Presupuestos, imágenes, especificaciones o resolvemos cualquier duda que tenga. ¡Su consulta no nos molesta!
              </Text>
            </Box>

            {/* Dirección del local */}
            <Box 
              p={6} 
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <Text fontSize="md" color="#00008B">
                Nuestro local físico se encuentra en Sarmiento 957, esquina Sarmiento y Fuerte Argentino. ¡Pase a conocernos!
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default QuienesSomos;