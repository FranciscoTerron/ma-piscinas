import React, { useState, useEffect } from "react";
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
  Select, 
  useToast, 
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { FaEye, FaUser } from "react-icons/fa";
import ListarDetallesPedido from "./ListarDetallesPedido";
import VerUsuario from "./VerUsuario";
import { obtenerUsuarioPorId, actualizarEstadoPedido } from "../../../services/api";

const ListarPedidos = ({ pedidos: pedidosProps }) => {
  const { isOpen: isDetallesOpen, onOpen: onDetallesOpen, onClose: onDetallesClose } = useDisclosure();
  const { isOpen: isUsuarioOpen, onOpen: onUsuarioOpen, onClose: onUsuarioClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [estadoCambio, setEstadoCambio] = useState({ pedidoId: null, nuevoEstado: null });
  const toast = useToast();
  const cancelRef = React.useRef();
  
  // Inicializar el estado de pedidos con las props
  useEffect(() => {
    if (pedidosProps && Array.isArray(pedidosProps)) {
      setPedidos(pedidosProps);
    }
  }, [pedidosProps]);

  const handleVerDetalles = (pedidoId) => {
    setPedidoSeleccionado(pedidoId);
    onDetallesOpen();
  };

  const handleVerUsuario = async (usuarioId) => {
    const usuario = await obtenerUsuarioPorId(usuarioId);
    setUsuarioSeleccionado(usuario);
    onUsuarioOpen();
  };

  const handleSelectChange = (pedidoId, nuevoEstado, estadoActual) => {
    // Validación de estados permitidos según el estado actual
    if (!isValidStatusChange(estadoActual, nuevoEstado)) {
      toast({
        title: "Cambio no permitido",
        description: `No se puede cambiar de "${estadoActual}" a "${nuevoEstado}"`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Si es un cambio válido, preparamos la confirmación
    setEstadoCambio({ pedidoId, nuevoEstado });
    onConfirmOpen();
  };

  // Función para validar los cambios de estado permitidos
  const isValidStatusChange = (estadoActual, nuevoEstado) => {
    // Si es el mismo estado, permitimos (aunque no hace cambios realmente)
    if (estadoActual === nuevoEstado) return true;
    
    // Reglas de transición de estados
    switch (estadoActual) {
      case "PENDIENTE":
        return nuevoEstado === "ENVIADO"; // Solo permite cambiar a ENVIADO
      case "ENVIADO":
        return nuevoEstado === "ENTREGADO"; // Solo permite cambiar a ENTREGADO
      case "ENTREGADO":
        return false; // No permite cambios desde ENTREGADO
      default:
        return false;
    }
  };

  const confirmCambiarEstado = async () => {
    const { pedidoId, nuevoEstado } = estadoCambio;
    
    try {
      await actualizarEstadoPedido(pedidoId, nuevoEstado);
      
      // Actualizar estado local
      const pedidosActualizados = pedidos.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
      );
      
      setPedidos(pedidosActualizados);
      
      toast({
        title: "Estado actualizado",
        description: "El estado del pedido se ha actualizado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al actualizar el estado del pedido:", error);
      
      toast({
        title: "Error",
        description: "Hubo un error al actualizar el estado del pedido.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onConfirmClose();
    }
  };

  // Función para obtener las opciones disponibles según el estado actual
  const getAvailableOptions = (estadoActual) => {
    const allOptions = ["PENDIENTE", "ENVIADO", "ENTREGADO"];
    
    switch (estadoActual) {
      case "PENDIENTE":
        return ["PENDIENTE", "ENVIADO"];
      case "ENVIADO":
        return ["ENVIADO", "ENTREGADO"];
      case "ENTREGADO":
        return ["ENTREGADO"];
      case "CANCELADO":
        return ["CANCELADO"];
      default:
        return allOptions;
    }
  };

  // Renderización condicional si no hay pedidos
  if (!pedidos || pedidos.length === 0) {
    return (
      <Box p={6} bg="white" borderRadius="xl" boxShadow="lg" textAlign="center">
        No hay pedidos disponibles para mostrar.
      </Box>
    );
  }

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
                <Td color="gray.700">{new Date(pedido.fecha_creacion).toLocaleDateString()}</Td>
                <Td textAlign="right" fontWeight="bold" color="gray.800">
                  ${pedido.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                </Td>
                <Td textAlign="center" fontWeight="bold">
                  <Select
                    value={pedido.estado}
                    onChange={(e) => handleSelectChange(pedido.id, e.target.value, pedido.estado)}
                    size="sm"
                    width="fit-content"
                    color={
                      pedido.estado === "ENTREGADO" 
                        ? "green.600" 
                        : pedido.estado === "ENVIADO" 
                          ? "orange.600" 
                          : "red.600"
                    }
                    isDisabled={pedido.estado === "ENTREGADO" || pedido.estado === "CANCELADO"} 
                    _hover={{ color: "blue.600" }}
                  >
                    {getAvailableOptions(pedido.estado).map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
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
                  <Button
                    leftIcon={<FaUser />}
                    size="sm"
                    colorScheme="teal"
                    variant="outline"
                    ml={2}
                    onClick={() => handleVerUsuario(pedido.usuario_id || pedido.usuario?.id)}
                  >
                    Ver Usuario
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Diálogo de confirmación para cambio de estado */}
      <AlertDialog
        isOpen={isConfirmOpen}
        leastDestructiveRef={cancelRef}
        onClose={onConfirmClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar cambio de estado
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Está seguro de cambiar el estado del pedido a {estadoCambio.nuevoEstado}? 
              Esta acción no se puede revertir.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onConfirmClose}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onClick={confirmCambiarEstado} ml={3}>
                Confirmar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

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