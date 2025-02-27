import React from "react";
import { Flex, Box } from "@chakra-ui/react";
import PerfilUsuario from "./PerfilUsuario";
import DireccionesEnvio from "./DireccionesEnvio";

const PerfilCompleto = () => {
  return (
    <Flex direction={{ base: "column", md: "row" }} gap={4} p={4}>
      <Box flex={1}>
        <PerfilUsuario />
      </Box>
      <Box flex={2}> {/* Se le da más espacio al bloque de direcciones */}
        <DireccionesEnvio />
      </Box>
    </Flex>
  );
};

export default PerfilCompleto;
