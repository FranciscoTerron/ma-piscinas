import React from 'react';
import {
  Box,
  VStack,
  Text,
  Heading,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { userName } = useAuth();

  return (
    <Box maxW="container.md" mx="auto" p={8}>
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
                Bienvenido, {userName}
              </Text>
            </Box>
            
            {/* Aquí puedes agregar más secciones del perfil */}
            <Box 
              p={6} 
              borderRadius="lg" 
              width="full"
              bg="#F8FBFD"
              border="1px solid"
              borderColor="#87CEEB"
            >
              <Text fontSize="md" color="#00008B">
                ¡Gracias por ser parte de MA Piscinas!
              </Text>
            </Box>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default Profile;