import React from 'react';
import { ChakraProvider, Box, Flex, Breadcrumb } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Navegador from './components/Navegador';
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes'; 
import Migaja from './components/Migaja';
import BotonWhatsApp from './components/cliente/BotonWhatsapp';
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Flex direction="column" minHeight="100vh" bg="white">
              <Header />
              <Navegador />
              <Migaja />
              <Box flex="1" bg="white" py={4}>
                <AppRoutes />
              </Box>
              <Footer />
              <BotonWhatsApp />
            </Flex>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;