import { Box, Text, Flex, Icon } from "@chakra-ui/react";
import { FiTruck } from 'react-icons/fi'; // Asegúrate de importar el ícono correcto

const CalculadorEnvio = ({ costoEnvio }) => {
  return (
    <Box
      width="100%"
      p={4}
      borderRadius="lg"
      bg="white"
      boxShadow="md"
      border="1px"
      borderColor="gray.200"
      transition="all 0.3s ease"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "lg"
      }}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          <Icon 
            as={FiTruck} 
            mr={3} 
            color={costoEnvio !== null ? "blue.500" : "red.500"}
            boxSize={6}
          />
          {costoEnvio !== null ? (
            <Text 
              fontSize="md" 
              fontWeight="semibold" 
              color="gray.800"
            >
              Costo de envío: 
              <Text as="span" color="blue.600" ml={2}>
                ${costoEnvio.toLocaleString()}
              </Text>
            </Text>
          ) : (
            <Text 
              fontSize="md" 
              fontWeight="semibold" 
              color="red.600"
            >
              Costo de envío no disponible
            </Text>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default CalculadorEnvio;