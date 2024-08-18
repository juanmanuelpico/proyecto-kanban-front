import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import Draggable from "react-draggable";
import { TiDelete } from "react-icons/ti";
import Loading from "../loading/Loading";
import api from "../api/apiToken";

const FormContainer = styled.div`
  font-family: sans-serif;
  color: white;
  z-index: 1000;
  position: fixed;
  background-color: #3a3a40;
  border: none;
  border-radius: 5px;
  padding: 20px;
  max-width: 400px;
  min-width: 20%;
  box-shadow: 0px 0px 6px 1px #c9c9c9;
  cursor: pointer;
`;

const Li = styled.li`
 /* Estilos base para el elemento <li> */
 position: relative; /* Asegura que el pseudo-elemento esté posicionado correctamente */
 list-style-type: none;
 display: flex; /* Establece el contenedor como un contenedor flexible */
  align-items: center; /* Centra verticalmente el contenido */

/* Pseudo-elemento ::after para el subrayado */
&::after {
  content: ''; /* Obligatorio para los pseudo-elementos */
  position: absolute; /* Posición relativa al elemento padre */
  width: 100%; /* Ancho completo del elemento <li> */
  height: 2px; /* Altura del subrayado */
  bottom: -2px; /* Coloca el subrayado justo debajo del elemento */
  left: 0; /* Alinea el subrayado a la izquierda */
  background-color: transparent; /* Inicialmente transparente */
  transition: background-color 0.3s ease; /* Transición para el cambio de color */
}

/* Cambia el color de fondo del subrayado cuando el mouse pasa sobre el elemento */
&:hover::after {
  background-color: #1d90cc; /* Cambia el color del subrayado cuando el mouse pasa sobre el elemento */
}
`;

const DeleteUserToTask = styled(TiDelete)`
  color: #b81414;
  font-size: 20px;
  margin-left: auto;
  margin-top: 1px;
  &:hover{
   color: #eb636b;
  }
`;

function DetailsTask({ isOpen, taskDetails, defaultPosition, recargarListadoTareas, idProyecto ,  handleViewDetails}) {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const endDate = new Date(taskDetails.fechaFin);
      const difference = endDate - now;
      if (difference > 0) {
        const seconds = Math.floor((difference / 1000) % 60);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        setTimeRemaining({ days, hours, minutes, seconds });
      } else {
        setTimeRemaining(null);
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isOpen, taskDetails.fechaFin]);

  let textColor = 'green';

  if (timeRemaining) {
    if (timeRemaining.days < 1) {
      textColor = 'red';
    } else if (timeRemaining.days < 3) {
      textColor = 'orange';
    }
  }

  const handleDeleteUserToTask = (idUser, idTarea) =>{
    if(window.confirm("Estas seguro que deseas eliminar al usuario de la tarea?")){
      eliminarUsuarioDeTarea(idUser, idTarea);
    }
  }

  
  const eliminarUsuarioDeTarea = async (idUser, idTarea) => {
    setIsLoading(true);
    try {
      const response = await api.delete(`/usuario/eliminarUsuarioDeTarea/${idTarea}/${idUser}`);
      recargarListadoTareas();
      handleViewDetails();
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener listado de usuarios por proyecto:",error);
      setIsLoading(false);
    }
  };

  return (
    <>
    <Loading isLoading={isLoading}></Loading>
    <Draggable defaultPosition={defaultPosition}>
      <FormContainer style={{ display: isOpen ? 'block' : 'none' }}>
        <h2>Detalles de la tarea</h2>
        {timeRemaining && (taskDetails.estado === "EN PROCESO" || taskDetails.estado === "PARA HACER") && (
          <h4 style={{ color: textColor }}>
            Tiempo restante: {timeRemaining.days} días, {timeRemaining.hours} hs, {timeRemaining.minutes} min, {timeRemaining.seconds} segundos
          </h4>
        )}
        <p>ID: {taskDetails.id}</p>
        <p>Título: {taskDetails.titulo}</p>
        <p>Descripción: {taskDetails.descripcion}</p>
        <p>Dificultad: {taskDetails.dificultad}</p>
        <p>Estado: {taskDetails.estado}</p>
        <p>Fecha de inicio: {taskDetails.fechaInicio}</p>
        <p>Fecha de fin: {taskDetails.fechaFin}</p>
        {taskDetails.usuarios.length === 0 ? (
        <p>No hay usuarios asignados</p>
         ) : (
        <div>
          <p>Usuarios asignados:</p>
          <ul>
            {taskDetails.usuarios.map((usuario, index) => (
              <>
              <Li key={index}>{usuario.usuario}
               <DeleteUserToTask onClick={()=>handleDeleteUserToTask(usuario.id, taskDetails.id)}/>
              </Li>
              
              </>
              
            ))}
          </ul>
        </div>
      )}
      </FormContainer>
    </Draggable>
    </>
  );
}

export default DetailsTask;