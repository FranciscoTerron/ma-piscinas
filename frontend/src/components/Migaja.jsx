import React, { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Migaja = () => {
  const { userRole } = useAuth();
  const location = useLocation();
  const [history, setHistory] = useState([]);

  const homePath = userRole === "cliente" ? "/inicio" : "/panelAdministrativo";
  const resetRoutes = ["/perfilUsuario", "/registrar", "/inicio", "/contacto", "/quienesSomos","/comoComprar","/productos","/politicasDeDevolucion"];

  useEffect(() => {
    let newHistory;

    if (location.pathname === homePath) {
      // Si estamos en la página de inicio, solo debe haber una entrada en el historial
      newHistory = [homePath];
    } else if (resetRoutes.includes(location.pathname)) {
      // Si la ruta es una de las que deben reiniciar el historial
      newHistory = [homePath, location.pathname];
    } else {
      // Obtener historial anterior
      const previousHistory = JSON.parse(localStorage.getItem("breadcrumbHistory")) || [];

      if (previousHistory.includes(location.pathname)) {
        // Si ya existe en el historial, cortamos hasta ahí
        newHistory = previousHistory.slice(0, previousHistory.indexOf(location.pathname) + 1);
      } else {
        // Si es una nueva ruta, la agregamos al historial asegurando que Inicio es único
        newHistory = [homePath, ...previousHistory.filter(path => path !== homePath), location.pathname];
      }
    }

    // Guardar en localStorage
    localStorage.setItem("breadcrumbHistory", JSON.stringify(newHistory));
    setHistory(newHistory);
  }, [location.pathname, homePath]);

  // No mostrar migaja si estamos en login o si solo está "Inicio"
  if (history.length <= 1 || location.pathname === "/login" || location.pathname === "/inicio" || location.pathname === "/registrar") {
    return null;
  }

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
      {history.map((path, index) => (
        <BreadcrumbItem key={path}>
          <BreadcrumbLink as={Link} to={path} color={index === 0 ? "teal.500" : "blackAlpha.700"} fontWeight="bold">
            {index === 0 ? "Inicio" : formatBreadcrumb(path.split("/").pop())}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default Migaja;
