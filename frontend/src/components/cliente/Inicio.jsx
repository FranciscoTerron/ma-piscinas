import { useEffect, useState,useCallback,useRef } from "react";
import { obtenerProductosDescuento, listarCategorias } from "../../services/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast, Badge, Box, useDisclosure, Image, VStack, Button } from "@chakra-ui/react";
import ProductoModal from "../cliente/Productos/ProductoModal"; // Ajusta la ruta según tu proyecto
import './inicio.css';
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiEye } from "react-icons/fi";


const Inicio = () => {
  const [productos, setProductos] = useState([]); // Productos con descuento
  const [categorias, setCategorias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const { addToCart } = useCart();
  const toast = useToast();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const toastRef = useRef({});
  

  // Estados y hook para el modal
  const { isOpen: isModalOpen, onOpen: openModal, onClose: closeModal } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [descuentoData, categoriasData] = await Promise.all([
          obtenerProductosDescuento(pagina, 10),
          listarCategorias(),
        ]);
        setProductos(descuentoData.productos);
        setTotalPaginas(Math.ceil(descuentoData.total / 10));
        setCategorias(categoriasData.categorias);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, [pagina]);

   // Función que navega a la vista completa del producto
    const handleProductClick = useCallback((producto) => {
      navigate(`/producto/${producto.id}`);
    }, [navigate]);
  
    const handleAddToCart = useCallback((producto, qty = 1) => {
      if (isAdding) return; // Evitar múltiples ejecuciones
      setIsAdding(true);
      addToCart({ ...producto, cantidad: qty }); // Pasa la cantidad
      const uniqueId = producto.id;
      if (!toastRef.current[uniqueId]) {
        toastRef.current[uniqueId] = true;
        toast({
          id: `producto-agregado-${uniqueId}`,
          title: "Producto agregado",
          description: `${qty} ${producto.nombre} agregado(s) al carrito`, 
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
          onCloseComplete: () => {
            delete toastRef.current[uniqueId];
            setIsAdding(false);
          },
        });
      }
      
      if (isModalOpen) closeModal();
    }, [addToCart, toast, isModalOpen, closeModal, isAdding]);

  // Función para abrir el modal al hacer clic en el badge
  const handleOpenModal = (producto) => {
    setSelectedProduct(producto);
    setQuantity(1);
    openModal();
  };

  return (
    <div className="bg-gradient-light min-vh-100">
      {/* Banner con Carousel */}
      <div className="container main-container fade-in">
        <Carousel indicators={true} interval={5000} className="shadow-lg rounded-3 overflow-hidden">
          {[1, 2, 3].map((index) => (
            <Carousel.Item key={index}>
              <img
                src={`https://placehold.co/1200x450/007bff/fff?text=Oferta+Especial+${index}`}
                className="d-block w-100"
                alt={`Banner ${index}`}
              />
              <Carousel.Caption>
                <h3 className="mb-3">Oferta Especial #{index}</h3>
                <p className="mb-4 fs-5">
                  ¡Descubre nuestras promociones exclusivas y ahorra en tus compras favoritas!
                </p>
                <Link to="/productos" className="btn btn-custom">
                  Ver Ofertas
                </Link>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

     {/* Sección de Categorías */}
      <div className="container mt-5 pt-4">
        <h2 className="section-title ">Explora Nuestras Categorías</h2>
        <div className="row g-4">
          {categorias.map((category) => (
            <div className="col-md-4" key={category.id}>
              <div className="card category-card text-white border-0 rounded-3 overflow-hidden">
                <img
                  src={category.imagen || `https://placehold.co/400x280/333/fff?text=${category.nombre}`}
                  className="card-img"
                  alt={category.nombre}
                />
                <div className="card-img-overlay d-flex flex-column justify-content-end p-4">
                  <h4 className="card-title mb-3 fw-bold">{category.nombre}</h4>
                  <p className="card-text mb-3 d-none d-md-block">
                    Descubre nuestra selección de productos en esta categoría.
                  </p>
                  <Link to={`/productos?categoria=${category.id}`} className="btn btn-custom">
                    Explorar Categoría
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Sección de Ofertas Especiales */}
      <div className="container mt-5 pt-4">
        <h2 className="section-title">Ofertas Especiales</h2>
        <Carousel interval={6000} pause="hover" controls={true} indicators={false} className="product-carousel">
          {Array.from({ length: Math.ceil(productos.length / 3) }).map((_, slideIndex) => (
            <Carousel.Item key={slideIndex}>
              <div className="row g-4 justify-content-center">
                {productos.slice(slideIndex * 3, (slideIndex + 1) * 3).map((item) => (
                  <div className="col-md-4" key={item.id}>
                    <div className="card product-card border-0 rounded-3 overflow-hidden position-relative h-100">
                      {/* Contenedor de imagen y badge usando Chakra Box */}
                      <Box position="relative" mb={4} borderRadius="md" overflow="hidden">
                        <Image
                          src={item.imagen || `https://placehold.co/300x220/007bff/fff?text=${item.nombre}`}
                          alt={item.nombre}
                          borderRadius="md"
                          objectFit="cover"
                          h="200px"
                          w="full"
                          fallbackSrc="https://via.placeholder.com/300x200?text=Imagen+no+disponible"
                        />
                        {/* Badge de descuento con la misma lógica y estilos de ProductoItem */}
                        {item.descuento && (
                          <Badge
                            onClick={() => handleOpenModal(item)}
                            cursor="pointer"
                            fontSize="0.85rem"
                            fontWeight="bold"
                            bg={item.descuento.tipo === "ENVIO_GRATIS" ? "green.500" : "red.500"}
                            color="white"
                            position="absolute"
                            top={0}
                            left={0}
                            m="2"
                            px="2"
                            py="1"
                            borderRadius="md"
                            boxShadow="sm"
                          >
                            {item.descuento.tipo === "PORCENTAJE"
                              ? `${item.descuento.valor}% OFF`
                              : item.descuento.tipo === "CUOTAS_SIN_INTERES"
                              ? `${item.descuento.valor} Cuotas sin Interés`
                              : item.descuento.tipo === "ENVIO_GRATIS"
                              ? "ENVÍO GRATIS"
                              : ""}
                          </Badge>
                        )}
                      </Box>

                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title fw-bold mb-2">{item.nombre}</h5>
                        {item.descuento && item.descuento.tipo === "PORCENTAJE" ? (
                          <div className="mb-3">
                            <del className="text-muted me-2">
                              ${item.precio.toLocaleString()}
                            </del>
                            <span className="price-discount text-danger">
                              ${ (item.precio * (1 - item.descuento.valor / 100)).toLocaleString() }
                            </span>
                          </div>
                        ) : (
                          <div className="price-display fw-semibold mb-3">
                            ${item.precio.toLocaleString()}
                          </div>
                        )}
                        {item.descuento && item.descuento.tipo === "CUOTAS_SIN_INTERES" && (
                          <div className="cuotas-badge mb-3 align-self-start">
                            {item.descuento.valor} cuotas sin interés de ${ (item.precio / item.descuento.valor).toLocaleString() }
                          </div>
                        )}
                         <Button
                            colorScheme="blue"
                            w="full"
                            leftIcon={<FiShoppingCart />}
                            _hover={{ transform: "scale(1.02)" }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item, quantity); // Pasa la cantidad
                            }}
                          >
                            Agregar al carrito
                          </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Banner promocional */}
      <div className="container mt-5">
        <div
          className="bg-dark text-white p-4 p-md-5 rounded-3 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #0056b3 0%, #007bff 100%)",
            borderRadius: "12px",
          }}
        >
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3 className="fw-bold mb-3">¡Ofertas por tiempo limitado!</h3>
              <p className="mb-4 fs-5">
                Descubre nuestras promociones exclusivas antes de que terminen.
              </p>
              <Link to="/productos" className="btn btn-light fw-semibold px-4 py-2">
                Ver Todas las Ofertas
              </Link>
            </div>
            <div className="col-md-4 d-none d-md-block text-center">
              <img
                src="https://placehold.co/200x200/ffffff/0056b3?text=OFERTA"
                className="img-fluid rounded-circle"
                alt="Oferta Especial"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controles de paginación */}
      {totalPaginas > 1 && (
        <div className="container mt-5 text-center">
          <div className="btn-group">
            <button
              className="btn btn-outline-primary pagination-btn"
              onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
              disabled={pagina === 1}
            >
              &laquo; Anterior
            </button>
            <button
              className="btn btn-outline-primary pagination-btn"
              onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={pagina === totalPaginas}
            >
              Siguiente &raquo;
            </button>
          </div>
          <p className="text-muted mt-2">
            Página {pagina} de {totalPaginas}
          </p>
        </div>
      )}

      {/* Modal de producto */}
      {selectedProduct && (
        <ProductoModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedProduct={selectedProduct}
          quantity={quantity}
          setQuantity={setQuantity}
          handleAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
};

export default Inicio;
