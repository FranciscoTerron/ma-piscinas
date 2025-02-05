import React from 'react';
import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer'
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes'; 

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Flex 
            direction="column" 
            minHeight="100vh" 
            bg="white" 
          >
            <Header />
            <Box 
              flex="1" 
              bg="white" 
              py={4} 
            >
              <AppRoutes />
            </Box>
            <Footer />
          </Flex>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;