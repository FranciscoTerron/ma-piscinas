import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = () => {
  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <CenteredWrapper>
      <Title>{"¡Ups! Parece que has intentado acceder a una página restringida"}</Title>
      <Subtitle>{"Por favor, verifica tus permisos o contacta con soporte"}</Subtitle>
      <StyledWrapper>
        <PoolIcon>🏊‍♂️</PoolIcon>
        <RestrictedIcon>❌</RestrictedIcon>
      </StyledWrapper>
      <BackButton onClick={handleBackClick}>{"Volver a página anterior"}</BackButton>
    </CenteredWrapper>
  );
};

// Animación de parpadeo para la cruz
const blinkAnimation = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

// Estilos
const CenteredWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F8FBFD; /* Fondo claro */
  text-align: center;
`;

const Title = styled.h1`
  font-size: 30px;
  color: #00008B; /* Azul oscuro */
  margin-bottom: 8px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.h2`
  font-size: 24px;
  color: #00CED1; /* Turquesa */
  margin-bottom: 24px;
  font-style: italic;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const StyledWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
`;

const PoolIcon = styled.div`
  font-size: 100px;
  color: #00CED1; /* Turquesa */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const RestrictedIcon = styled.div`
  font-size: 60px;
  color: #FF0000; /* Rojo */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: ${blinkAnimation} 1.5s infinite;
`;

const BackButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  color: #fff;
  background-color: #00CED1; /* Turquesa */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #008B8B; /* Turquesa oscuro */
  }
`;

export default Loader;