import React from 'react';
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
} from '@chakra-ui/react';
import { FaInstagram, FaFacebook } from 'react-icons/fa';

const Contacto = () => {
  return (
    <Box 
      width="100%" 
      minHeight="100vh" 
      mx="auto" 
      p={8}
      bg="#F8FBFD" // Fondo claro para toda la pantalla
    >
      <Box 
        bg="white" 
        p={8} 
        borderRadius={10}
        boxShadow="xl"
        border="2px solid"
        borderColor="#00CED1"
      >
        <Flex direction={{ base: "column", md: "row" }} spacing={8}>
          {/* Información de contacto (lado izquierdo) */}
          <Box 
            width={{ base: "100%", md: "50%" }} 
            pr={{ md: 8 }}
            mb={{ base: 8, md: 0 }}
          >
            <VStack spacing={6} align="flex-start">
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
                  Escríbanos a nuestro WhatsApp o visítenos
                </Text>
                <Text 
                  fontSize="lg" 
                  color="white"
                >
                  Atendemos con normalidad. Lunes a Viernes de 8:30 a 17:30hs corrido. Sábados de 9:00 a 13:00hs.
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
                <Text fontSize="md" color="#00008B" _hover={{ transform: "translateX(5px)", transition: "0.3s ease" }}>
                  📞 Lorem ipsum dolor
                </Text>
                <Text fontSize="md" color="#00008B" _hover={{ transform: "translateX(5px)", transition: "0.3s ease" }}>
                  📧 Lorem ipsum dolor sit amet.
                </Text>
                <Text fontSize="md" color="#00008B" _hover={{ transform: "translateX(5px)", transition: "0.3s ease" }}>
                  📍 Lorem, ipsum dolor.
                </Text>
                    <HStack spacing={2} align="center">
                        <Link 
                        href="https://www.instagram.com/mapiscinas.nqn/" 
                        isExternal 
                        display="flex" 
                        alignItems="center"
                        _hover={{ transform: "scale(1.1)", color: "#E1306C" }} // Color típico de Instagram
                        transition="all 0.3s ease"
                        >
                        <FaInstagram size={24} color= "#E1306C" />
                        <Text fontSize="md" color="#00008B" ml={2}>
                            Seguinos en Instagram
                        </Text>
                        </Link>
                    </HStack>
                    <HStack spacing={2} align="center">
                        <Link 
                        href="https://www.facebook.com/walapiscinasneuquen?rdid=CGhlMy5bty7fVvCp&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16A6B3QAiR%2F" 
                        isExternal 
                        display="flex" 
                        alignItems="center"
                        _hover={{ transform: "scale(1.1)", color: "#1877F2" }} 
                        transition="all 0.3s ease"
                        >
                        <FaFacebook size={24} color="#1877F2" />
                        <Text fontSize="md" color="#00008B" ml={2}>
                            Seguinos en Facebook
                        </Text>
                        </Link>
                    </HStack>
                </VStack>
              </Box>
            </VStack>
          </Box>

          {/* Formulario de contacto (lado derecho) */}
          <Box 
            width={{ base: "100%", md: "50%" }} 
            pl={{ md: 8 }}
          >
            <Box 
                p={6} 
                borderRadius="lg" 
                width="full"
                bg="#F8FBFD"
                border="1px solid"
                borderColor="#87CEEB"
                _hover={{ boxShadow: "lg", transform: "scale(1.02)" }}
                transition="all 0.3s ease"
              >

              <VStack spacing={3} align="stretch">
                <Text fontSize="md" color="#00008B" fontWeight="bold">
                  NOMBRE
                </Text>
                <Input 
                  placeholder="Nombre" 
                  bg="white" 
                  color="black" 
                  borderRadius="md"
                  borderColor="gray.200"
                  _focus={{ borderColor: "#00CED1", boxShadow: "0 0 8px rgba(0, 206, 209, 0.5)" }}
                  transition="all 0.3s ease"
                />

                <Text fontSize="md" color="#00008B" fontWeight="bold">
                  EMAIL
                </Text>
                <Input 
                    placeholder="Email" 
                    bg="white" 
                    color="black" 
                    borderRadius="md"
                    borderColor="gray.200"
                    _focus={{ borderColor: "#00CED1", boxShadow: "0 0 8px rgba(0, 206, 209, 0.5)" }}
                    transition="all 0.3s ease"
                  />

                <Text fontSize="md" color="#00008B" fontWeight="bold">
                  TELÉFONO (OPCIONAL)
                </Text>
                <Input 
                  placeholder="Telefono" 
                  bg="white" 
                  color="black" 
                  borderRadius="md"
                  borderColor="gray.200"
                  _focus={{ borderColor: "#00CED1", boxShadow: "0 0 8px rgba(0, 206, 209, 0.5)" }}
                  transition="all 0.3s ease"
                />

                <Text fontSize="md" color="#00008B" fontWeight="bold">
                  MENSAJE (OPCIONAL)
                </Text>
                <Textarea 
                    placeholder="Nombre" 
                    bg="white" 
                    color="black" 
                    borderRadius="md"
                    borderColor="gray.200"
                    _focus={{ borderColor: "#00CED1", boxShadow: "0 0 8px rgba(0, 206, 209, 0.5)" }}
                    transition="all 0.3s ease"
                  />

                <Button 
                  bg="#00CED1" 
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