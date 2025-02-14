import React from 'react';
import { Box, IconButton, Tooltip } from '@chakra-ui/react';
import { FaWhatsapp } from 'react-icons/fa';

const BotonWhatsApp = () => {
  const whatsappNumber = '1234567890'; // Reemplaza con tu número de WhatsApp
  const message = 'Hola, me gustaría obtener más información.'; // Mensaje predeterminado

  const handleClick = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Box 
      position="fixed" 
      bottom="180px" // Subido más arriba (antes era 20px)
      right="5px" 
      zIndex="1000"
    >
      <Tooltip label="Chatea con nosotros" aria-label="WhatsApp">
        <IconButton
          aria-label="WhatsApp"
          icon={<FaWhatsapp fontSize="1.5rem" color='white'/>} // Icono más grande
          size="xl" // Tamaño más grande (antes era lg)
          colorScheme="green" // Color verde personalizado
          isRound
          onClick={handleClick}
          boxShadow= '0 4px 12px rgba(0, 0, 0, 0.69)'
          sx={{
            width: '40px', // Botón más grande
            height: '40px', // Botón más grande
            bg: '#25D366', // Color de WhatsApp
            transition: 'all 0.3s ease',
            _hover: {
              transform: 'scale(1.1)', // Efecto de escala al pasar el mouse
              bg: '#22c35e', // Color verde más oscuro al hover
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)', // Sombra al hover
            }
          }}
        />
      </Tooltip>
    </Box>
  );
};

export default BotonWhatsApp;