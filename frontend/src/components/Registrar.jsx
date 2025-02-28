import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { registrar } from '../services/api';

const Registrar = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registrar(formData);
      toast({
        title: 'Registro exitoso',
        status: 'success',
        duration: 3000,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error en el registro',
        description: error.response?.data?.detail || 'Ocurrió un error',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" bg="white" py={8}>
      <VStack 
        spacing={4} 
        bg="white" 
        p={8} 
        borderRadius={10}
        boxShadow="xl"
        border="2px solid"
        borderColor="#00CED1"
      >
        <Heading color="#00008B">Registro</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel color="#00008B">Nombre</FormLabel>
              <Input
                type="text"
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                borderColor="#00CED1"
                color="#000000"
                _hover={{ borderColor: "#4169E1" }}
                _focus={{ borderColor: "#4169E1", boxShadow: "0 0 0 1px #4169E1" }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="#00008B">Apellido</FormLabel>
              <Input
                type="text"
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                borderColor="#00CED1"
                color="#000000"
                _hover={{ borderColor: "#4169E1" }}
                _focus={{ borderColor: "#4169E1", boxShadow: "0 0 0 1px #4169E1" }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="#00008B">Email</FormLabel>
              <Input
                type="email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                borderColor="#00CED1"
                color="#000000"
                _hover={{ borderColor: "#4169E1" }}
                _focus={{ borderColor: "#4169E1", boxShadow: "0 0 0 1px #4169E1" }}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="#00008B">Teléfono</FormLabel>
              <Input
                type="tel"
                value={formData.telefono}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) { // Permite solo números enteros positivos
                    setFormData({ ...formData, telefono: value });
                  }
                }}
                borderColor="#00CED1"
                color="#000000"
                _hover={{ borderColor: "#4169E1" }}
                _focus={{ borderColor: "#4169E1", boxShadow: "0 0 0 1px #4169E1" }}
              />
              {formData.telefono && !/^\d+$/.test(formData.telefono) && (
                <Text color="red.500" fontSize="sm">
                  Solo se permiten números enteros positivos.
                </Text>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="#00008B">Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  borderColor="#00CED1"
                  color="#000000"
                  minLength={8}
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
              Registrarse
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};

export default Registrar;