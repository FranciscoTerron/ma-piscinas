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
  Text,
} from "@chakra-ui/react";
import { crearDescuento, actualizarDescuento } from "../../../../services/api";

const FormularioDescuento = ({ isOpen, onClose, onSubmitSuccess, descuento }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    tipo: "PORCENTAJE",
    valor: 0,
    fecha_inicio: "",
    fecha_fin: "",
    activo: true,
  });
  const toast = useToast();

  useEffect(() => {
    if (descuento) {
      setFormData({
        nombre: descuento.nombre,
        descripcion: descuento.descripcion || "",
        tipo: descuento.tipo,
        valor: descuento.valor,
        fecha_inicio: descuento.fecha_inicio.split('T')[0],
        fecha_fin: descuento.fecha_fin ? descuento.fecha_fin.split('T')[0] : "",
        activo: descuento.activo,
      });
    }
  }, [descuento]);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        valor: parseFloat(formData.valor),
        fecha_fin: formData.fecha_fin || null
      };

      if (descuento) {
        await actualizarDescuento(descuento.id, payload);
        toast({ title: "Descuento actualizado", status: "success" });
      } else {
        await crearDescuento(payload);
        toast({ title: "Descuento creado", status: "success" });
      }
      
      onSubmitSuccess();
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Error al guardar",
        status: "error",
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
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Descuento de Verano"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Input
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                placeholder="Descripción opcional"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Tipo de descuento</FormLabel>
              <Select
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
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
                type="number"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: e.target.value})}
                min={0}
                step={formData.tipo === 'PORCENTAJE' ? 1 : 0.01}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Fecha de inicio</FormLabel>
              <Input
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => setFormData({...formData, fecha_inicio: e.target.value})}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Fecha de fin (opcional)</FormLabel>
              <Input
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => setFormData({...formData, fecha_fin: e.target.value})}
                min={formData.fecha_inicio}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb={0}>Descuento activo</FormLabel>
              <Switch
                isChecked={formData.activo}
                onChange={(e) => setFormData({...formData, activo: e.target.checked})}
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