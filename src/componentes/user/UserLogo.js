import styled from "styled-components"
import Loading from "../loading/Loading";
import { useState } from "react";
import api from "../api/apiToken";

const Perfil = styled.div `
  font-family: sans-serif;
  background-color: #1d90cc;
  width: 20px; /* Tamaño fijo del logo */
  height: 20px; /* Tamaño fijo del logo */
  display: flex;
  justify-content: center; /* Centra horizontalmente el contenido */
  align-items: center; /* Centra verticalmente el contenido */
  padding: 7px;
  font-weight: bold;
  letter-spacing: 0.1em;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 50%; /* Hace que el contenedor sea redondo */
  &:hover {
    background-color: #276465;
  }
`;

const Texto = styled.div`
  font-size: 13px;
  color: #c9c9c9;
`;

  function UserLogo (props){
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
      console.log("id "+props.id + "proyecto", props.proyectoId);
      if(window.confirm("Estas seguro que deseas eliminar a " + props.usuario + " del proyecto?")){
        eliminarUsuarioDeProyecto();
      }
    }

    const eliminarUsuarioDeProyecto = async () => {
      setIsLoading(true);
      try {
        const response = await api.delete(`/proyecto/eliminarUsuarioDeProyecto/${props.id}/${props.proyectoId}`);
        props.recargarUserList(props.proyectoId);
        props.recargarTareas();
        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener listado de usuarios por proyecto:",error);
        setIsLoading(false);
      }
    };


    return(
      <>
        <Loading isLoading={isLoading}></Loading>
        <Perfil onClick={() => handleClick()} title={props.usuario}><Texto>{props.nombre[0].toUpperCase()}{props.apellido[0].toUpperCase()}</Texto></Perfil>
      </>
    );
  }

  export default UserLogo; 