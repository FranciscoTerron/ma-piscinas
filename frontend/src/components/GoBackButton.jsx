import React from 'react';
import { Button, Icon } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const GoBackButton = ({ label = "", ...props }) => {
  const navigate = useNavigate();

  return (
    <Button 
      leftIcon={<Icon as={FaArrowLeft} w={4} h={4} />}
      onClick={() => navigate(-1)} 
      {...props}
      bg="white"
      color="gray.700"
      size="md"
      fontSize="sm"
      fontWeight="medium"
      px={4}
      borderRadius="lg"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      _hover={{
        bg: 'gray.50',
        borderColor: 'gray.300',
        transform: 'translateY(-1px)',
        boxShadow: 'md',
      }}
      _active={{
        bg: 'gray.100',
        transform: 'translateY(0)',
        boxShadow: 'sm',
      }}
      transition="all 0.2s"
    >
      {label}
    </Button>
  );
};

export default GoBackButton;