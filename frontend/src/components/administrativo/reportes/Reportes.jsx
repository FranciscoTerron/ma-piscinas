import React, { useEffect, useState } from "react";
import { 
  Box, Grid, Spinner, Text, Container, HStack, Select, Input, 
  Button, GridItem, Card, CardBody, Stack, useToast,
  Heading, Flex, VStack, Badge
} from "@chakra-ui/react";
import { obtenerUsuarioMasActivo, obtenerVentasPorPeriodo, obtenerMetricasCancelaciones, 
  obtenerEstacionalidadProductos, obtenerCostosGanancias } from "../../../services/api";
import ReporteUsuarioMasActivo from "./ReporteUsuarioMasActivo";
import ReporteVentas from "./ReporteVentas";
import ReporteCancelaciones from "./ReporteCancelaciones";
import ReporteEstacionalidad from "./ReporteEstacionalidad";
import ReporteCostosGanancias from "./ReporteCostosGanancias";
import GoBackButton from '../../GoBackButton';

const Reportes = () => {
  const [usuarioMasActivo, setUsuarioMasActivo] = useState(null);
  const [ventas, setVentas] = useState([]);
  const [cancelaciones, setCancelaciones] = useState({});
  const [estacionalidad, setEstacionalidad] = useState([]);
  const [costosGanancias, setCostosGanancias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [tipoPeriodo, setTipoPeriodo] = useState("mensual");
  const [fechaInicio, setFechaInicio] = useState("2024-01-01");
  const [fechaFin, setFechaFin] = useState(new Date().toISOString().split("T")[0]);
  
  const toast = useToast();

  const cargarDatos = async () => {
    // Validación de fechas
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      toast({
        title: "Error en las fechas",
        description: "La fecha de inicio no puede ser posterior a la fecha final",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setCargando(true);
    try {
      const usuario = await obtenerUsuarioMasActivo();
      const ventasData = await obtenerVentasPorPeriodo(tipoPeriodo, fechaInicio, fechaFin);
      const cancelacionesData = await obtenerMetricasCancelaciones(3);
      const estacionalidadData = await obtenerEstacionalidadProductos(2025);
      const costosData = await obtenerCostosGanancias();
        
      setCostosGanancias(costosData);
      setEstacionalidad(estacionalidadData);
      setCancelaciones(cancelacionesData);
      setUsuarioMasActivo(usuario);
      setVentas(ventasData);
      
      toast({
        title: "Datos actualizados",
        description: "Los reportes se han actualizado correctamente",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error cargando reportes:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos. Intente nuevamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <Container maxW="container.xl" py={8} color="black">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <HStack spacing={4}>
            <GoBackButton />
              <VStack align="flex-start" spacing={0}>
                <HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                    📊 Panel de Reportes
                  </Text>
                </HStack>
                <Text color="gray.500" fontSize="sm">
                  Visualiza y analiza el rendimiento de tu negocio
                </Text>
              </VStack>
            </HStack>
          </HStack>
          {/* Main Content */}
          <Box p={6}>
            {cargando ? (
              <Flex direction="column" align="center" justify="center" py={20}>
                <Spinner 
                  size="xl" 
                  color="blue.500" 
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                />
                <Text mt={4} fontSize="lg" color="gray.600" fontWeight="medium">
                  Cargando reportes...
                </Text>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  Esto puede tomar unos segundos
                </Text>
              </Flex>
            ) : (
              <Grid 
                templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} 
                gap={8}
              >
                <GridItem>
                  {/* Filtros Card */}
                  <Card 
                    bg="white" 
                    shadow="lg" 
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.100"
                  >
                    <CardBody>
                      <Flex align="center" mb={4}>
                        <Text fontSize="xl" fontWeight="bold" color="gray.700">
                          📅 Filtros de Búsqueda
                        </Text>
                        <Badge ml={3} colorScheme="blue">
                          {tipoPeriodo}
                        </Badge>
                      </Flex>

                      <Stack spacing={4} color={"black"}>
                        <Select 
                          value={tipoPeriodo} 
                          onChange={(e) => setTipoPeriodo(e.target.value)}
                          size="lg"
                          bg="white"
                          borderColor="gray.300"
                          _hover={{ borderColor: "blue.400" }}
                          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                          icon={<span>▼</span>}
                          sx={{
                            '& option': {
                              backgroundColor: 'white !important',
                              color: 'gray.600'
                            }
                          }}
                        >
                          <option value="diario">Diario</option>
                          <option value="semanal">Semanal</option>
                          <option value="mensual">Mensual</option>
                        </Select>

                        <HStack spacing={4}>
                          <Box flex={1}>
                            <Text mb={2} fontSize="sm" color="gray.600">
                              Fecha Inicio
                            </Text>
                            <Input 
                              type="date" 
                              value={fechaInicio} 
                              onChange={(e) => setFechaInicio(e.target.value)}
                              size="lg"
                              borderColor="gray.300"
                              _hover={{ borderColor: "blue.400" }}
                              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                            />
                          </Box>
                          <Box flex={1}>
                            <Text mb={2} fontSize="sm" color="gray.600">
                              Fecha Fin
                            </Text>
                            <Input 
                              type="date" 
                              value={fechaFin} 
                              onChange={(e) => setFechaFin(e.target.value)}
                              size="lg"
                              borderColor="gray.300"
                              _hover={{ borderColor: "blue.400" }}
                              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
                            />
                          </Box>
                        </HStack>

                        <Button 
                          colorScheme="blue" 
                          size="lg"
                          onClick={cargarDatos}
                          isLoading={cargando}
                          loadingText="Actualizando..."
                          _hover={{ transform: 'translateY(-1px)' }}
                          transition="all 0.2s"
                        >
                          🔍 Actualizar Reportes
                        </Button>
                      </Stack>
                    </CardBody>

                    {/* Reporte Ventas */}
                    <ReporteVentas data={ventas} />
                  </Card>
                </GridItem>
                
                {/* Reporte Cancelaciones */}
                <GridItem>
                  <Card 
                    bg="white" 
                    shadow="lg" 
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.100"
                    mb={6}
                  >
                    <CardBody color={"black"}>
                        <Flex align="center" mb={6}>
                          <Text fontSize="xl" fontWeight="bold" color="gray.700">
                            ❌ Cancelaciones
                          </Text>
                          <Badge ml={3} colorScheme="green">
                            Cancelado
                          </Badge>
                        </Flex>
                        <ReporteCancelaciones data={cancelaciones} />
                      </CardBody>
                  </Card>

                  <Card 
                    bg="white" 
                    shadow="lg" 
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.100"
                    mb={6}
                  >
                    <CardBody color={"black"}>
                        <Flex align="center" mb={6}>
                          <Text fontSize="xl" fontWeight="bold" color="gray.700">
                            ❌ Estacionalidad
                          </Text>
                          <Badge ml={3} colorScheme="green">
                            Cancelado
                          </Badge>
                        </Flex>
                        <ReporteEstacionalidad data={estacionalidad} />
                      </CardBody>
                  </Card>
                </GridItem>

                {/* Usuario Más Activo */}
                <GridItem>
                  <Card 
                    bg="white" 
                    shadow="lg" 
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.100"
                    mb={6}
                  >
                    <CardBody color={"black"}>
                      <Flex align="center" mb={6}>
                        <Text fontSize="xl" fontWeight="bold" color="gray.700">
                          🏆 Usuario Más Activo
                        </Text>
                        <Badge ml={3} colorScheme="green">
                          Destacado
                        </Badge>
                      </Flex>
                      <ReporteUsuarioMasActivo data={usuarioMasActivo} />
                    </CardBody>
                  </Card>
                </GridItem>

                {/* Costo vs Ganancia */}
                <GridItem>
                  <Card 
                    bg="white" 
                    shadow="lg" 
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor="gray.100"
                    mb={6}
                  >
                    <CardBody color={"black"}>
                      <Flex align="center" mb={6}>
                        <Text fontSize="xl" fontWeight="bold" color="gray.700">
                          🏆 Costo vs. Ganancia
                        </Text>
                        <Badge ml={3} colorScheme="green">
                          Destacado
                        </Badge>
                      </Flex>
                      <ReporteCostosGanancias data={costosGanancias} />
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            )}
          </Box>
        </VStack>
    </Container>
  );
};

export default Reportes;