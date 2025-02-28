import React, { useState } from "react";
import { Flex, Box, Button, VStack, useDisclosure, Heading, Icon, useColorModeValue, Divider, Tooltip } from "@chakra-ui/react";
import { FiUser, FiMapPin, FiChevronRight, FiChevronLeft, FiShoppingBag } from "react-icons/fi";
import PerfilUsuario from "./PerfilUsuario";
import DireccionesEnvio from "./DireccionesEnvio";
import HistorialPedidos from "./HistorialPedidos";

const PerfilCompleto = () => {
  const [selectedOption, setSelectedOption] = useState("perfil");
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

  const bgAside = useColorModeValue("gray.50", "gray.700");
  const bgContent = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const activeButtonBg = useColorModeValue("blue.500", "blue.400");

  const menuOptions = [
    { id: "perfil", label: "Datos Personales", icon: FiUser },
    { id: "direcciones", label: "Direcciones de Envío", icon: FiMapPin },
    { id: "pedidos", label: "Historial de Pedidos", icon: FiShoppingBag },
  ];

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={6}
      p={{ base: 3, md: 5 }}
      maxW="1300px"
      mx="auto"
    >
      {/* Menú aside */}
      <Box
        as="aside"
        width={{ base: "100%", md: isOpen ? "250px" : "80px" }}
        minW={{ base: "100%", md: isOpen ? "250px" : "80px" }}
        transition="all 0.3s ease"
        bg={bgAside}
        p={4}
        borderRadius="lg"
        boxShadow="sm"
        borderWidth="1px"
        borderColor={borderColor}
        h={{ base: "auto", md: "fit-content" }}
      >
        <VStack align="start" spacing={4} width="100%">
          {/* Botón para mostrar/ocultar */}
          <Flex width="100%" justify="space-between" align="center" mb={2}>
            <Heading
              size="sm"
              display={{ base: "block", md: isOpen ? "block" : "none" }}
            >
              Mi Perfil
            </Heading>
            <Button
              onClick={onToggle}
              size="sm"
              variant="ghost"
              borderRadius="full"
              ml="auto"
              aria-label={isOpen ? "Ocultar menú" : "Mostrar menú"}
            >
              <Icon as={isOpen ? FiChevronLeft : FiChevronRight} />
            </Button>
          </Flex>

          <Divider />

          {/* Opciones del menú */}
          {menuOptions.map((option) => (
            <Tooltip
              key={option.id}
              label={option.label}
              placement="right"
              isDisabled={isOpen}
              hasArrow
              openDelay={500}
            >
              <Button
                w="100%"
                h="50px"
                justifyContent={isOpen ? "flex-start" : "center"}
                variant={selectedOption === option.id ? "solid" : "ghost"}
                colorScheme={selectedOption === option.id ? "blue" : "gray"}
                leftIcon={<Icon as={option.icon} boxSize={5} />}
                onClick={() => setSelectedOption(option.id)}
                borderRadius="md"
                transition="all 0.2s"
                _hover={{ bg: selectedOption === option.id ? activeButtonBg : "gray.100" }}
              >
                {isOpen && option.label}
              </Button>
            </Tooltip>
          ))}
        </VStack>
      </Box>

      {/* Contenido principal */}
      <Box
        flex={1}
        bg={bgContent}
        p={6}
        borderRadius="lg"
        boxShadow="sm"
        borderWidth="1px"
        borderColor={borderColor}
      >
        {selectedOption === "perfil" ? (
          <PerfilUsuario />
        ) : selectedOption === "direcciones" ? (
          <DireccionesEnvio />
        ) : (
          <HistorialPedidos />
        )}
      </Box>
    </Flex>
  );
};

export default PerfilCompleto;