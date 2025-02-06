import React from 'react';
import { Box, Flex, IconButton, Text, Link, HStack, VStack, Input, Button, Image } from '@chakra-ui/react';
import { FaInstagram, FaFacebook, FaPaperPlane } from 'react-icons/fa';
import visa from '../imagenes/visa.png';
import mastercard from '../imagenes/mastercard.png';


const Footer = () => {
  return (
    <Box as="footer" bg="#00CED1" color="#00008B" py={8} px={10} mt={0}>
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="flex-start">
        {/* Métodos de Pago */}
        <VStack align="flex-start" spacing={3}>
          <Text fontWeight="bold">MEDIOS DE PAGO</Text>
          <HStack>
            <Image src={visa} alt="Visa" boxSize="40px" />
            <Image src={mastercard} alt="Mastercard" boxSize="40px" />
          </HStack>
        </VStack>

        {/* Contacto */}
        <VStack align="flex-start" spacing={3}>
          <Text fontWeight="bold">CONTACTANOS</Text>
          <Text>📞 Lorem ipsum dolor</Text>
          <Text>📧 Lorem ipsum dolor sit amet.</Text>
          <Text>📍 Lorem, ipsum dolor.</Text>
        </VStack>

        {/* Redes Sociales */}
        <VStack align="center" spacing={3}>
          <Text fontWeight="bold">REDES SOCIALES</Text>
          <HStack spacing={4}>
            <IconButton icon={<FaInstagram />} aria-label="Instagram" color="#00008B" variant="ghost" fontSize="35px" />
            <IconButton icon={<FaFacebook />} aria-label="Facebook" color="#00008B" variant="ghost" fontSize="35px"/>
          </HStack>
        </VStack>

        {/* Suscripción */}
        <VStack align="flex-start" spacing={3}>
          <Text fontWeight="bold">TE GUSTÓ LO QUE VES?</Text>
          <Text>¡SUSCRIBITE!</Text>
          <HStack>
            <Input placeholder="Email" bg="white" color="black" borderRadius="md" placeholderTextColor="black"/>
            <Button bg="#00008B" color="white" _hover={{ bg: "#4169E1" }}>
              <FaPaperPlane />
            </Button>
          </HStack>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Footer;
