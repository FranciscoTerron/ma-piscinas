import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { FaEye } from "react-icons/fa";
import ListarDetallesPedido from "./ListarDetallesPedido";

const ListarPedidos = ({ pedidos }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  const handleVerDetalles = (pedidoId) => {
    setPedidoSeleccionado(pedidoId);
    onOpen();
  };

  return (
    <>
      <Box
        bg="white"
        borderRadius="xl"
        boxShadow="sm"
        border="1px solid"
        borderColor="gray.200"
        overflowX="auto"
      >
        <Table variant="simple" minWidth="800px">
          <Thead bg="gray.100">
            <Tr>
              <Th textAlign="center" color="gray.700" width="10%">ID</Th>
              <Th textAlign="left" color="gray.700" width="20%">Fecha</Th>
              <Th textAlign="right" color="gray.700" width="20%">Total</Th>
              <Th textAlign="center" color="gray.700" width="20%">Estado</Th>
              <Th textAlign="center" color="gray.700" width="20%">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pedidos.map((pedido) => (
              <Tr 
                key={pedido.id} 
                _hover={{ bg: "gray.50" }} 
                transition="all 0.2s"
              >
                <Td textAlign="center" fontSize="sm" color="gray.600">
                  #{pedido.id}
                </Td>
                <Td color="gray.700">
                  {new Date(pedido.fecha).toLocaleDateString()}
                </Td>
                <Td textAlign="right" fontWeight="bold" color="gray.800">
                  ${pedido.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </Td>
                <Td 
                  textAlign="center" 
                  fontWeight="bold"
                  color={pedido.estado === "Entregado" ? "green.600" : "red.600"}
                >
                  {pedido.estado}
                </Td>
                <Td textAlign="center">
                  <Button
                    leftIcon={<FaEye />}
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    onClick={() => handleVerDetalles(pedido.id)}
                  >
                    Ver Detalles
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {pedidoSeleccionado && (
        <ListarDetallesPedido
          pedidoId={pedidoSeleccionado}
          isOpen={isOpen}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default ListarPedidos;
