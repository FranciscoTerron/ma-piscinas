import React from 'react';
import { Flex, Box, Link } from '@chakra-ui/react';

const Navegador = () => {
  return (
    <Box borderTop="2px solid transparent" bgGradient="linear(to-l,cyan.400, blue.500, cyan.400)"> {/* Línea encima */}
      <Flex
        as="nav"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="0.2rem"
        bg="#00CED1"
        color="black"
      >
        <Box
          display="flex"
          width={{ base: 'full', md: 'auto' }}
          justifyContent="center" // Centra los enlaces
          flexGrow={1}
        >
          <Link
            href="/inicio"
            p={2}
            _hover={{
              textDecoration: "none",
              borderBottom: "2px solid",
              borderColor: "blue.500",
            }}
          >
            INICIO
          </Link>
          <Link
            href="/productos"
            p={2}
            _hover={{
              textDecoration: "none",
              borderBottom: "2px solid",
              borderColor: "blue.500",
            }}
          >
            PRODUCTOS
          </Link>
          <Link
            href="/comoComprar"
            p={2}
            _hover={{
              textDecoration: "none",
              borderBottom: "2px solid",
              borderColor: "blue.500",
            }}
          >
            CÓMO COMPRAR
          </Link>
          <Link
            href="/contacto"
            p={2}
            _hover={{
              textDecoration: "none",
              borderBottom: "2px solid",
              borderColor: "blue.500",
            }}
          >
            CONTACTO
          </Link>
          <Link
            href="/quienesSomos"
            p={2}
            _hover={{
              textDecoration: "none",
              borderBottom: "2px solid",
              borderColor: "blue.500",
            }}
          >
            QUIÉNES SOMOS
          </Link>
          <Link
            href="/politicasDeDevolucion"
            p={2}
            _hover={{
              textDecoration: "none",
              borderBottom: "2px solid",
              borderColor: "blue.500",
            }}
          >
            POLÍTICA DE DEVOLUCIÓN
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};

export default Navegador;