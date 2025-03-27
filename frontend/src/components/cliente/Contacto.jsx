import React, { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Text,
  Input,
  Textarea,
  Button,
  HStack,
  Link,
  useToast,
  useBreakpointValue
} from '@chakra-ui/react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import emailjs from "emailjs-com";

const Contacto = () => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });

  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_USER_ID
      )
      .then(
        (response) => {
          toast({
            title: "¡Correo enviado!",
            description: `Correo enviado correctamente.`,
            status: "success",
            duration: 2000,
          });
          setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
        },
        (error) => {
          toast({
            title: "Error",
            description: "No se pudo enviar el correo",
            status: "error",
            duration: 2000,
          });
        }
      );
  };

  return (
    <Box 
      width="100%" 
      minHeight="100vh" 
      mx="auto" 
      p={{ base: 4, md: 8 }}
      bg="#F8FBFD"
    >
      <Box 
        bg="white" 
        p={{ base: 4, md: 8 }}
        borderRadius={10}
        boxShadow={{ base: "md", md: "xl" }}
        border="2px solid"
        borderColor="#00CED1"
      >
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          {/* Información de contacto */}
          <Box 
            width={{ base: "100%", md: "50%" }} 
            pr={{ md: 8 }}
          >
            <VStack spacing={{ base: 4, md: 6 }} align="flex-start">
              <Box 
                bg="#00CED1"
                p={{ base: 4, md: 6 }}
                borderRadius="lg" 
                width="full"
                boxShadow="md"
              >
                <Text 
                  fontSize={{ base: "lg", md: "xl" }} 
                  fontWeight="bold" 
                  color="white"
                >
                  Escríbanos a nuestro WhatsApp o visítenos
                </Text>
                <Text 
                  fontSize={{ base: "sm", md: "lg" }} 
                  color="white"
                >
                  Atendemos con normalidad. Lunes a Viernes de 8:30 a 17:30hs corrido. Sábados de 9:00 a 13:00hs.
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
                <VStack spacing={3} align="flex-start">
                  <Text fontSize={{ base: "sm", md: "md" }} color="#00008B">
                    📞 Lorem ipsum dolor
                  </Text>
                  <Text fontSize={{ base: "sm", md: "md" }} color="#00008B">
                    📧 ma.piscinas.pagina@gmail.com
                  </Text>
                  <Text fontSize={{ base: "sm", md: "md" }} color="#00008B">
                    📍 Lorem, ipsum dolor.
                  </Text>
                  
                  <HStack spacing={2} align="center">
                    <Link 
                      href="https://www.instagram.com/mapiscinas.nqn/" 
                      isExternal 
                      display="flex" 
                      alignItems="center"
                      _hover={{ transform: "scale(1.1)", color: "#E1306C" }}
                    >
                      <FaInstagram size={isMobile ? 20 : 24} color="#E1306C" />
                      {!isMobile && (
                        <Text fontSize="md" color="#00008B" ml={2}>
                          Seguinos en Instagram
                        </Text>
                      )}
                    </Link>
                  </HStack>
                  
                  <HStack spacing={2} align="center">
                    <Link 
                      href="https://www.facebook.com/walapiscinasneuquen?rdid=CGhlMy5bty7fVvCp&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16A6B3QAiR%2F" 
                      isExternal 
                      display="flex" 
                      alignItems="center"
                      _hover={{ transform: "scale(1.1)", color: "#1877F2" }}
                    >
                      <FaFacebook size={isMobile ? 20 : 24} color="#1877F2" />
                      {!isMobile && (
                        <Text fontSize="md" color="#00008B" ml={2}>
                          Seguinos en Facebook
                        </Text>
                      )}
                    </Link>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Formulario de contacto */}
          <Box width={{ base: "100%", md: "50%" }} pl={{ md: 8 }}>
            <Box
              as="form"
              onSubmit={handleSubmit}
              p={{ base: 4, md: 6 }}
              borderRadius="lg"
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
              _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
            >
              <VStack spacing={3} align="stretch">
                <Text fontSize={{ base: "sm", md: "md" }} color="#00008B" fontWeight="bold">
                  NOMBRE
                </Text>
                <Input
                  name="nombre"
                  fontSize={{ base: "sm", md: "md" }}
                  height={{ base: "40px", md: "48px" }}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  bg="white"
                  color="black"
                  borderRadius="md"
                  borderColor="gray.200"
                  _focus={{ borderColor: "#00CED1", boxShadow: "0 0 8px rgba(0, 206, 209, 0.5)" }}
                  transition="all 0.3s ease"
                  required
                />

                <Text fontSize={{ base: "sm", md: "md" }} color="#00008B" fontWeight="bold">
                  EMAIL
                </Text>
                <Input
                  type="email"
                  fontSize={{ base: "sm", md: "md" }}
                  height={{ base: "40px", md: "48px" }}
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  bg="white"
                  color="black"
                  borderRadius="md"
                  borderColor="gray.200"
                  _focus={{ borderColor: "#00CED1", boxShadow: "0 0 8px rgba(0, 206, 209, 0.5)" }}
                  transition="all 0.3s ease"
                  required
                />

                <Text fontSize={{ base: "sm", md: "md" }} color="#00008B" fontWeight="bold">
                  TELÉFONO (OPCIONAL)
                </Text>
                <Input
                  fontSize={{ base: "sm", md: "md" }}
                  height={{ base: "40px", md: "48px" }}
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  bg="white"
                  color="black"
                  borderRadius="md"
                  borderColor="gray.200"
                  _focus={{ borderColor: "#00CED1", boxShadow: "0 0 8px rgba(0, 206, 209, 0.5)" }}
                  transition="all 0.3s ease"
                />

                <Text fontSize={{ base: "sm", md: "md" }} color="#00008B" fontWeight="bold">
                  MENSAJE (OPCIONAL)
                </Text>
                <Textarea
                  fontSize={{ base: "sm", md: "md" }}
                  minHeight={{ base: "100px", md: "120px" }}
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  bg="white"
                  color="black"
                  borderRadius="md"
                  borderColor="gray.200"
                  _focus={{ borderColor: "#00CED1", boxShadow: "0 0 8px rgba(0, 206, 209, 0.5)" }}
                  transition="all 0.3s ease"
                />

                <Button
                  type="submit"
                  bg="#00CED1"
                  height={{ base: "48px", md: "54px" }}
                  fontSize={{ base: "md", md: "lg" }}
                  color="white"
                  _hover={{ bg: "#008B8B", boxShadow: "lg", transform: "scale(1.05)" }}
                  transition="all 0.3s ease"
                  size="lg"
                >
                  Enviar
                </Button>
              </VStack>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Contacto;