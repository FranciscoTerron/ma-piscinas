import React, { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Migaja = () => {
  const { userRole } = useAuth();
  const location = useLocation();
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("breadcrumbHistory")) || [];
  });

  // Rutas que deben reiniciar el historial
  const resetRoutes = ["/perfilUsuario"];

  // Ruta de inicio según el rol del usuario
  const homePath = userRole === "cliente" ? "/clienteProfile" : "/panelAdministrativo";

  useEffect(() => {
    setHistory((prev) => {
      let newHistory;
      
      if (resetRoutes.includes(location.pathname)) {
        newHistory = [location.pathname]; // Reinicia el historial si es una ruta de reinicio
      } else if (location.pathname === homePath) {
        newHistory = []; // Si vuelve a "Inicio", borra el historial
      } else {
        const index = prev.indexOf(location.pathname);
        if (index !== -1) {
          newHistory = prev.slice(0, index + 1); // Elimina rutas a la derecha si se vuelve atrás
        } else {
          newHistory = [...prev, location.pathname]; // Agrega nueva ruta al historial
        }
      }

      localStorage.setItem("breadcrumbHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  }, [location.pathname, homePath]);

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
        <BreadcrumbLink as={Link} to={homePath} color="teal.500" fontWeight="bold">
          Inicio
        </BreadcrumbLink>
      </BreadcrumbItem>

      {history.map((path) => (
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
