  import React, { useState, useEffect } from "react";
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
    Badge,
    useToast,
    Tooltip,
    Flex,
    Text,
    Skeleton,
    useDisclosure,
  } from "@chakra-ui/react";
  import { FaTrash, FaEdit } from "react-icons/fa";
  import { eliminarProducto } from "../../../../services/api";

  const ListaProductos = ({ productos, categorias, descuentos, onEditar, onEliminar }) => {
    const obtenerNombreCategoria = (categoriaId) => {
      const categoria = (categorias || []).find((cat) => cat.id === categoriaId);
      return categoria ? categoria.nombre : "Sin categoría";
    };
    
    const obtenerNombreDescuento = (descuentoId) => {
      console.log("Descuento ID recibido:", descuentoId);
      const descuento = (descuentos || []).find((desc) => desc.id === descuentoId);
      console.log("Descuento encontrado:", descuento);
      return descuento ? descuento.nombre : "Sin descuento";
    };
    
    
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const handleEliminarProducto = async () => {
      setIsLoading(true);
      try {
        await eliminarProducto(productoAEliminar.id);
        onEliminar();
        toast({
          title: "Producto eliminado",
          description: "El producto ha sido eliminado exitosamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto. Intente nuevamente.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
        onClose();
      }
    };

    const confirmarEliminacion = (producto) => {
      setProductoAEliminar(producto);
      onOpen();
    };

    const getStockBadge = (stock) => {
      if (stock <= 0) {
        return <Badge colorScheme="red" variant="subtle">Sin stock</Badge>;
      } else if (stock <= 10) {
        return <Badge colorScheme="yellow" variant="subtle">Stock bajo ({stock})</Badge>;
      }
      return <Badge colorScheme="green" variant="subtle">{stock} unidades</Badge>;
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
          maxWidth="100%"
        >
        <Box overflowX="auto">
          <Table  variant="simple" tableLayout="fixed" width="100%" >
            <Thead bg="blue.50">
            <Tr>
              <Th textAlign="left" color="blue.600" fontSize="sm">Código</Th>
              <Th textAlign="left" color="blue.600" fontSize="sm">Imagen</Th>
              <Th textAlign="left" color="blue.600" fontSize="sm">Categoría</Th>
              <Th textAlign="left" color="blue.600" fontSize="sm">Descripción</Th>
              <Th textAlign="right" color="blue.600" fontSize="sm">Precio</Th>
              <Th textAlign="right" color="blue.600" fontSize="sm">Costo Compra</Th>
              <Th textAlign="center" color="blue.600" fontSize="sm">Stock</Th>
              <Th textAlign="center" color="blue.600" fontSize="sm">Descuento</Th>
              <Th textAlign="center" color="blue.600" fontSize="sm">Acciones</Th>
            </Tr>
            </Thead>
            <Tbody>
              {productos.map((producto) => (
                <Tr key={producto.id} _hover={{ bg: "gray.50" }} transition="all 0.2s">
                  <Td textAlign="left" fontSize="sm" color="gray.500">
                    {producto.codigo}
                  </Td>
                  <Td>
                    <Flex align="center" gap={3}>
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        boxSize="40px"
                        objectFit="cover"
                        borderRadius="md"
                        fallback={<Skeleton boxSize="40px" borderRadius="md" />}
                      />
                      <Text fontWeight="medium" color="gray.700">{producto.nombre}</Text>
                    </Flex>
                  </Td>
                  <Td color="gray.600">{obtenerNombreCategoria(producto.categoria_id)}</Td>
                  <Td color="gray.600" maxW="250px">
                    <Tooltip label={producto.descripcion} hasArrow>
                      <Text noOfLines={2}>{producto.descripcion}</Text>
                    </Tooltip>
                  </Td>
                 
                  <Td textAlign="right" fontWeight="medium" color="gray.700">
                    ${producto.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                  </Td>
                  <Td textAlign="right" fontWeight="medium" color="gray.700">
                    {producto.costo_compra
                      ? `$${producto.costo_compra.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
                      : "-"}
                  </Td>
                  <Td textAlign="center">{getStockBadge(producto.stock)}</Td>
                  <Td textAlign="center">
                  {producto.descuento_id ? (
                    <Badge
                      colorScheme="purple"
                      variant="solid"
                      maxW="150px"
                      isTruncated
                      p={2}
                      fontSize="sm"
                    >
                      {obtenerNombreDescuento(producto.descuento_id)}{" "}
                      {producto.descuento_id.tipo === "PORCENTAJE"
                        ? `- ${producto.descuento_id.valor}%`
                        : `$${producto.descuento_id.valor}`}
                    </Badge>
                  ) : (
                    <Badge colorScheme="gray" variant="subtle" maxW="150px" isTruncated p={2} fontSize="sm">
                      Sin descuento
                    </Badge>
                  )}
                </Td>
                  <Td>
                    <Flex justify="center" gap={2}>
                      <Tooltip label="Editar producto" hasArrow>
                        <IconButton
                          aria-label="Editar producto"
                          icon={<FaEdit />}
                          size="sm"
                          color="blue.900"
                          colorScheme="blue"
                          variant="ghost"
                          _hover={{ color: "blue.500" }}
                          onClick={() => onEditar(producto)}
                        />
                      </Tooltip>
                      <Tooltip label="Eliminar producto" hasArrow>
                        <IconButton
                          aria-label="Eliminar producto"
                          icon={<FaTrash />}
                          size="sm"
                          color="red.900"
                          colorScheme="red"
                          variant="ghost"
                          _hover={{ color: "red.500" }}
                          onClick={() => confirmarEliminacion(producto)}
                        />
                      </Tooltip>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <AlertDialog isOpen={isOpen} onClose={onClose} isCentered>
          <AlertDialogOverlay>
            <AlertDialogContent bg="white">
              <AlertDialogHeader fontSize="lg" fontWeight="bold" color="gray.800" pb={4}>
                Eliminar Producto
              </AlertDialogHeader>
              <AlertDialogBody color="gray.600">
                ¿Estás seguro de que deseas eliminar el producto{" "}
                <Text as="span" fontWeight="bold" color="gray.800">
                  {productoAEliminar?.nombre}
                </Text>
                ? Esta acción no se puede deshacer.
              </AlertDialogBody>
              <AlertDialogFooter gap={3}>
                <Button
                  bg="red.500"
                  onClick={handleEliminarProducto}
                  _hover={{ bg: "red.800" }}
                  isLoading={isLoading}
                  leftIcon={<FaTrash />}
                  color="white"
                >
                  Eliminar
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  bg="gray.500"
                  _hover={{ bg: "gray.800" }}
                  color="white"
                  isDisabled={isLoading}
                >
                  Cancelar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        </Box>
      </>
      
    );
  };

  export default ListaProductos;