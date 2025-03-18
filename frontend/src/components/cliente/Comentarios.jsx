import React, { useState, useEffect } from 'react';
import {
  Box, VStack, Text, Textarea, Select, Button, Flex, HStack,
  Avatar, Icon, Divider, Badge, IconButton, Tooltip,
  useToast
} from '@chakra-ui/react';
import { FiStar, FiTrash2, FiChevronsLeft, FiChevronLeft, FiChevronRight, FiChevronsRight } from 'react-icons/fi';

const Comentarios = ({ 
  comentarios = [],
  nuevoComentario = '',
  setNuevoComentario,
  calificacion = 5,
  setCalificacion,
  currentUserId,
  enviarComentario,
  openDeleteAlert,
  hasCommented
}) => {
  const [comentariosFiltrados, setComentariosFiltrados] = useState([]);
  const [ordenActual, setOrdenActual] = useState('recientes');
  const [paginaActual, setPaginaActual] = useState(1);
  const comentariosPorPagina = 3;

  // Efecto para aplicar filtrado y ordenamiento
  useEffect(() => {
    let comentariosOrdenados = [...comentarios];
    
    // Aplicar ordenamiento
    switch (ordenActual) {
      case 'recientes':
        comentariosOrdenados.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
        break;
      case 'antiguos':
        comentariosOrdenados.sort((a, b) => new Date(a.fecha_creacion) - new Date(b.fecha_creacion));
        break;
      case 'calificacion':
        comentariosOrdenados.sort((a, b) => b.calificacion - a.calificacion);
        break;
      default:
        break;
    }
    
    setComentariosFiltrados(comentariosOrdenados);
    // Resetear a la primera página cuando cambia el orden
    setPaginaActual(1);
  }, [comentarios, ordenActual]);

  // Manejador para cambio de orden
  const handleOrdenChange = (e) => {
    setOrdenActual(e.target.value);
  };

  // Calcular comentarios para la página actual
  const indexUltimoComentario = paginaActual * comentariosPorPagina;
  const indexPrimerComentario = indexUltimoComentario - comentariosPorPagina;
  const comentariosActuales = comentariosFiltrados.slice(indexPrimerComentario, indexUltimoComentario);
  
  // Calcular total de páginas
  const totalPaginas = Math.ceil(comentariosFiltrados.length / comentariosPorPagina);

  // Funciones para paginación
  const irAPagina = (numeroPagina) => {
    if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  // Generar números de página para mostrar
  const mostrarNumerosPagina = () => {
    const paginas = [];
    const paginasParaMostrar = 3; // Cantidad de números de página a mostrar
    
    let startPage = Math.max(1, paginaActual - Math.floor(paginasParaMostrar / 2));
    const endPage = Math.min(totalPaginas, startPage + paginasParaMostrar - 1);
    
    // Ajustar startPage si estamos cerca del final
    if (totalPaginas - endPage < Math.floor(paginasParaMostrar / 2)) {
      startPage = Math.max(1, endPage - paginasParaMostrar + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      paginas.push(
        <Button 
          key={i} 
          size="sm" 
          variant={paginaActual === i ? "solid" : "outline"} 
          colorScheme={paginaActual === i ? "blue" : "gray"}
          onClick={() => irAPagina(i)}
        >
          {i}
        </Button>
      );
    }
    return paginas;
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Formulario de comentarios mejorado */}
      {hasCommented ? (
        <Box
          borderWidth="1px"
          borderColor="blue.100"
          borderRadius="lg"
          p={5}
          bg="blue.50"
          boxShadow="sm"
        >
          <Text fontSize="lg" fontWeight="bold" mb={3} color="blue.700">
            Ya has dejado un comentario para este producto.
          </Text>
        </Box>
      ) : (
        <Box
          borderWidth="1px"
          borderColor="blue.100"
          borderRadius="lg"
          p={5}
          bg="blue.50"
          boxShadow="sm"
        >
        <Text fontSize="lg" fontWeight="bold" mb={3} color="blue.700">
          Deja tu opinión
        </Text>
        
        <Textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          placeholder="¿Qué te pareció este producto?"
          mb={3}
          borderColor="blue.200"
          _hover={{ borderColor: "blue.300" }}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
          bg="white"
          resize="vertical"
          minH="100px"
        />
        
        <Flex 
          direction={{ base: "column", sm: "row" }} 
          justify="space-between" 
          align={{ base: "start", sm: "center" }}
        >
          <HStack spacing={2} mb={{ base: 3, sm: 0 }}>
            <Text fontWeight="medium" color="gray.700">Calificación:</Text>
            <Select
              value={calificacion}
              onChange={(e) => setCalificacion(parseInt(e.target.value))}
              width="150px"
              bg="white"
              borderColor="blue.200"
              _hover={{ borderColor: "blue.300" }}
              _focus={{ borderColor: "blue.500" }}
            >
              {[5, 4, 3, 2, 1].map(num => (
                <option key={num} value={num}>
                  {num} {Array(num).fill('★').join('')} {Array(5-num).fill('☆').join('')}
                </option>
              ))}
            </Select>
          </HStack>
          
          <Button
            colorScheme="blue"
            onClick={enviarComentario}
            isDisabled={!nuevoComentario.trim()}
            leftIcon={<FiStar />}
            px={6}
            borderRadius="md"
            boxShadow="md"
            _hover={{ transform: "translateY(-1px)", boxShadow: "lg" }}
            _active={{ transform: "translateY(0)", boxShadow: "md" }}
          >
            Publicar Reseña
          </Button>
        </Flex>
      </Box>
      )}
      {/* Encabezado de comentarios */}
      <Box mb={2}>
        <Flex justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="bold" color="gray.700">
            Opiniones de clientes ({comentarios.length})
          </Text>
          {comentarios.length > 0 && (
            <HStack>
              <Text fontWeight="medium" color="gray.500">Ordenar por:</Text>
              <Select 
                size="sm" 
                width="150px" 
                value={ordenActual}
                onChange={handleOrdenChange}
              >
                <option value="recientes">Más recientes</option>
                <option value="antiguos">Más antiguos</option>
                <option value="calificacion">Mayor calificación</option>
              </Select>
            </HStack>
          )}
        </Flex>
      </Box>
      
      {/* Lista de comentarios mejorada */}
      {comentarios.length === 0 ? (
        <Box 
          textAlign="center" 
          py={10} 
          px={6} 
          bg="gray.50" 
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor="gray.200"
          borderStyle="dashed"
        >
          <Icon as={FiStar} w={10} h={10} color="gray.400" mb={4} />
          <Text color="gray.500" fontWeight="medium">
            Sé el primero en opinar sobre este producto
          </Text>
        </Box>
      ) : (
        <VStack spacing={4} align="stretch" divider={<Divider />}>
          {comentariosActuales.map(comentario => (
            <Box 
              key={comentario.id} 
              position="relative"
              transition="transform 0.2s"
              _hover={{ transform: "translateY(-2px)" }}
            >
              {/* Línea indicadora de calificación */}
              <Box 
                position="absolute" 
                left="0" 
                top="0" 
                bottom="0" 
                width="3px" 
                borderRadius="full"
                bg={
                  comentario.calificacion >= 4 ? "green.400" :
                  comentario.calificacion >= 3 ? "blue.400" :
                  comentario.calificacion >= 2 ? "orange.400" : "red.400"
                }
              />
              
              <Box pl={4}>
                {/* Cabecera del comentario */}
                <Flex justify="space-between" align="center" mb={2}>
                  <HStack>
                    <Avatar 
                      size="sm" 
                      name={comentario.usuario_id.nombre} 
                      bg="blue.500" 
                      color="white"
                      src={comentario.usuario_id.avatar || undefined}
                    />
                    <Box>
                      <Text fontWeight="bold" color="gray.800">
                        {comentario.usuario_id.nombre}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {new Date(comentario.fecha_creacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                    </Box>
                  </HStack>
                  
                  {/* Botón eliminar para comentarios propios */}
                  {comentario.usuario_id.id === currentUserId && (
                    <Tooltip label="Eliminar comentario" hasArrow placement="left">
                      <IconButton
                        aria-label="Eliminar comentario"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => openDeleteAlert(comentario.id)}
                      />
                    </Tooltip>
                  )}
                </Flex>
                
                {/* Calificación visualizada con estrellas */}
                <HStack mb={2} spacing={1}>
                  {[...Array(5)].map((_, i) => (
                    <Icon 
                      key={i} 
                      as={FiStar} 
                      color={i < comentario.calificacion ? "yellow.400" : "gray.300"} 
                      fill={i < comentario.calificacion ? "yellow.400" : "none"}
                      strokeWidth={1}
                    />
                  ))}
                  <Badge 
                    ml={2} 
                    colorScheme={
                      comentario.calificacion >= 4 ? "green" :
                      comentario.calificacion >= 3 ? "blue" :
                      comentario.calificacion >= 2 ? "orange" : "red"
                    }
                    borderRadius="full"
                    px={2}
                  >
                    {comentario.calificacion}/5
                  </Badge>
                </HStack>
                
                {/* Texto del comentario */}
                <Text 
                  color="gray.700" 
                  fontSize="md" 
                  lineHeight="tall"
                  bg="white"
                  p={3}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="gray.100"
                >
                  {comentario.texto}
                </Text>
              </Box>
            </Box>
          ))}
        </VStack>
      )}
      
      {/* Paginación para más de 3 comentarios */}
      {comentarios.length > comentariosPorPagina && (
        <Flex justify="center" mt={6}>
          <HStack spacing={2}>
            <IconButton
              icon={<FiChevronsLeft />}
              size="sm"
              onClick={() => irAPagina(1)}
              isDisabled={paginaActual === 1}
              aria-label="Primera página"
            />
            <IconButton
              icon={<FiChevronLeft />}
              size="sm"
              onClick={() => irAPagina(paginaActual - 1)}
              isDisabled={paginaActual === 1}
              aria-label="Página anterior"
            />
            
            {mostrarNumerosPagina()}
            
            <IconButton
              icon={<FiChevronRight />}
              size="sm"
              onClick={() => irAPagina(paginaActual + 1)}
              isDisabled={paginaActual === totalPaginas}
              aria-label="Página siguiente"
            />
            <IconButton
              icon={<FiChevronsRight />}
              size="sm"
              onClick={() => irAPagina(totalPaginas)}
              isDisabled={paginaActual === totalPaginas}
              aria-label="Última página"
            />
          </HStack>
        </Flex>
      )}
    </VStack>
  );
};

export default Comentarios;