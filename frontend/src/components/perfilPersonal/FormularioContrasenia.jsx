import React, { useState } from "react";
import { Box, VStack, Input, Button, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { actualizarContrasena } from "../../services/api";

const FormularioContrasenia = ({ usuarioId, onSuccess }) => {
  const toast = useToast();
  const [contrasena, setContrasena] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContrasena((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (contrasena.nueva !== contrasena.confirmar) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      await actualizarContrasena(usuarioId, contrasena.nueva);
      toast({
        title: "Éxito",
        description: "Contraseña actualizada correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setContrasena({ actual: "", nueva: "", confirmar: "" });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la contraseña.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="white" p={6} borderRadius={10} boxShadow="lg" border="2px solid" borderColor="#00CED1">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Contraseña Actual</FormLabel>
            <Input bg="white" border="1px" borderColor="gray.200" _hover={{ borderColor: "gray.300" }} name="actual" type="password" value={contrasena.actual} onChange={handleChange} placeholder="Contraseña actual" />
          </FormControl>
          <FormControl>
            <FormLabel>Nueva Contraseña</FormLabel>
            <Input bg="white" border="1px" borderColor="gray.200" _hover={{ borderColor: "gray.300" }} name="nueva" type="password" value={contrasena.nueva} onChange={handleChange} placeholder="Nueva contraseña" />
          </FormControl>
          <FormControl>
            <FormLabel>Confirmar Nueva Contraseña</FormLabel>
            <Input bg="white" border="1px" borderColor="gray.200" _hover={{ borderColor: "gray.300" }} name="confirmar" type="password" value={contrasena.confirmar} onChange={handleChange} placeholder="Confirmar nueva contraseña" />
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">Actualizar Contraseña</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default FormularioContrasenia;