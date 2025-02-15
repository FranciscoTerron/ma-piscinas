import React from 'react';
import { Box, Flex, IconButton, Text, Link, HStack, VStack, Input, Button, Image, Divider } from '@chakra-ui/react';
import { FaInstagram, FaFacebook, FaPaperPlane } from 'react-icons/fa';

const PaymentMethodsSection = ({ methods }) => (
  <VStack align="flex-start" spacing={3}>
    <Text fontWeight="bold">MEDIOS DE PAGO</Text>
    <HStack spacing={4}>
      {methods.map((method) => (
        <Image 
          key={method.name}
          src={method.url} 
          alt={method.name} 
          boxSize="50px" 
        />
      ))}
    </HStack>
  </VStack>
);

const ShippingMethodsSection = ({ methods }) => (
  <VStack align="flex-start" spacing={3}>
    <Text fontWeight="bold">FORMAS DE ENVÍO</Text>
    <HStack spacing={4}>
      {methods.map((method) => (
        <Image 
          key={method.name}
          src={method.url} 
          alt={method.name} 
          boxSize="50px" 
        />
      ))}
    </HStack>
  </VStack>
);

const ContactSection = () => (
  <VStack align="flex-start" spacing={3}>
    <Text fontWeight="bold">CONTACTANOS</Text>
    <Text>📞 Lorem ipsum dolor</Text>
    <Text>📧 Lorem ipsum dolor sit amet.</Text>
    <Text>📍 Lorem, ipsum dolor.</Text>
  </VStack>
);

const SocialMediaSection = () => (
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
        href="https://www.facebook.com/walapiscinasneuquen"
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
);

const NewsletterSection = () => (
  <VStack align="flex-start" spacing={3}>
    <Text fontWeight="bold">TE GUSTÓ LO QUE VES?</Text>
    <Text>¡SUSCRIBITE!</Text>
    <HStack>
      <Input 
        placeholder="Email" 
        bg="white" 
        color="black" 
        borderRadius="md" 
      />
      <Button 
        bg="#00008B" 
        color="white" 
        _hover={{ bg: "#4169E1" }}
      >
        <FaPaperPlane />
      </Button>
    </HStack>
  </VStack>
);

const Footer = () => {
  const paymentMethods = [
    {
      name: "Visa",
      url: "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408267/footer/mddajtiigpizd8dlopni.png"
    },
    {
      name: "Mastercard",
      url: "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408267/footer/otv83x493xgqajegimjq.png"
    },
    {
      name: "Pago Facil",
      url: "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408267/footer/aj9m7pre9d9xd56ijbxe.png"
    },
    {
      name: "Naranja",
      url: "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408267/footer/ohc42blx9ythcbhxg3ap.png"
    }
  ];

  const shippingMethods = [
    {
      name: "Andreani",
      url: "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408279/footer/n1zib3c0kojwankgwnhr.png"
    },
    {
      name: "Cruz del Sur",
      url: "https://res.cloudinary.com/dytfdvlse/image/upload/v1739408279/footer/s0nihtyoobhkesrqi816.png"
    }
  ];

  return (
    <Box as="footer" bg="#00CED1" color="#00008B" py={8} px={10}>
      <Flex 
        direction={{ base: "column", md: "row" }} 
        justify="space-between" 
        align="flex-start" 
        spacing={8}
      >
        <PaymentMethodsSection methods={paymentMethods} />
        <ShippingMethodsSection methods={shippingMethods} />
        <ContactSection />
        <SocialMediaSection />
        <NewsletterSection />
      </Flex>

      <Divider my={6} borderColor="#00008B" />

      <Box mt={4} px={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          align="center"
          justify="space-between"
          gap={4}
        >
          {/* Sección desarrolladores */}
          <Flex align="center">
            <Text fontSize="12px" display="inline">Desarrollado por:
            <Link
              href="https://www.linkedin.com/in/francisco-terron-81b571211/"
              isExternal
              color="blue.600"
              fontWeight="bold"
              fontSize="12px"
              mx={1}
              _hover={{ textDecoration: "underline" }}
            >
              Francisco Terrón
            </Link>
            {" "}y{" "}
            <Link
              href="https://www.linkedin.com/in/mauro-san-pedro/"
              isExternal
              color="blue.600"
              fontWeight="bold"
              fontSize="12px"
              ml={1}
              _hover={{ textDecoration: "underline" }}
            >
              Mauro San Pedro
            </Link>
            </Text>
          </Flex>

          {/* Copyright */}
          <Text fontSize="12px" textAlign="center">
            Copyright MA - 2025. Todos los derechos reservados. Defensa de las y los consumidores.
          </Text>

          {/* Sección reclamos */}
          <Flex align="center">
            <Text fontSize="12px" display="inline">
              Para reclamos{" "}
              <Link
                href="https://autogestion.produccion.gob.ar/consumidores"
                isExternal
                color="blue.600"
                fontWeight="bold"
                _hover={{ textDecoration: "underline" }}
                display="inline"
              >
                Ingresá acá
              </Link>
              {" "}/{" "}
              <Link
                href="/contacto"
                color="blue.600"
                fontWeight="bold"
                _hover={{ textDecoration: "underline" }}
                display="inline"
              >
                Botón de arrepentimiento
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default Footer;