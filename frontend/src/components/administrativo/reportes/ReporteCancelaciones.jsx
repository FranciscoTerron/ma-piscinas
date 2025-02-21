import React from "react";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";

const ReporteCancelaciones = ({ data }) => {
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="md">
      <SimpleGrid columns={2} spacing={4}>
        <Box>
          <Text fontSize="sm">Total Pedidos</Text>
          <Text fontSize="xl" fontWeight="bold">
            {data.total_pedidos}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm">Pedidos Cancelados</Text>
          <Text fontSize="xl" fontWeight="bold">
            {data.pedidos_cancelados}
          </Text>
        </Box>
        <Box>
          <Text fontSize="sm">Porcentaje Cancelados</Text>
          <Text fontSize="xl" fontWeight="bold">
            {data.porcentaje_cancelados}%
          </Text>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default ReporteCancelaciones;