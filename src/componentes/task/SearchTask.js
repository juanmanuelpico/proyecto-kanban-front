import React, { useState } from 'react';
import styled from 'styled-components';
import { IoSearch, IoPersonAdd } from "react-icons/io5";
import UserLogoList from '../user/UserLogoList';

// Estilos para el componente de búsqueda
const SearchContainer = styled.div`
  width: 97%;
  padding: 0;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.div`
  color: white;
  width: 17%;
  height: 30px;
  margin: 80px 0 20px 5px;
  border-radius: 5px;
  background-color: rgb(90, 90, 90);
  overflow-x: hidden; /* Muestra la barra de desplazamiento horizontal si el contenido es demasiado ancho */
  overflow-y: hidden; /* Oculta la barra de desplazamiento vertical */
  display: flex;
  align-items: center;
  border: 1px solid transparent; /* Borde transparente por defecto */
  transition: width 0.3s ease; /* Transición suave para el cambio de ancho */
  &:focus-within {
    border-color: #00C9FF; /* Color del borde cuando el div contiene un elemento con foco */
    box-shadow: 1px 1px 3px rgba(0, 0, 255, 0.7); /* Sombra para resaltar el borde */
    width: 25%;
  }
`;

const InputTextarea = styled.textarea`
  font-family: sans-serif;
  width: 100%;
  height: 100%;
  resize: none;
  border: none; /* Añadir esta línea para eliminar el borde */
  padding: 0;
  background-color: transparent;
  color: white;
  font-size: 15px;
  outline: none; /* Añadir esta línea para eliminar el borde al enfocarse */
  line-height: 30px; /* Ajustar la altura de línea para centrar verticalmente el placeholder */
  &::placeholder {
    font-size: 15px;
    color: rgb(180, 180, 180);
  }
`;

const Lupita = styled(IoSearch)`
  font-size: 20px;
  margin-right: 10px;
`;

const AgregarPersonaIcon = styled(IoPersonAdd)`
  color:  #c9c9c9;
  font-size: 22px;
  margin-top: 58px;
  margin-left: 30px;
  transition: color 0.3s;
  &:hover{
    cursor: pointer;
    color: #f7f7f7;
  }
`;

const UserLogoContainer = styled.div`
  margin-left: auto; /* Mueve el UserLogo hacia la derecha */
  margin-top: 58px;
  /* Añade un espacio entre el UserLogo y el AgregarPersonaIcon */
  display: flex;
  align-items: center;
 
  `;

//Componente de búsqueda
//Recibe el handleClickAgregarPersonaIcon obtenido desde el home y luego por TaskBoard
function SearchTask({ onSearch, handleClickAgregarPersonaIcon, userList, proyectoId, recargarUserList, recargarTareas }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
    // Llamar a la función de búsqueda cada vez que cambia el valor del textarea
    onSearch(value);
  };

  return (
    <>
    <SearchContainer>
      <SearchInput>
        <InputTextarea
          placeholder="Buscar en este tablero"
          value={searchTerm}
          onChange={handleChange}
        />
        <Lupita />
      </SearchInput>
      <UserLogoContainer>
      <UserLogoList 
      userList={userList}
      proyectoId={proyectoId}
      recargarUserList={recargarUserList}
      recargarTareas={recargarTareas}/>
      </UserLogoContainer>
      <AgregarPersonaIcon onClick={() => handleClickAgregarPersonaIcon()} 
      title='agregar usuario al proyecto'/>
    </SearchContainer>
    </>
  );
};

export default SearchTask;