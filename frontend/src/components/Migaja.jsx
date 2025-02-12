import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const Migaja = () => {
  const { userRole } = useAuth();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0 || location.pathname === "/login") return null;

  // Función para formatear el nombre de la ruta
  const formatBreadcrumb = (text) => {
    return text
      .replace(/-/g, " ") // Reemplaza guiones por espacios
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Separa palabras en camelCase
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitaliza la primera letra de cada palabra
  };

  return (
    <Breadcrumb
      fontSize="lg"
      px={6}
      py={3}
      separator="›"
      color="black"
      borderRadius="md"
      boxShadow="md"
    >
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to= {userRole === 'cliente' ? "/clienteProfile" : "/panelAdministrativo"} color="teal.500" fontWeight="bold">
          Inicio
        </BreadcrumbLink>
      </BreadcrumbItem>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        return (
          <BreadcrumbItem key={to}>
            <BreadcrumbLink as={Link} to={to} color="blackAlpha.700" fontWeight="bold">
              {formatBreadcrumb(value)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export default Migaja;
