import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import PerfilUsuario from "./PerfilUsuario";
import DireccionesEnvio from "./DireccionesEnvio";

const PerfilCompleto = () => {
  return (
    <Flex direction={{ base: "column", md: "row" }} gap={2} p={2}>
      <Box flex={1}>
        <PerfilUsuario />
      </Box>
      <Box flex={1}>
        <DireccionesEnvio />
      </Box>
    </Flex>
  );
};

export default PerfilCompleto;