import React, { useEffect, useState } from "react";
import {
  Container,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTruck } from "react-icons/fa";
import { listarMetodosEnvio } from "../../../../services/api";
import GoBackButton from "../../../GoBackButton";
import FormularioMetodoEnvio from "./FormularioMetodoEnvio";
import ListarMetodosEnvio from "./ListarMetodosEnvio";

const MetodosEnvios = () => {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [total, setTotal] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const porPagina = 10;
  const totalPaginas = Math.ceil(total / porPagina);

  useEffect(() => {
    cargarEmpresas();
  }, [paginaActual]);

  const cargarEmpresas = async (paginaActual, usuariosPorPagina) => {
    try {
      const data = await listarMetodosEnvio(paginaActual, usuariosPorPagina);
      setEmpresas(data.empresas);
      setTotal(data.total);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la lista de empresas.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  
  const handleEditarEmpresa = (empresa) => {
    setEmpresaSeleccionada(empresa);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between">
          <HStack spacing={4}>
            <GoBackButton />
            <VStack align="flex-start" spacing={0}>
              <HStack>
                <FaTruck size="24px" color="#4A5568" />
                <Text fontSize="2xl" fontWeight="bold" color="gray.700">
                  Gestión de Métodos de Envío
                </Text>
              </HStack>
              <Text color="gray.500" fontSize="sm">
                {total} empresas disponibles
              </Text>
            </VStack>
          </HStack>
          <Button colorScheme="blue" onClick={() => handleEditarEmpresa(null)}>
            Agregar Empresa
          </Button>
        </HStack>

        <ListarMetodosEnvio
          metodosEnvio={empresas}
          onEditar={handleEditarEmpresa}
          onEliminar={cargarEmpresas}
        />

        <HStack spacing={2} justify="center" mt={4} color={"black"}>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => setPaginaActual(paginaActual - 1)}
            isDisabled={paginaActual === 1}
          >
            Anterior
          </Button>
          <Text>
            Página {paginaActual} de {totalPaginas}
          </Text>
          <Button
            colorScheme="blue"
            size="sm"
            onClick={() => setPaginaActual(paginaActual + 1)}
            isDisabled={paginaActual === totalPaginas}
          >
            Siguiente
          </Button>
        </HStack>

        <FormularioMetodoEnvio
          isOpen={isOpen}
          onClose={onClose}
          empresa={empresaSeleccionada}
          onSubmitSuccess={cargarEmpresas}
        />
      </VStack>
    </Container>
  );
};

export default MetodosEnvios;