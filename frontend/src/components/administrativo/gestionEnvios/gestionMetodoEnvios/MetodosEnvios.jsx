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

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    try {
      const data = await listarMetodosEnvio();
      setEmpresas(data);
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
                {empresas.length} empresas disponibles
              </Text>
            </VStack>
          </HStack>
          <Button colorScheme="blue" onClick={() => handleEditarEmpresa(null)}>
            Agregar Empresa
          </Button>
        </HStack>

        <ListarMetodosEnvio
          empresas={empresas}
          onEditar={handleEditarEmpresa}
          onEliminar={cargarEmpresas}
        />

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