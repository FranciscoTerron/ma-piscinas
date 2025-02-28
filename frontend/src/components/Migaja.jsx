import React, { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listarProductos } from "../services/api"; // Simulación de carga de productos

const Migaja = () => {
  const { userRole } = useAuth();
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [productoNombre, setProductoNombre] = useState("");

  const homePath = userRole === "cliente" ? "/inicio" : "/panelAdministrativo";
  const resetRoutes = ["/perfilUsuario", "/registrar", "/inicio", "/contacto", "/quienesSomos","/comoComprar","/productos","/politicasDeDevolucion", "/FormularioEnvio"];

  useEffect(() => {
    let newHistory;

    if (location.pathname === homePath) {
      newHistory = [homePath];
    } else if (resetRoutes.includes(location.pathname)) {
      newHistory = [homePath, location.pathname];
    } else {
      const previousHistory = JSON.parse(localStorage.getItem("breadcrumbHistory")) || [];

      if (previousHistory.includes(location.pathname)) {
        newHistory = previousHistory.slice(0, previousHistory.indexOf(location.pathname) + 1);
      } else {
        newHistory = [homePath, ...previousHistory.filter(path => path !== homePath), location.pathname];
      }
    }

    localStorage.setItem("breadcrumbHistory", JSON.stringify(newHistory));
    setHistory(newHistory);
  }, [location.pathname, homePath]);

  // Obtener el nombre del producto si la ruta es "/producto/:id"
  useEffect(() => {
    const fetchProductoNombre = async () => {
      const match = location.pathname.match(/^\/producto\/(\d+)$/);
      if (match) {
        const productoId = match[1];
        
        try {
          const productos = await listarProductos(); 
          if (Array.isArray(productos.productos)) {
            const producto = productos.productos.find((p) => p.id === parseInt(productoId));
            setProductoNombre(producto ? producto.nombre : "Producto no encontrado");
          } else {
            console.error("Error: listarProductos() no devolvió un array", productos);
            setProductoNombre("Producto no encontrado");
          }
        } catch (error) {
          console.error("Error al obtener productos:", error);
          setProductoNombre("Error al cargar producto");
        }
      }
    };
  
    fetchProductoNombre();
  }, [location.pathname]);
  

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
      {history.map((path, index) => {
        let label = formatBreadcrumb(path.split("/").pop());

        // Si la ruta es un producto con ID, mostrar su nombre en la migaja
        if (path.startsWith("/producto/") && productoNombre) {
          label = productoNombre;
        }

        return (
          <BreadcrumbItem key={path}>
            <BreadcrumbLink as={Link} to={path} color={index === 0 ? "teal.500" : "blackAlpha.700"} fontWeight="bold">
              {index === 0 ? "Inicio" : label}
            </BreadcrumbLink>
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};

export default Migaja;
