import React from 'react';
import { Flex, Box, Link, Menu, MenuButton, MenuList, MenuItem, IconButton, useDisclosure } from '@chakra-ui/react';
import { HiMenu } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Navegador = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userRole, isAuthenticated } = useAuth();

  const links = [
    { href: "/panelAdministrativo", text: "PANEL ADMINISTRATIVO", allowedRoles: ["administrador"], requiresAuth: true },
    { href: "/inicio", text: "INICIO" }, // Ruta pública
    { href: "/productos", text: "PRODUCTOS" }, // Ruta pública
    { href: "/comoComprar", text: "CÓMO COMPRAR" }, // Ruta pública
    { href: "/contacto", text: "CONTACTO" }, // Ruta pública
    { href: "/quienesSomos", text: "QUIÉNES SOMOS" }, // Ruta pública
    { href: "/politicasDeDevolucion", text: "POLÍTICA DE DEVOLUCIÓN" }, // Ruta pública
    { href: "/sucursales", text: "NUESTRAS SUCURSALES" }, // Ruta pública

  ];

  // Filtra los enlaces según el rol del usuario y si está autenticado
  const filteredNavItems = links.filter(item => {
    // Si el enlace requiere autenticación y el usuario no está autenticado, no lo mostramos
    if (item.requiresAuth && !isAuthenticated) return false;

    // Si el enlace tiene roles permitidos, verificamos si el rol del usuario está incluido
    if (item.allowedRoles) {
      return item.allowedRoles.includes(userRole);
    }

    // Si no tiene roles permitidos, es una ruta pública y se muestra a todos
    return true;
  });

  return (
    <Box borderTop="2px solid transparent" bgGradient="linear(to-l,cyan.400, blue.500, cyan.400)">
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="0.2rem"
        bg="#00CED1"
        color="black"
      >
        {/* Menú hamburguesa para móviles */}
        <Box display={{ base: 'block', md: 'none' }}>
          <Menu isOpen={isOpen}>
            <MenuButton
              as={IconButton}
              aria-label="Menu"
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
              onClick={isOpen ? onClose : onOpen}
            />
            <MenuList bg="white" borderColor="#00008B">
              {filteredNavItems.map((link, index) => (
                <MenuItem 
                  key={index} 
                  as={Link} 
                  href={link.href} 
                  onClick={onClose}
                  _hover={{ bg: "#87CEEB" }}
                  color="#00008B"
                  bg={"white"}
                >
                  {link.text}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>

        {/* Enlaces para pantallas más grandes */}
        <Box
          display={{ base: 'none', md: 'flex' }}
          width={{ base: 'full', md: 'auto' }}
          justifyContent="center"
          flexGrow={1}
        >
          {filteredNavItems.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              p={2}
              _hover={{
                textDecoration: "none",
                borderBottom: "2px solid",
                borderColor: "blue.500",
              }}
            >
              {link.text}
            </Link>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};

export default Navegador;