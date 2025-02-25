import React, { useEffect, useState } from 'react';
import { Box, Flex, IconButton, Text, Link, HStack, VStack, Input, Button, Image, Divider } from '@chakra-ui/react';
import { FaInstagram, FaFacebook, FaPaperPlane } from 'react-icons/fa';
import { listarMetodosEnvios, listarMetodosPago } from '../services/api';

const PaymentMethodsSection = ({ methods }) => (
  <VStack align="flex-start" spacing={3}>
    <Text fontWeight="bold">MEDIOS DE PAGO</Text>
    <HStack spacing={4}>
      {methods.map((method) => (
        <Image 
          key={method.id} 
          src={method.imagen} 
          alt={method.nombre} 
          width="50px"
          height="30px" 
          objectFit="contain" 
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
          key={method.id} // Usamos el ID como clave única
          src={method.imagen} // Usamos la URL de la imagen de Cloudinary
          alt={method.nombre} // Usamos el nombre como texto alternativo
          width="60px"
          height="30px" 
          objectFit="contain" 
        />
      ))}
    </HStack>
  </VStack>
);

const ContactSection = () => (
  <VStack align="flex-start" spacing={3}>
    <Text fontWeight="bold">CONTACTANOS</Text>
    <Text>📞 Lorem ipsum dolor</Text>
    <Text>📧 ma.piscinas.pagina@gmail.com</Text>
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
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async (paginaActual, usuariosPorPagina) => {
      try {
        const [pagos, envios] = await Promise.all([
          listarMetodosPago(paginaActual, usuariosPorPagina),
          listarMetodosEnvios(paginaActual, usuariosPorPagina),
        ]);
        setPaymentMethods(pagos.metodosPago);
        setShippingMethods(envios.empresas);
      } catch (error) {
        setError("Error al cargar los datos");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

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