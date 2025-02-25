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
  Switch,
  VStack,
} from "@chakra-ui/react";
import { crearDescuento, actualizarDescuento, listarMetodosPago } from "../../../../services/api";

// Estado inicial del formulario
const initialDescuentoState = {
  nombre: "",
  descripcion: "",
  tipo: "PORCENTAJE",
  valor: 0,
  fecha_inicio: "",
  fecha_fin: "",
  condiciones: "",
  activo: true,
  producto_id: null,
  metodo_pago_id: null,
};

const FormularioDescuento = ({ isOpen, onClose, onSubmitSuccess, descuento }) => {
  const [formData, setFormData] = useState(initialDescuentoState);
  const [metodosPago, setMetodosPago] = useState([]);
  const toast = useToast();

  // Cargar datos iniciales si se está editando un descuento
  useEffect(() => {
    if (descuento) {
      setFormData({
        nombre: descuento.nombre,
        descripcion: descuento.descripcion || "",
        tipo: descuento.tipo,
        valor: descuento.valor,
        fecha_inicio: descuento.fecha_inicio.split('T')[0],
        fecha_fin: descuento.fecha_fin ? descuento.fecha_fin.split('T')[0] : "",
        condiciones: descuento.condiciones || "",
        activo: descuento.activo,
        producto_id: descuento.producto_id || null,
        metodo_pago_id: descuento.metodo_pago_id || null,
      });
    } else {
      setFormData(initialDescuentoState); // Resetear al estado inicial si es un nuevo descuento
    }
  }, [descuento]);

  // Cargar métodos de pago
  useEffect(() => {
    const fetchMetodosPago = async () => {
      try {
        const response = await listarMetodosPago();
        setMetodosPago(response.metodosPago);
      } catch (error) {
        console.error("Error al obtener métodos de pago:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los métodos de pago.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchMetodosPago();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en el switch de activo
  const handleSwitchChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      activo: e.target.checked,
    }));
  };

  // Validar y enviar el formulario
  const handleSubmit = async () => {
    try {
      // Validaciones básicas
      if (!formData.nombre.trim()) {
        toast({
          title: "Error",
          description: "El nombre del descuento es obligatorio.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
  
      if (formData.valor <= 0) {
        toast({
          title: "Error",
          description: "El valor debe ser mayor a 0.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
  
      if (!formData.fecha_inicio) {
        toast({
          title: "Error",
          description: "La fecha de inicio es obligatoria.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
  
      // Crear un objeto FormData
      const formDataToSend = new FormData();
  
      // Agregar campos al FormData
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("descripcion", formData.descripcion || "");
      formDataToSend.append("tipo", formData.tipo);
      formDataToSend.append("valor", parseFloat(formData.valor));
      formDataToSend.append("fecha_inicio", new Date(formData.fecha_inicio + "T00:00:00").toISOString());
      if (formData.fecha_fin) {
        formDataToSend.append("fecha_fin", new Date(formData.fecha_fin + "T23:59:59").toISOString());
      }
      if (formData.condiciones) {
        formDataToSend.append("condiciones", formData.condiciones);
      }
      formDataToSend.append("activo", formData.activo ? "true" : "false");
      if (formData.producto_id) {
        formDataToSend.append("producto_id", formData.producto_id);
      }
      if (formData.metodo_pago_id) {
        formDataToSend.append("metodo_pago_id", formData.metodo_pago_id);
      }
  
      // Enviar la solicitud
      let response;
      if (descuento) {
        response = await actualizarDescuento(descuento.id, formDataToSend);
        toast({ title: "Descuento actualizado", status: "success" });
      } else {
        response = await crearDescuento(formDataToSend);
        toast({ title: "Descuento creado", status: "success" });
      }
  
      console.log("Respuesta del servidor:", response); 
  
      onSubmitSuccess();
      onClose();
    } catch (error) {
      console.error("Error al guardar el descuento:", error.response?.data);
  
      let errorMessage = "Error al guardar el descuento.";
      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === "string") {
          errorMessage = error.response.data.detail;
        } else if (Array.isArray(error.response.data.detail)) {
          errorMessage = error.response.data.detail.map((err) => err.msg).join(", ");
        } else if (typeof error.response.data.detail === "object") {
          errorMessage = error.response.data.detail.msg || JSON.stringify(error.response.data.detail);
        }
      }
  
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {descuento ? "Editar Descuento" : "Nuevo Descuento"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Nombre del descuento</FormLabel>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Descuento de Verano"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Input
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Descripción opcional"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Tipo de descuento</FormLabel>
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
              >
                <option value="PORCENTAJE">Porcentaje</option>
                <option value="MONTO_FIJO">Monto fijo</option>
                <option value="CUOTAS_SIN_INTERES">Cuotas sin interés</option>
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>
                {formData.tipo === 'PORCENTAJE' ? 'Porcentaje' :
                  formData.tipo === 'MONTO_FIJO' ? 'Monto' : 'Número de cuotas'}
              </FormLabel>
              <Input
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleInputChange}
                min={0}
                step={formData.tipo === 'PORCENTAJE' ? 1 : 0.01}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Fecha de inicio</FormLabel>
              <Input
                name="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Fecha de fin (opcional)</FormLabel>
              <Input
                name="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={handleInputChange}
                min={formData.fecha_inicio}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Condiciones (opcional)</FormLabel>
              <Input
                name="condiciones"
                value={formData.condiciones}
                onChange={handleInputChange}
                placeholder="Condiciones adicionales"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Método de pago (opcional)</FormLabel>
              <Select
                name="metodo_pago_id"
                value={formData.metodo_pago_id || ""}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un método de pago</option>
                {metodosPago.map((metodo) => (
                  <option key={metodo.id} value={metodo.id}>
                    {metodo.nombre}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>Descuento activo</FormLabel>
              <Switch
                isChecked={formData.activo}
                onChange={handleSwitchChange}
                colorScheme="green"
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            {descuento ? "Guardar Cambios" : "Crear Descuento"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FormularioDescuento;