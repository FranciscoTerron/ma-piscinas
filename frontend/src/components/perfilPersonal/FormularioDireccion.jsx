import React, { useState, useEffect } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Flex,
  Select,
} from "@chakra-ui/react";


const FormularioDireccion = ({ direccion, onGuardar, onCancelar }) => {
  // Estados para almacenar los listados de provincias y ciudades
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  
  // Estados para los campos del formulario
  // NOTA: 'direccion' (prop) puede ser null o tener valores, por eso usamos condicionales
  const [provincia, setProvincia] = useState(direccion?.provincia || "");
  const [ciudad, setCiudad] = useState(direccion?.ciudad || "");
  const [codigoPostal, setCodigoPostal] = useState(direccion?.codigo_postal || "");
  const [direccionUsuario, setDireccionUsuario] = useState(direccion?.direccion || "");
  
  const toast = useToast();

  // Cargar listado de provincias al montar
  useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre")
      .then((response) => response.json())
      .then((data) => setProvincias(data.provincias))
      .catch((error) => console.error("Error al obtener provincias:", error));
  }, []);

  // Cuando se selecciona una provincia, obtener sus ciudades
  useEffect(() => {
    if (provincia) {
      fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${provincia}&campos=id,nombre&max=100`
      )
        .then((response) => response.json())
        .then((data) => setCiudades(data.municipios))
        .catch((error) => console.error("Error al obtener ciudades:", error));
      
      // Reiniciar ciudad al cambiar provincia
      setCiudad("");
    } else {
      setCiudades([]);
    }
  }, [provincia]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!provincia || !ciudad || !codigoPostal || !direccionUsuario) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Buscar los nombres correspondientes al ID seleccionado
    const selectedProvince = provincias.find((p) => p.id === provincia);
    const selectedCity = ciudades.find((c) => c.id === ciudad);

    // Llamamos a onGuardar con la info completa
    onGuardar({
      provincia: selectedProvince ? selectedProvince.nombre : provincia,
      ciudad: selectedCity ? selectedCity.nombre : ciudad,
      codigo_postal: codigoPostal,
      direccion: direccionUsuario,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={4}>
        <FormControl isRequired>
          <FormLabel>Provincia</FormLabel>
          <Select
            placeholder="Seleccione provincia"
            value={provincia}
            onChange={(e) => setProvincia(e.target.value)}
          >
            {provincias.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.nombre}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Ciudad</FormLabel>
          <Select
            placeholder="Seleccione ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            isDisabled={!provincia}
          >
            {ciudades.map((mun) => (
              <option key={mun.id} value={mun.id}>
                {mun.nombre}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Código Postal</FormLabel>

          <Button
            as="a"
            href="https://www.correoargentino.com.ar/formularios/cpa"
            target="_blank"
            rel="noopener noreferrer"
            variant="link"
            color="blue.500"
            fontSize="sm"
            mb={2}
          >
            No sé mi código postal
          </Button>

          <Input
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            placeholder="Ingrese su código postal"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Dirección</FormLabel>
          <Input
            value={direccionUsuario}
            onChange={(e) => setDireccionUsuario(e.target.value)}
            placeholder="Ej: Calle Falsa 123"
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
