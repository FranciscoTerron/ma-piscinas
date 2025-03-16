import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, Button, HStack, useToast, Menu, MenuButton, MenuList, MenuItem, IconButton, 
  Heading, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, 
  ModalBody, Flex, Text, Image
} from '@chakra-ui/react';
import { HiMenu } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CarritoIcono from '../components/carrito/CarritoIcono';
import Carrito from '../components/carrito/Carrito';

import logoMA from '../logo/logoMA.png'

const Header = () => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { refreshCart } = useCart();

  const handleCloseModal = () => {
    refreshCart(); 
    onClose();
  };

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
        to={isLoginPage ? '/registrar' : '/login'}
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
      <Box flexGrow={1} textAlign="center">
        <RouterLink to="/inicio"> 
          <Flex 
            align="center" 
            justify="center" 
            cursor="pointer"
            transition="transform 0.2s ease-in-out"
            _hover={{ transform: "scale(1.1)" }}
          >
            <Image 
              src={logoMA} 
              alt="MA Piscinas" 
              boxSize="60px" 
              objectFit="contain" 
              mr={2}
            />
            <Flex direction="column" align="start">
              <Text 
                fontWeight="bold" 
                fontSize="30px" 
                lineHeight="1" 
                color="#00008B"
              >
                MA
              </Text>
              <Text 
                fontWeight="bold" 
                fontSize="30px" 
                lineHeight="0" 
                color="#00008B"
              >
                PISCINAS
              </Text>
            </Flex>
          </Flex>
        </RouterLink>
      </Box>

      <HStack spacing={4}>
        {renderAuthButton()}

        {user && (
          <>
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
                  to={"/perfilUsuario"}
                  _hover={{ bg: "#87CEEB" }}
                  color="#00008B"
                  bg="white"
                >
                  Mi Perfil
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout} 
                  color="red.500"
                  bg="white"
                  _hover={{ bg: "#87CEEB" }}
                >
                  Cerrar Sesión
                </MenuItem>
              </MenuList>
            </Menu>

            <CarritoIcono onClick={onOpen} />
            
            <Modal isOpen={isOpen} onClose={handleCloseModal} size="3xl">
              <ModalOverlay />
              <ModalContent bg={"blue.50"}>
                <ModalCloseButton color={"black"} />
                <ModalBody pb={6}>
                  <Carrito onClose={handleCloseModal} />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        )}
      </HStack>
    </Box>
  );
};

export default Header;