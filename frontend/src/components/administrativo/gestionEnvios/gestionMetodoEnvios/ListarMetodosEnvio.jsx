import React, { useState, useMemo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Image,
  useToast,
  Tooltip,
  Flex,
  Text,
  Skeleton,
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { eliminarMetodoEnvio } from "../../../../services/api";

const ListarMetodosEnvio = ({ metodosEnvio = [], onEditar, onEliminar }) => {
  const [metodoAEliminar, setMetodoAEliminar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Estados para los filtros de búsqueda
  const [searchNombre, setSearchNombre] = useState("");
  const [searchDireccion, setSearchDireccion] = useState("");
  const [searchTelefono, setSearchTelefono] = useState("");

  // Función auxiliar para búsqueda segura
  const safeSearch = (value, searchTerm) => {
    if (value === null || value === undefined) return false;
    return String(value).toLowerCase().includes(String(searchTerm).toLowerCase());
  };

  // Filtrado de datos usando useMemo para mejor rendimiento
  const filteredMetodos = useMemo(() => {
    return metodosEnvio.filter(metodo => {
      const nombreMatch = safeSearch(metodo.nombre, searchNombre);
      const direccionMatch = safeSearch(metodo.direccion, searchDireccion);
      const telefonoMatch = safeSearch(metodo.telefono, searchTelefono);
      
      return nombreMatch && direccionMatch && telefonoMatch;
    });
  }, [metodosEnvio, searchNombre, searchDireccion, searchTelefono]);

  const handleEliminarMetodo = async () => {
    setIsLoading(true);
    try {
      await eliminarMetodoEnvio(metodoAEliminar.id);
      onEliminar();
      toast({
        title: "Método de envío eliminado",
        description: "El método de envío ha sido eliminado exitosamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el método de envío. Intente nuevamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  const confirmarEliminacion = (metodo) => {
    setMetodoAEliminar(metodo);
    onOpen();
  };

  return (
    <>
      {/* Filtros de búsqueda */}
      <Stack spacing={4} mb={4} color={"black"}>
        <Flex gap={4} align="center">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por nombre..."
              value={searchNombre}
              onChange={(e) => setSearchNombre(e.target.value)}
              bg="white"
              border="1px"
              borderColor="gray.300"
              _focus={{ borderColor: "blue.500" }}
              color="black" 
              _placeholder={{ color: "gray.500" }}
            />
          </InputGroup>
          
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por dirección..."
              value={searchDireccion}
              onChange={(e) => setSearchDireccion(e.target.value)}
              bg="white"
              border="1px"
              borderColor="gray.300"
              _focus={{ borderColor: "blue.500" }}
              color="black" 
              _placeholder={{ color: "gray.500" }}
            />
          </InputGroup>
          
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FaSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por teléfono..."
              value={searchTelefono}
              onChange={(e) => setSearchTelefono(e.target.value)}
              bg="white"
              border="1px"
              borderColor="gray.300"
              _focus={{ borderColor: "blue.500" }}
              color="black" 
              _placeholder={{ color: "gray.500" }}
            />
          </InputGroup>
        </Flex>
      </Stack>

      {/* Tabla de métodos de envío */}
      <Box 
        p={6}
        bg="white"
        borderRadius="xl"
        boxShadow="lg"
        border="1px"
        borderColor="gray.200"
        overflow="hidden"
      >
        <Table variant="simple">
          <Thead bg="blue.50">
            <Tr>
              <Th textAlign="center" color="blue.600">ID</Th>
              <Th textAlign="left" color="blue.600">Nombre</Th>
              <Th textAlign="left" color="blue.600">Dirección</Th>
              <Th textAlign="left" color="blue.600">Teléfono</Th>
              <Th textAlign="center" color="blue.600">Imagen</Th>
              <Th textAlign="center" color="blue.600">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredMetodos.map((metodo) => (
              <Tr key={metodo.id} _hover={{ bg: "gray.50" }} transition="all 0.2s">
                <Td textAlign="center" fontSize="sm" color="gray.500">#{metodo.id}</Td>
                <Td fontWeight="medium" color="gray.700">{metodo.nombre}</Td>
                <Td color="gray.600">{metodo.direccion}</Td>
                <Td color="gray.600">{metodo.telefono}</Td>
                <Td textAlign="center">
                  <Image
                    src={metodo.imagen}
                    alt={metodo.nombre}
                    boxSize="40px"
                    objectFit="cover"
                    borderRadius="md"
                    fallback={<Skeleton boxSize="40px" borderRadius="md" />}
                  />
                </Td>
                <Td>
                  <Flex justify="center" gap={2}>
                    <Tooltip label="Editar método de envío" hasArrow>
                      <IconButton
                        aria-label="Editar método de envío"
                        icon={<FaEdit />}
                        size="sm"
                        color={"blue.900"}
                        colorScheme="blue"
                        variant="ghost"
                        _hover={{ color: "blue.500" }}
                        onClick={() => onEditar(metodo)}
                      />
                    </Tooltip>
                    <Tooltip label="Eliminar método de envío" hasArrow>
                      <IconButton
                        aria-label="Eliminar método de envío"
                        icon={<FaTrash />}
                        size="sm"
                        color={"red.900"}
                        colorScheme="red"
                        variant="ghost"
                        _hover={{ color: 'red.500' }}
                        onClick={() => confirmarEliminacion(metodo)}
                      />
                    </Tooltip>
                  </Flex>
                </Td>
              </Tr>
            ))}
            {filteredMetodos.length === 0 && (
              <Tr>
                <Td colSpan={6} textAlign="center" py={4}>
                  <Text color="gray.500">No se encontraron resultados</Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={undefined}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="white">
            <AlertDialogHeader fontSize="lg" fontWeight="bold" color="gray.800" pb={4}>
              Eliminar Método de Envío
            </AlertDialogHeader>

            <AlertDialogBody color="gray.600">
              ¿Estás seguro de que deseas eliminar el método de envío "{metodoAEliminar?.nombre}"?
              Esta acción no se puede deshacer.
            </AlertDialogBody>

            <AlertDialogFooter gap={3}>
              <Button
                bg="red.500"
                _hover={{ bg: "red.800" }}
                color="white"
                onClick={handleEliminarMetodo}
                isLoading={isLoading}
                leftIcon={<FaTrash />}
              >
                Eliminar
              </Button>
              <Button onClick={onClose} variant="outline" bg="gray.500" _hover={{ bg: "gray.800" }} color="white" isDisabled={isLoading}>
                Cancelar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ListarMetodosEnvio;