import React, { useState, useEffect } from "react";
import { Box, VStack, Input, Button, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { actualizarDatosPersonales } from "../../services/api";

const FormularioPersonal = ({ usuarioId ,user, onSuccess }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || "",
        email: user.email || "",
        telefono: user.telefono || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await actualizarDatosPersonales(usuarioId, formData);
      toast({
        title: "Datos actualizados",
        description: "Tu información personal ha sido actualizada con éxito.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la información.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bg="white" p={6} borderRadius={10} boxShadow="lg" border="2px solid" borderColor="#00CED1" color={"black"}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} color={"black"}>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input bg="white" border="1px" borderColor="gray.200" _hover={{ borderColor: "gray.300" }} name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input bg="white" border="1px" borderColor="gray.200" _hover={{ borderColor: "gray.300" }} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          </FormControl>
          <FormControl>
            <FormLabel>Teléfono</FormLabel>
            <Input bg="white" border="1px" borderColor="gray.200" _hover={{ borderColor: "gray.300" }} name="telefono" type="number" value={formData.telefono} onChange={handleChange} placeholder="Teléfono" />
          </FormControl>
          <Button type="submit" colorScheme="teal" width="full">Actualizar Datos</Button>
        </VStack>
      </form>
    </Box>
  );
};

export default FormularioPersonal;
