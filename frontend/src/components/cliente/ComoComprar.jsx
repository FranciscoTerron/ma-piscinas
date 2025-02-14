import React from 'react';
import {
  Box,
  VStack,
  Text,
} from '@chakra-ui/react';

const ComoComprar = () => {
  return (
    <Box 
      width="100%" // Ocupa el 100% del ancho disponible
      minHeight="100vh" // Ocupa al menos el 100% del alto de la pantalla
      mx="auto" 
      p={8}
      bg="#F8FBFD" // Fondo claro para toda la pantalla
    >
      <VStack spacing={6} align="stretch">
        <Box 
          bg="white" 
          p={8} 
          borderRadius={10}
          boxShadow="xl"
          border="2px solid"
          borderColor="#00CED1"
        >
          <VStack spacing={4} align="flex-start">
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
                Te explicamos cómo comprar en nuestra página por si tienes alguna duda.
              </Text>
            </Box>
            
            <Box 
              p={6} 
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <Text fontSize="md" color="#00008B">
                ¡Si necesitas ayuda no dudes en contactarte con nosotros!
              </Text>
            </Box>

            <Box 
              p={6} 
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <VStack spacing={4} align="flex-start">
                <Text fontSize="md" color="#00008B" fontWeight="bold">
                  Pasos para comprar:
                </Text>
                <Text fontSize="md" color="#00008B">
                  1. Elige el producto que deseas comprar.
                </Text>
                <Text fontSize="md" color="#00008B">
                  2. Haz clic en el botón "Agregar al carrito". Esto agregará el producto a tu carrito y te llevará al mismo.
                </Text>
                <Text fontSize="md" color="#00008B">
                  3. Si deseas conocer el costo del envío, ingresa tu código postal. Si está disponible el envío a tu ciudad, te aparecerá el monto.
                </Text>
                <Text fontSize="md" color="#00008B">
                  4. Puedes seguir agregando otros productos al carrito y una vez que hayas finalizado, haz clic en "Iniciar Compra".
                </Text>
                <Text fontSize="md" color="#00008B">
                  5. Completa tus datos de contacto y haz clic en "Continuar".
                </Text>
                <Text fontSize="md" color="#00008B">
                  6. Ingresa la dirección a donde deseas recibir el producto. Luego haz clic en "Continuar".
                </Text>
                <Text fontSize="md" color="#00008B">
                  7. Selecciona el método de envío que desees y haz clic en "Continuar".
                </Text>
                <Text fontSize="md" color="#00008B">
                  8. Elige el medio de pago. También puedes seleccionar la opción de "Transferencia bancaria".
                </Text>
                <Text fontSize="md" color="#00008B">
                  9. Una vez que hayas elegido el medio de pago, haz clic en "Continuar".
                </Text>
                <Text fontSize="md" color="#00008B">
                  10. Finalmente, en la página de Confirmación de compra puedes revisar toda la información de la compra. Luego haz clic en "Continuar".
                </Text>
                <Text fontSize="md" color="#00008B">
                  11. Ahí serás redirigido a otra pantalla para que completes los datos sobre la forma de pago elegida. Después de confirmar la compra recibirás un correo de nuestra parte, ese no será un comprobante de pago.
                </Text>
                <Text fontSize="md" color="#00008B">
                  12. Una vez acreditado el pago, haremos el envío correspondiente de los productos que hayas comprado.
                </Text>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default ComoComprar;