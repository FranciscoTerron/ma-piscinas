import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Input, VStack, Heading, useToast, InputGroup,InputRightElement, IconButton, } from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import jwt_decode from 'jwt-decode';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();
  const toast = useToast();
  const { login: authLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials.email, credentials.password);
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        const decodedToken = jwt_decode(response.data.access_token);
        const userId = decodedToken.user_id || decodedToken.sub;
        const userName = decodedToken.user_name || decodedToken.name;
        toast({
          title: 'Inicio de sesión exitoso',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
        authLogin({ email: credentials.email }, response.data.access_token, userId, userName);
        navigate(`/profile`);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Error en el inicio de sesión',
        description: error.response?.data?.detail || 'Credenciales inválidas',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" bg="white" py={8}>
      <VStack 
        spacing={6} 
        bg="white" 
        p={8} 
        borderRadius={10}
        boxShadow="xl"
        border="2px solid"
        borderColor="#00CED1"
      >
        <Heading color="#00008B">Iniciar Sesión</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="#00008B">Email</FormLabel>
              <Input
                type="email"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials({ ...credentials, email: e.target.value })
                }
                color="#000000"
                borderColor="#00CED1"
                _hover={{ borderColor: "#4169E1" }}
                _focus={{ borderColor: "#4169E1", boxShadow: "0 0 0 1px #4169E1" }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="#00008B">Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  color="#000000"
                  borderColor="#00CED1"
                  _hover={{ borderColor: "#4169E1" }}
                  _focus={{ borderColor: "#4169E1", boxShadow: "0 0 0 1px #4169E1" }}
                />
                <InputRightElement>
                  <IconButton
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    color="#00CED1"
                    _hover={{ bg: 'transparent', color: "#4169E1" }}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button 
              type="submit" 
              width="full"
              bg="#00CED1"
              color="white"
              _hover={{
                bg: "#4169E1",
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out',
                boxShadow: '2xl'
              }}
              _active={{
                bg: "#87CEEB",
                transform: 'scale(0.95)'
              }}
            >
              Iniciar Sesión
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Login;