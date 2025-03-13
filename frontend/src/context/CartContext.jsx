import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { agregarProductoAlCarrito, listarDetallesCarrito } from "../services/api"; // Cambiamos obtenerCarrito por listarDetallesCarrito
import { useAuth } from "../context/AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      setLoading(false);
      return;
    }
    
    try {
      const data = await listarDetallesCarrito();
      // Asegúrate de la estructura de respuesta de tu API aquí
      setCart(Array.isArray(data) ? data : data?.detalles || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el carrito",
        status: "error",
        duration: 2000,
      });
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
    const interval = setInterval(fetchCart, 120000);
    return () => clearInterval(interval);
  }, [user]);

  const addToCart = async (product) => {
    try {
      const detalleData = { 
        cantidad: product.cantidad, 
        subtotal: product.precio,
      };

      await agregarProductoAlCarrito(product.id, detalleData);
      
      // Actualización optimista
      setCart(prev => [
        ...prev,
        {
          ...product,
          cantidad: product.cantidad,
          subtotal: product.precio,
          producto_id: product.id,
          id: Date.now() // ID temporal hasta la próxima actualización
        }
      ]);


      // Refrescamos los datos reales después de 1s
      setTimeout(fetchCart, 1000);
      
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Error al agregar producto",
        status: "error",
        duration: 2000,
      });
      fetchCart(); // Recuperamos estado real
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart,
      cartCount: cart.reduce((acc, item) => acc + item.cantidad, 0),
      loading,
      refreshCart: fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);