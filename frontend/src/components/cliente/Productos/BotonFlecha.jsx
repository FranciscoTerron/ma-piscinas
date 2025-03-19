import React, { useState, useEffect } from 'react';
import { IconButton, Box } from '@chakra-ui/react';

const BotonFlecha = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    // Ejecutar al montar el componente para establecer el estado inicial
    toggleVisibility();

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <Box position="fixed" bottom={6} right={24} zIndex={50}>
      <IconButton
        aria-label="Volver arriba"
        icon={
          <Box
            as="svg"
            w={8}
            h={8}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </Box>
        }
        bg="blue.600"
        color="white"
        rounded="full"
        shadow="lg"
        _hover={{ bg: "blue.700" }}
        onClick={handleScrollToTop}
      />
    </Box>
  );
};

export default BotonFlecha;
