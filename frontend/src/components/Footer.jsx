import React from 'react';
import { Box, Flex, IconButton, Text, Link, HStack, VStack, Input, Button, Image } from '@chakra-ui/react';
import { FaInstagram, FaFacebook, FaPaperPlane } from 'react-icons/fa';

const Footer = () => {
  // URLs de las imágenes en Cloudinary
  const visaUrl = "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408267/footer/mddajtiigpizd8dlopni.png";
  const mastercardUrl = "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408267/footer/otv83x493xgqajegimjq.png";
  const andreaniUrl = "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408279/footer/n1zib3c0kojwankgwnhr.png";
  const cruzDelSurUrl = "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408279/footer/s0nihtyoobhkesrqi816.png";
  const pagoFacilUrl = "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408267/footer/aj9m7pre9d9xd56ijbxe.png";
  const naranjaUrl = "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408267/footer/ohc42blx9ythcbhxg3ap.png";

  return (
    <Box as="footer" bg="#00CED1" color="#00008B" py={8} px={10} mt={0}>
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="flex-start">
        {/* Métodos de Pago */}
        <VStack align="flex-start" spacing={3}>
          <Text fontWeight="bold">MEDIOS DE PAGO</Text>
          <HStack>
            <Image src={visaUrl} alt="Visa" boxSize="40px" />
            <Image src={mastercardUrl} alt="Mastercard" boxSize="40px" />
            <Image src={pagoFacilUrl} alt="Pago Facil" boxSize="40px" />
            <Image src={naranjaUrl} alt="Naranja" boxSize="40px"/>
          </HStack>
        </VStack>

        {/* Formas de Envío */}
        <VStack align="flex-start" spacing={3}>
          <Text fontWeight="bold">FORMAS DE ENVÍO</Text>
          <HStack>
            <Image src={andreaniUrl} alt="Andreani" boxSize="50px" />
            <Image src={cruzDelSurUrl} alt="Cruz del Sur" boxSize="60px" />

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
