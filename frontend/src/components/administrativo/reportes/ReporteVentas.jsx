import React from "react";
import { Box, Heading, Text, Flex, Stack, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        bg="white"
        p={3}
        borderRadius="md"
        boxShadow="lg"
        border="1px"
        borderColor="gray.200"
      >
        <Text fontWeight="bold" mb={2}>{label}</Text>
        {payload.map((entry, index) => (
          <Text key={index} color={entry.color}>
            {entry.name}: {entry.value.toLocaleString()}
          </Text>
        ))}
      </Box>
    );
  }
  return null;
};

const ReporteVentas = ({ data }) => {
  // Calculate percentage change from previous period
  const calculateChange = () => {
    if (data.length < 2) return null;
    const current = data[data.length - 1].total_ventas;
    const previous = data[data.length - 2].total_ventas;
    return ((current - previous) / previous) * 100;
  };

  const totalVentas = data.reduce((sum, item) => sum + item.total_ventas, 0);
  const totalPedidos = data.reduce((sum, item) => sum + item.cantidad_pedidos, 0);
  const percentChange = calculateChange();

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="xl"
      border="1px"
      borderColor="gray.100"
    >
      <Stack spacing={6}>
        <Flex justify="space-between" align="center">
          <Heading as="h3" size="lg" color="gray.700">
            📈 Reporte de Ventas
          </Heading>
          
          <Flex gap={4}>
            <Stat>
              <StatLabel color="gray.600">Total Ventas</StatLabel>
              <StatNumber color="blue.600">
                ${totalVentas.toLocaleString()}
              </StatNumber>
              {percentChange && (
                <StatHelpText>
                  <StatArrow type={percentChange >= 0 ? "increase" : "decrease"} />
                  {Math.abs(percentChange).toFixed(1)}%
                </StatHelpText>
              )}
            </Stat>
            
            <Stat>
              <StatLabel color="gray.600">Total Pedidos</StatLabel>
              <StatNumber color="teal.600">
                {totalPedidos.toLocaleString()}
              </StatNumber>
            </Stat>
          </Flex>
        </Flex>

        {data.length === 0 ? (
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            h="300px"
            bg="gray.50"
            borderRadius="lg"
          >
            <Text fontSize="xl" color="gray.400" mb={2}>
              No hay datos disponibles
            </Text>
            <Text color="gray.500">
              Selecciona un rango de fechas diferente
            </Text>
          </Flex>
        ) : (
          <Box h="400px">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis 
                  dataKey="periodo" 
                  tick={{ fill: '#4A5568' }}
                  tickLine={{ stroke: '#4A5568' }}
                />
                <YAxis 
                  tick={{ fill: '#4A5568' }}
                  tickLine={{ stroke: '#4A5568' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="total_ventas" 
                  fill="#4299E1" 
                  name="Total Ventas"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="cantidad_pedidos" 
                  fill="#38B2AC" 
                  name="Pedidos"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ReporteVentas;