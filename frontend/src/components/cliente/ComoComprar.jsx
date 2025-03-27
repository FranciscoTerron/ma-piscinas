import React from 'react';
import {
  Box,
  VStack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

const ComoComprar = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const headingSize = useBreakpointValue({ base: "lg", md: "xl" });
  const textSize = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <Box 
      width="100%"
      minHeight="100vh"
      mx="auto" 
      p={{ base: 4, md: 8 }}
      bg="#F8FBFD"
    >
      <VStack spacing={{ base: 4, md: 6 }} align="stretch">
        <Box 
          bg="white" 
          p={{ base: 4, md: 8 }}
          borderRadius={10}
          boxShadow={{ base: "md", md: "xl" }}
          border="2px solid"
          borderColor="#00CED1"
        >
          <VStack spacing={{ base: 3, md: 4 }} align="flex-start">
            <Box 
              bg="#00CED1"
              p={{ base: 4, md: 6 }}
              borderRadius="lg" 
              width="full"
              boxShadow="md"
            >
              <Text 
                fontSize={headingSize}
                fontWeight="bold" 
                color="white"
                lineHeight="tall"
              >
                ¡Hola!
              </Text>
              <Text 
                fontSize={{ base: "md", md: "lg" }}
                color="white"
                lineHeight="tall"
              >
                Te explicamos cómo comprar en nuestra página por si tienes alguna duda.
              </Text>
            </Box>
            
            <Box 
              p={{ base: 3, md: 4 }}
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <Text fontSize={textSize} color="#00008B">
                ¡Si necesitas ayuda no dudes en contactarte con nosotros!
              </Text>
            </Box>

            <Box 
              p={{ base: 4, md: 6 }}
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <VStack spacing={{ base: 3, md: 4 }} align="flex-start">
                <Text fontSize={{ base: "md", md: "lg" }} color="#00008B" fontWeight="bold">
                  Pasos para comprar:
                </Text>
                
                {[...Array(12)].map((_, index) => (
                  <Text 
                    key={index + 1} 
                    fontSize={textSize}
                    color="#00008B"
                    lineHeight="1.6"
                    whiteSpace="pre-line"
                  >
                    {`${index + 1}. ${getStepContent(index + 1)}`}
                  </Text>
                ))}
              </VStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

// Función helper para mejorar la legibilidad
const getStepContent = (step) => {
  const steps = [
    "Elige el producto que deseas comprar.",
    'Haz clic en el botón "Agregar al carrito". Esto agregará el producto a tu carrito y te llevará al mismo.',
    'Si deseas conocer el costo del envío, ingresa tu código postal. Si está disponible el envío a tu ciudad, te aparecerá el monto.',
    'Puedes seguir agregando otros productos al carrito y una vez que hayas finalizado, haz clic en "Iniciar Compra".',
    'Completa tus datos de contacto y haz clic en "Continuar".',
    'Ingresa la dirección a donde deseas recibir el producto. Luego haz clic en "Continuar".',
    'Selecciona el método de envío que desees y haz clic en "Continuar".',
    'Elige el medio de pago. También puedes seleccionar la opción de "Transferencia bancaria".',
    'Una vez que hayas elegido el medio de pago, haz clic en "Continuar".',
    'Finalmente, en la página de Confirmación de compra puedes revisar toda la información de la compra. Luego haz clic en "Continuar".',
    'Ahí serás redirigido a otra pantalla para que completes los datos sobre la forma de pago elegida. Después de confirmar la compra recibirás un correo de nuestra parte, ese no será un comprobante de pago.',
    'Una vez acreditado el pago, haremos el envío correspondiente de los productos que hayas comprado.'
  ];
  
  return steps[step - 1];
};

export default ComoComprar;