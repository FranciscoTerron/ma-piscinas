import React, { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Migaja = () => {
  const { userRole } = useAuth();
  const location = useLocation();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory((prev) => {
      const index = prev.indexOf(location.pathname);
      if (index !== -1) {
        return prev.slice(0, index + 1); // Borra rutas a la derecha si se vuelve atrás
      }
      return [...prev, location.pathname];
    });
  }, [location.pathname]);

  if (history.length === 0 || location.pathname === "/login") return null;

  const formatBreadcrumb = (text) => {
    return text
      .replace(/-/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (char) => char.toUpperCase());
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
        <BreadcrumbLink as={Link} to={userRole === 'cliente' ? "/clienteProfile" : "/panelAdministrativo"} color="teal.500" fontWeight="bold">
          Inicio
        </BreadcrumbLink>
      </BreadcrumbItem>
      
      {history.map((path, index) => (
        <BreadcrumbItem key={path}>
          <BreadcrumbLink as={Link} to={path} color="blackAlpha.700" fontWeight="bold">
            {formatBreadcrumb(path.split("/").pop())}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default Migaja;
