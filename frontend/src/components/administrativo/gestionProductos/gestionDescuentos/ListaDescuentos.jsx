import React, { useState } from "react";
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
  Badge,
  useToast,
  Tooltip,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { eliminarDescuento } from "../../../../services/api";

const ListaDescuentos = ({ descuentos, onEditar, onEliminar }) => {
  const [descuentoAEliminar, setDescuentoAEliminar] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleEliminar = async () => {
    try {
      await eliminarDescuento(descuentoAEliminar.id);
      onEliminar();
      toast({
        title: "Descuento eliminado",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el descuento",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  const getBadgeStatus = (descuento) => {
    const ahora = new Date();
    const inicio = new Date(descuento.fecha_inicio);
    const fin = descuento.fecha_fin ? new Date(descuento.fecha_fin) : null;
    
    if (!descuento.activo) return { color: "red", label: "Inactivo" };
    if (ahora < inicio) return { color: "yellow", label: "Programado" };
    if (fin && ahora > fin) return { color: "gray", label: "Expirado" };
    return { color: "green", label: "Activo" };
  };

  return (
    <>
      <Box p={6} bg="white" borderRadius="xl" boxShadow="lg" border="1px" borderColor="gray.200">
        <Table variant="simple">
          <Thead bg="blue.50">
            <Tr>
              <Th color="blue.600">Nombre</Th>
              <Th color="blue.600">Tipo</Th>
              <Th color="blue.600">Valor</Th>
              <Th color="blue.600">Vigencia</Th>
              <Th color="blue.600">Estado</Th>
              <Th color="blue.600">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {descuentos.map(descuento => {
              const status = getBadgeStatus(descuento);
              return (
                <Tr key={descuento.id} _hover={{ bg: "gray.50" }}>
                  <Td fontWeight="medium">{descuento.nombre}</Td>
                  <Td>{descuento.tipo}</Td>
                  <Td>
                    {descuento.tipo === 'PORCENTAJE' 
                      ? `${descuento.valor}%`
                      : `$${descuento.valor}`}
                  </Td>
                  <Td>
                    {new Date(descuento.fecha_inicio).toLocaleDateString()} - 
                    {descuento.fecha_fin ? new Date(descuento.fecha_fin).toLocaleDateString() : 'Indefinido'}
                  </Td>
                  <Td>
                    <Badge colorScheme={status.color}>{status.label}</Badge>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <IconButton
                        icon={<FaEdit />}
                        colorScheme="blue"
                        variant="ghost"
                        onClick={() => onEditar(descuento)}
                      />
                      <IconButton
                        icon={<FaTrash />}
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => {
                          setDescuentoAEliminar(descuento);
                          onOpen();
                        }}
                      />
                    </Flex>
                  </Td>
                </Tr>
              )}
            )}
          </Tbody>
        </Table>
      </Box>

      <AlertDialog isOpen={isOpen} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Eliminar Descuento</AlertDialogHeader>
            <AlertDialogBody>
              ¿Estás seguro de eliminar el descuento "{descuentoAEliminar?.nombre}"?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={onClose}>Cancelar</Button>
              <Button colorScheme="red" ml={3} onClick={handleEliminar}>
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ListaDescuentos;