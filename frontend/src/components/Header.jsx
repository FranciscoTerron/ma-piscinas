import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, HStack, useToast, Menu, MenuButton, MenuList, MenuItem, IconButton, Heading } from '@chakra-ui/react';
import { HiMenu } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, userRole } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast({
      title: 'Sesión cerrada',
      status: 'success',
      duration: 2000,
    });
    navigate('/login');
  };

  const renderAuthButton = () => {
    if (user) return null;
    
    const isLoginPage = location.pathname === '/login';
    
    return (
      <Button
        as={RouterLink}
        to={isLoginPage ? '/register' : '/login'}
        bg="#00008B"
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
        {isLoginPage ? 'Registro' : 'Iniciar Sesión'}
      </Button>
    );
  };

  return (
    <Box as="nav" bg="#00CED1" p={4} display="flex" alignItems="center">
      <Heading as="h1" size="xl" color="#00008B" flexGrow={1} textAlign="center">
        MA Piscinas
      </Heading>

      <HStack spacing={4}>
        {renderAuthButton()}
        {user && (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Opciones"
              icon={<HiMenu />}
              variant="outline"
              color="#00008B"
              borderColor="#00008B"
              _hover={{
                bg: "#87CEEB",
                transform: 'scale(1.05)',
                transition: 'all 0.2s ease-in-out'
              }}
              _active={{
                bg: "#4169E1",
                transform: 'scale(0.95)'
              }}
            />
            <MenuList bg="white" borderColor="#00008B">
              <MenuItem 
                as={RouterLink} 
                to={userRole === 'cliente' ? "/clienteProfile" : "/panelAdministrativo"}
                _hover={{ bg: "#87CEEB" }}
                color="#00008B"
                bg={"white"}
              >
                Mi Perfil
              </MenuItem>
              <MenuItem 
                onClick={handleLogout} 
                color="red.500"
                bg={"white"}
                _hover={{ bg: "#87CEEB" }}
              >
                Cerrar Sesión
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
    </Box>
  );
};

export default Header;