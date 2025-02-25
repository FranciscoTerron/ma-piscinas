import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useToast,
} from "@chakra-ui/react";
import { crearSubcategoria, actualizarSubcategoria, listarCategorias } from "../../../../../services/api";

const initialSubcategoriaState = {
  nombre: "",
  categoriaId: "",
};

const FormularioSubCate = ({ isOpen, onClose, onSubmitSuccess, subcategoria }) => {
  const [formData, setFormData] = useState(initialSubcategoriaState);
  const [categorias, setCategorias] = useState([]);
  const toast = useToast();

  useEffect(() => {
    // Cargar la lista de categorías al abrir el modal
    const fetchCategorias = async (pagina,tamanio) => {
      try {
        const response = await listarCategorias(pagina,tamanio);
        setCategorias(response.categorias); 
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las categorías.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen, toast]);

  useEffect(() => {
    if (subcategoria) {
      setFormData({
        nombre: subcategoria.nombre,
        categoriaId: subcategoria.categoria_id || "", // Asegúrate de usar "categoria_id"
      });
    } else {
      setFormData(initialSubcategoriaState);
    }
  }, [subcategoria]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      let nuevaSubcategoria;
      if (subcategoria) {
        await actualizarSubcategoria(subcategoria.id, formData);
        nuevaSubcategoria = { ...subcategoria, ...formData }; // Combinar datos existentes con los actualizados
        toast({
          title: "Éxito",
          description: "Subcategoría actualizada correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        nuevaSubcategoria = await crearSubcategoria(formData); // Suponiendo que crearSubcategoria devuelve la subcategoría creada
        toast({
          title: "Éxito",
          description: "Subcategoría agregada correctamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      onSubmitSuccess(nuevaSubcategoria); // Pasar la subcategoría al callback
      onClose();
      setFormData(initialSubcategoriaState);
    } catch (error) {
      console.error("Error al enviar la subcategoría:", error);
      toast({
        title: "Error",
        description: "No se pudo realizar la operación.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent bg="white">
        <ModalHeader borderBottom="1px" borderColor="gray.900" color={"black"}>
          {subcategoria ? "Editar Subcategoría" : "Agregar Nueva Subcategoría"}
        </ModalHeader>
        <ModalCloseButton color={"black"} />
        <ModalBody bg="white" py={6} color={"black"}>
          <FormControl>
            <FormLabel>Nombre</FormLabel>
            <Input
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre de la subcategoría"
              bg="white"
              border="1px"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300" }}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Categoría</FormLabel>
            <Select
              name="categoriaId"
              value={formData.categoriaId}
              onChange={handleInputChange}
              placeholder="Selecciona una categoría"
              bg="white"
              border="1px"
              borderColor="gray.200"
              _hover={{ borderColor: "gray.300" }}
              sx={{
                '& option': {
                  backgroundColor: 'white !important',
                  color: 'gray.600'
                }
              }}
            >
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </Select>
          </FormControl>
        </ModalBody>
        <ModalFooter borderTop="1px" borderColor="gray.100" bg="gray.50">
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {subcategoria ? "Actualizar" : "Agregar"} 
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormularioSubCate;