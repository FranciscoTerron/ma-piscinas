import { useEffect, useState } from "react";
import { listarProductos } from "../../services/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';

const Inicio = () => {
  const [productos, setProductos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const data = await listarProductos(pagina, 10);
        setProductos(data.productos);
        setTotalPaginas(Math.ceil(data.total / 10)); // Calculamos total de páginas
      } catch (error) {
        console.error("Error al cargar productos:", error);
      }
    };

    cargarProductos();
  }, [pagina]);

  return (
    <div>
      {/* Sección de Banner con Carousel */}
      <div className="container mt-3">
        <Carousel>
          {[1, 2, 3].map((index) => (
            <Carousel.Item key={index}>
              <img
                src={`https://via.placeholder.com/800x400?text=Imagen+de+Banner+${index}`} // Imagen por defecto
                className="d-block w-100"
                alt={`Imagen de Banner ${index}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Sección de Categorías */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Categorías</h2>
        <div className="row">
          {['Piscinas', 'Calefacción', 'Estufas a Leña'].map((category, index) => (
            <div className="col-md-4" key={index}>
              <div className="card text-white">
                <img
                  src={`https://via.placeholder.com/400x250?text=${category}`}
                  className="card-img"
                  alt={category}
                />
                <div className="card-img-overlay d-flex flex-column justify-content-end" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <h4 className="card-title text-white">{category}</h4>
                  <a href="#" className="btn btn-primary">Ver Productos</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sección de Ofertas Especiales con Carousel */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Ofertas Especiales</h2>
        <Carousel>
          {[0, 1].map((slideIndex) => (
            <Carousel.Item key={slideIndex}>
              <div className="row">
                {productos.slice(slideIndex * 4, (slideIndex + 1) * 4).map((item) => (
                  <div className="col-md-3" key={item.id}>
                    <div className="card">
                      <img
                        src={item.imagen || "/placeholder.jpg"} // Imagen por defecto
                        className="card-img-top"
                        alt={item.nombre}
                      />
                      <div className="card-body text-center">
                        <h5 className="card-title">{item.nombre}</h5>
                        <p className="text-muted">
                          <del>${item.precio + 200}</del> <span className="text-danger">${item.precio}</span>
                        </p>
                        <button className="btn btn-primary">Agregar al Carrito</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* Paginación de Productos */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={pagina === 1}
          onClick={() => setPagina(pagina - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-lg">Página {pagina} de {totalPaginas}</span>
        <button
          disabled={pagina === totalPaginas}
          onClick={() => setPagina(pagina + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Inicio;
