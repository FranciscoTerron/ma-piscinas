import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

const Migaja = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null; // No mostrar en la página de inicio

  return (
    <Breadcrumb
      fontSize="lg"
      px={6}
      py={3}
      separator="›"
      color="black" // Texto blanco
      borderRadius="md"
      boxShadow="md"
    >
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to="/" color="teal.500" fontWeight="bold">
          Inicio
        </BreadcrumbLink>
      </BreadcrumbItem>
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        return (
          <BreadcrumbItem key={to}>
            <BreadcrumbLink as={Link} to={to} color="blackAlpha.700" fontWeight="bold">
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export default Migaja;
