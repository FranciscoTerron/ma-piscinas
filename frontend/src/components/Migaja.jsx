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

  const resetRoutes = ["/perfilUsuario", "/inicio" , "/register"];
  const homePath = userRole === "cliente" ? "/inicio" : "/panelAdministrativo";

  useEffect(() => {
    setHistory((prev) => {
      let newHistory;

      if (location.pathname === homePath) {
        newHistory = [homePath]; // Solo debe estar HomePath
      } else if (resetRoutes.includes(location.pathname)) {
        newHistory = [homePath, location.pathname]; // Reinicia con Home y la ruta actual
      } else {
        newHistory = prev.includes(location.pathname)
          ? prev.slice(0, prev.indexOf(location.pathname) + 1) // Si ya existe, corta hasta ahí
          : [...prev, location.pathname]; // Agrega la nueva ruta
      }

      // Evita duplicados de HomePath
      newHistory = newHistory.filter((path, index) => index === 0 || path !== homePath);

      localStorage.setItem("breadcrumbHistory", JSON.stringify(newHistory));
      return newHistory;
    });
  }, [location.pathname, homePath]);

  // No mostrar migaja si solo está "Inicio" o estamos en login
  if (history.length <= 1 || location.pathname === "/login") {
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
