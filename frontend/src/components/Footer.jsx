import React from 'react';
import { Box, Flex, IconButton, Text, Link, HStack, VStack, Input, Button, Image, Divider } from '@chakra-ui/react';
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
    <Box as="footer" bg="#00CED1" color="#00008B" py={8} px={10}>
      {/* Primera Sección: Footer Principal */}
      <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="flex-start">
        {/* Métodos de Pago */}
        <VStack align="flex-start" spacing={3}>
          <Text fontWeight="bold">MEDIOS DE PAGO</Text>
          <HStack>
            <Image src={visaUrl} alt="Visa" boxSize="40px" />
            <Image src={mastercardUrl} alt="Mastercard" boxSize="40px" />
            <Image src={pagoFacilUrl} alt="Pago Facil" boxSize="40px" />
            <Image src={naranjaUrl} alt="Naranja" boxSize="40px" />
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
            <IconButton
              as="a"
              href="https://www.instagram.com/mapiscinas.nqn/" 
              target="_blank"
              rel="noopener noreferrer"
              icon={<FaInstagram />}
              aria-label="Instagram"
              color="#00008B"
              variant="ghost"
              fontSize="35px"
            />
            <IconButton
              as="a"
              href="https://www.facebook.com/walapiscinasneuquen?rdid=CGhlMy5bty7fVvCp&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16A6B3QAiR%2F" 
              target="_blank"
              rel="noopener noreferrer"
              icon={<FaFacebook />}
              aria-label="Facebook"
              color="#00008B"
              variant="ghost"
              fontSize="35px"
            />
          </HStack>
        </VStack>


        {/* Suscripción */}
        <VStack align="flex-start" spacing={3}>
          <Text fontWeight="bold">TE GUSTÓ LO QUE VES?</Text>
          <Text>¡SUSCRIBITE!</Text>
          <HStack>
            <Input placeholder="Email" bg="white" color="black" borderRadius="md" />
            <Button bg="#00008B" color="white" _hover={{ bg: "#4169E1" }}>
              <FaPaperPlane />
            </Button>
          </HStack>
        </VStack>
      </Flex>

      <Divider my={6} borderColor="#00008B" />

      {/* Segunda Sección: Creadores y Copyright */}
      <Flex direction="column" align="center" textAlign="center" gap={4}>
        <Flex direction="column" align="center">
          <Text fontWeight="bold" fontSize="22px">Desarrollado por:</Text>
          <HStack spacing={6} mt={2}>
            <Link
              href="https://www.linkedin.com/in/francisco-terron-81b571211/"
              isExternal
              color="#00008B"
              fontWeight="bold"
              _hover={{ textDecoration: "underline" }}
            >
              Francisco Terrón
            </Link>
            <Link
              href="https://www.linkedin.com/in/mauro-san-pedro/"
              isExternal
              color="#00008B"
              fontWeight="bold"
              _hover={{ textDecoration: "underline" }}
            >
              Mauro San Pedro
            </Link>
          </HStack>
        </Flex>
        <Text fontSize="sm">
          Copyright MA - 2025. Todos los derechos reservados. Defensa de los y los consumidores.
        </Text>
        <Flex direction={{ base: "column", md: "row" }} align="center">
          <Text fontSize="sm">
            Para reclamos{" "}
            <Link
              href="https://autogestion.produccion.gob.ar/consumidores"
              color="#00008B"
              fontWeight="bold"
              _hover={{ textDecoration: "underline" }}
            >
              Ingresá acá
            </Link>
          </Text>
          <Button
            as={Link}
            href="/contacto"
            ml={{ base: 0, md: 4 }}
            mt={{ base: 2, md: 0 }}
            size="sm"
            bg="#00008B"
            color="white"
            _hover={{ bg: "#4169E1" }}
          >
            Botón de arrepentimiento
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
