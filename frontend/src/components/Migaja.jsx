import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

const Migaja = () => {
  const location = useLocation(); // Se obtiene la ubicación actual de la URL
  const pathnames = location.pathname.split("/").filter((x) => x); // Divide la ruta en segmentos y elimina vacíos

  // Ocultar migaja en la página de inicio y en la página de login
  if (pathnames.length === 0 || location.pathname === "/login") return null;

  return (
    <Breadcrumb
      fontSize="lg"
      px={6}
      py={3}
      separator="›"
      color="black" // Color del texto
      borderRadius="md"
      boxShadow="md"
    >
      {/* Primer elemento: Enlace a "Inicio" */}
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to="/" color="teal.500" fontWeight="bold">
          Inicio
        </BreadcrumbLink>
      </BreadcrumbItem>

      {/* Genera dinámicamente los elementos de la migaja basados en la URL */}
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        return (
          <BreadcrumbItem key={to}>
            <BreadcrumbLink as={Link} to={to} color="blackAlpha.700" fontWeight="bold">
              {value.charAt(0).toUpperCase() + value.slice(1)} {/* Capitaliza la primera letra */}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export default Migaja;
