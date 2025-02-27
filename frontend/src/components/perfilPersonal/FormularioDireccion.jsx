import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Flex
} from "@chakra-ui/react";

const FormularioDireccion = ({ direccion, onGuardar, onCancelar }) => {
  const [ciudad, setCiudad] = useState(direccion?.ciudad || "");
  const [codigoPostal, setCodigoPostal] = useState(direccion?.codigo_postal || "");
  const [provincia, setProvincia] = useState(direccion?.provincia || "");
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ciudad || !codigoPostal || !provincia) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    onGuardar({ ciudad, codigo_postal: codigoPostal, provincia });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Ciudad</FormLabel>
          <Input
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            placeholder="Ciudad"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Código Postal</FormLabel>
          <Input
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            placeholder="Código Postal"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Provincia</FormLabel>
          <Input
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
            placeholder="Provincia"
          />
        </FormControl>
        <Flex gap={2} w="100%" justify="flex-end">
          <Button colorScheme="gray" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button colorScheme="teal" type="submit">
            Guardar
          </Button>
        </Flex>
      </VStack>
    </form>
  );
};

export default FormularioDireccion;