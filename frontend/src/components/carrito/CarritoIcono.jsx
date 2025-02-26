import { IconButton, Badge, Box } from '@chakra-ui/react';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const CarritoIcono = ({ onClick }) => {
    const { cartCount } = useCart();
  
    return (
      <Box position="relative">
        <IconButton
          aria-label="Carrito"
          icon={<FiShoppingCart />}
          onClick={onClick}
          variant="outline"
          color="#00008B"
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
        <Badge
          position="absolute"
          top="0"
          right="0"
          colorScheme="red"
          borderRadius="full"
          variant="solid"
          fontSize="0.8em"
          transform="translate(25%, -25%)"
        >
          {cartCount}
        </Badge>
      </Box>
    );
  };

export default CarritoIcono;