import { useEffect, useState } from "react";
import { listarProductos, listarCategorias } from "../../services/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import { Link } from "react-router-dom";

const Inicio = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [productosData, categoriasData] = await Promise.all([
          listarProductos(pagina, 10),
          listarCategorias(),
        ]);
        setProductos(productosData.productos);
        setTotalPaginas(Math.ceil(productosData.total / 10));
        setCategorias(categoriasData.categorias);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };
    cargarDatos();
  }, [pagina]);

  return (
    <div className="bg-light min-vh-100">
      <style>
        {`
          .carousel-inner img { object-fit: cover; height: 400px; border-radius: 10px; }
          .card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .card:hover { transform: translateY(-5px); box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); }
          .category-card img { height: 250px; object-fit: cover; }
          .product-card img { height: 200px; object-fit: cover; }
          .btn-custom { background-color: #007bff; border: none; padding: 10px 20px; font-weight: 500; }
          .btn-custom:hover { background-color: #0056b3; }
          .pagination-btn { padding: 8px 16px; font-weight: 500; }
          .pagination-btn:disabled { background-color: #ccc; cursor: not-allowed; }
          .carousel-control-prev-icon, .carousel-control-next-icon { 
            background-color: rgba(0, 0, 0, 0.6); border-radius: 50%; width: 40px; height: 40px; 
          }
          .carousel-control-prev, .carousel-control-next { width: 5%; opacity: 0.8; }
          .carousel-control-prev:hover, .carousel-control-next:hover { opacity: 1; }
        `}
      </style>

      {/* Sección de Banner con Carousel */}
      <div className="container mt-4">
        <Carousel>
          {[1, 2, 3].map((index) => (
            <Carousel.Item key={index}>
              <img
                src={`https://placehold.co/1200x400/gray/fff?text=Banner+${index}`}
                className="d-block w-100"
                alt={`Banner ${index}`}
              />
              <Carousel.Caption>
                <h3 className="text-white">Oferta Especial #{index}</h3>
                <p className="text-white">¡Descubre nuestras promociones exclusivas!</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Sección de Categorías */}
      <div className="container mt-5">
        <h2 className="text-center mb-4 fw-bold text-dark">Explora Nuestras Categorías</h2>
        <div className="row g-4">
          {categorias.map((category) => (
            <div className="col-md-4" key={category.id}>
              <div className="card category-card text-white border-0 rounded-3 overflow-hidden">
                <img
                  src={`https://placehold.co/400x250/333/fff?text=${category.nombre}`}
                  className="card-img"
                  alt={category.nombre}
                />
                <div className="card-img-overlay d-flex flex-column justify-content-end p-3" style={{ background: 'rgba(0,0,0,0.5)' }}>
                  <h4 className="card-title mb-2">{category.nombre}</h4>
                  <Link
                    to={`/productos?categoria=${category.id}`}
                    className="btn btn-custom text-white"
                  >
                    Ver Productos
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Ofertas Especiales con Carousel */}
      <div className="container mt-5">
        <h2 className="text-center mb-4 fw-bold text-dark">Ofertas Especiales</h2>
        <Carousel interval={5000} pause="hover" controls={true} indicators={false}>
          {Array.from({ length: Math.ceil(productos.length / 3) }).map((_, slideIndex) => (
            <Carousel.Item key={slideIndex}>
              <div className="row g-4 justify-content-center">
                {productos.slice(slideIndex * 3, (slideIndex + 1) * 3).map((item) => (
                  <div className="col-md-4" key={item.id}>
                    <div className="card product-card border-0 rounded-3 overflow-hidden">
                      <img
                        src={item.imagen || 'https://placehold.co/300x200/eee/333?text=Producto'}
                        className="card-img-top"
                        alt={item.nombre}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title fw-semibold">{item.nombre}</h5>
                        <p className="text-muted mb-2">
                          <del>${(item.precio + 200).toLocaleString()}</del>{' '}
                          <span className="text-danger fw-bold">${item.precio.toLocaleString()}</span>
                        </p>
                        <button className="btn btn-custom text-white">Agregar al Carrito</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Inicio;