import React from "react";
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const ReporteCostosGanancias = ({ data }) => {
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="md">
      <Heading as="h3" size="md" mb={4}>
        Costos vs Ganancias
      </Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Producto</Th>
            <Th isNumeric>Costo Total</Th>
            <Th isNumeric>Ganancia Total</Th>
            <Th isNumeric>Margen (%)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item) => (
            <Tr key={item.producto_id}>
              <Td>{item.nombre}</Td>
              <Td isNumeric>${item.costo_total.toFixed(2)}</Td>
              <Td isNumeric>${item.ganancia_total.toFixed(2)}</Td>
              <Td isNumeric>{item.margen_ganancia.toFixed(2)}%</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default ReporteCostosGanancias;