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
import { FaEye, FaUser } from "react-icons/fa";
import ListarDetallesPedido from "./ListarDetallesPedido";
import VerUsuario from "./VerUsuario";
import { obtenerUsuarioPorId } from "../../../services/api";


const ListarPedidos = ({ pedidos }) => {
  const { isOpen: isDetallesOpen, onOpen: onDetallesOpen, onClose: onDetallesClose } = useDisclosure();
  const { isOpen: isUsuarioOpen, onOpen: onUsuarioOpen, onClose: onUsuarioClose } = useDisclosure();
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const handleVerDetalles = (pedidoId) => {
    setPedidoSeleccionado(pedidoId);
    onDetallesOpen();
  };

  const handleVerUsuario = async (usuarioId) => {
    console.log("Usuario ID recibido:", usuarioId); // 👀 Verifica si el ID es correcto
    const usuario = await obtenerUsuarioPorId(usuarioId);
    console.log("Usuario obtenido:", usuario); // Debería mostrar los datos
    setUsuarioSeleccionado(usuario);
    onUsuarioOpen();
  };

  

  return (
    <>
      <Box
        p={6}
        bg="white"
        borderRadius="xl"
        boxShadow="lg"
        border="1px"
        borderColor="gray.200"
        overflow="hidden"
      >
        <Table variant="simple" minWidth="800px">
          <Thead bg="blue.50">
            <Tr>
              <Th textAlign="center" color="blue.600" width="10%">ID</Th>
              <Th textAlign="left" color="blue.600" width="20%">Fecha</Th>
              <Th textAlign="right" color="blue.600" width="20%">Total</Th>
              <Th textAlign="center" color="blue.600" width="15%">Estado</Th>
              <Th textAlign="center" color="blue.600" width="35%">Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {pedidos.map((pedido) => (
              <Tr key={pedido.id} _hover={{ bg: "gray.50" }} transition="all 0.2s">
                <Td textAlign="center" fontSize="sm" color="gray.600">#{pedido.id}</Td>
                <Td color="gray.700">{new Date(pedido.fecha).toLocaleDateString()}</Td>
                <Td textAlign="right" fontWeight="bold" color="gray.800">
                  ${pedido.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </Td>
                <Td textAlign="center" fontWeight="bold" color={pedido.estado === "Entregado" ? "green.600" : "red.600"}>
                  {pedido.estado}
                </Td>
                <Td textAlign="center">
                  <Button leftIcon={<FaEye />} size="sm" colorScheme="blue" variant="outline" onClick={() => handleVerDetalles(pedido.id)}>
                    Ver Detalles
                  </Button>
                  <Button
                    leftIcon={<FaUser />}
                    size="sm"
                    colorScheme="teal"
                    variant="outline"
                    ml={2}
                    onClick={() => handleVerUsuario(pedido.usuario_id || pedido.usuario?.id)}                  >
                    Ver Usuario
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {pedidoSeleccionado && (
        <ListarDetallesPedido pedidoId={pedidoSeleccionado} isOpen={isDetallesOpen} onClose={onDetallesClose} />
      )}
      {usuarioSeleccionado && (
        <VerUsuario usuario={usuarioSeleccionado} isOpen={isUsuarioOpen} onClose={onUsuarioClose} />
      )}

    </>
  );
};

export default ListarPedidos;
