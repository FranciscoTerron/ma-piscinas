import React from "react";
import {VStack,HStack,Text,Box,Select,RangeSlider,RangeSliderTrack,RangeSliderFilledTrack,RangeSliderThumb,Flex,useColorModeValue
} from "@chakra-ui/react";
import { FiFilter, FiSliders } from "react-icons/fi";

const Filtros = ({
  categorias,
  subcategorias,
  selectedCategoria,
  setSelectedCategoria,
  selectedSubcategoria,
  setSelectedSubcategoria,
  ordenarPor,
  setOrdenarPor,
  rangoPrecio,
  setRangoPrecio,
  cargarSubcategorias
}) => {
  
  // Colores que se adaptan al modo claro/oscuro de Chakra
  const bgPanel = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  
  return (
    <Box
      w="full"
      p={6}
      bg={bgPanel}
      borderRadius="md"
      boxShadow="md"
      border="1px solid"
      borderColor={borderColor}
    >
      <VStack spacing={6} align="start" w="full">
        
        {selectedCategoria !== "todas" && (
          <Text
            fontSize="2xl"
            fontWeight="bold"
            color="blue.600"
            textAlign="left"
            w="full"
          >
            {categorias.find(cat => cat.id === parseInt(selectedCategoria))?.nombre || "Categoría"}
          </Text>
        )}



        {/* Select de Categorías */}
        <Box w="full">
          <Text mb={2} fontWeight="semibold" color={textColor}>
            Categorías
          </Text>
          <Select
            value={selectedCategoria}
            onChange={(e) => {
              setSelectedCategoria(e.target.value);
              setSelectedSubcategoria("todas");
              if (e.target.value !== "todas") {
                cargarSubcategorias(e.target.value);
              } else {
                setSubcategorias([]);
              }
            }}
            variant="outline"
            borderColor={borderColor}
            _focus={{ borderColor: "blue.500" }}
            sx={{
              "& option": {
                backgroundColor: "white !important",
                color: "gray.600",
              },
            }}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </Select>
        </Box>

        {/* Select de Subcategorías (solo si hay categoría seleccionada) */}
        {selectedCategoria !== "todas" && (
          <Box w="full">
            <Text mb={2} fontWeight="semibold" color={textColor}>
              Subcategorías
            </Text>
            <Select
              value={selectedSubcategoria}
              onChange={(e) => setSelectedSubcategoria(e.target.value)}
              variant="outline"
              borderColor={borderColor}
              _focus={{ borderColor: "blue.500" }}
              sx={{
                "& option": {
                  backgroundColor: "white !important",
                  color: "gray.600",
                },
              }}
            >
              <option value="todas">Todas las subcategorías</option>
              {subcategorias.map((subcategoria) => (
                <option key={subcategoria.id} value={subcategoria.id}>
                  {subcategoria.nombre}
                </option>
              ))}
            </Select>
          </Box>
        )}

        {/* Ordenar por */}
        <Box w="full">
          <Text mb={2} fontWeight="semibold" color={textColor}>
            Ordenar por
          </Text>
          <Select
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
            variant="outline"
            borderColor={borderColor}
            _focus={{ borderColor: "blue.500" }}
            sx={{
              "& option": {
                backgroundColor: "white !important",
                color: "gray.600",
              },
            }}
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-bajo">Menor precio</option>
            <option value="precio-alto">Mayor precio</option>
            <option value="descuento">Mayor descuento</option>
          </Select>
        </Box>

        {/* Rango de precio */}
        <Box w="full">
          <HStack spacing={2} mb={2}>
            <FiSliders color="blue.500" />
            <Text fontWeight="semibold" color={textColor}>
              Rango de precio
            </Text>
          </HStack>
          <RangeSlider
            min={0}
            max={10000000}
            step={1000}
            value={rangoPrecio}
            onChange={setRangoPrecio}
            colorScheme="blue"
          >
            <RangeSliderTrack bg={useColorModeValue("gray.200", "gray.600")}>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          <Flex justify="space-between" mt={1}>
            <Text color={textColor}>${rangoPrecio[0].toLocaleString()}</Text>
            <Text color={textColor}>${rangoPrecio[1].toLocaleString()}</Text>
          </Flex>
        </Box>
      </VStack>
    </Box>
  );
};

export default Filtros;
