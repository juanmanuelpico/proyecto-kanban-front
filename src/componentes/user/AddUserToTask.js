import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Loading from "../loading/Loading";
import api from "../api/apiToken";

const Container = styled.div`
  position: relative;
  top: calc(42% + 7px);
  left: calc(10% + -21px);
  z-index: 1000;
  padding: 0;
  margin: 0;
  width: 210px;
  display: flex;
  align-items: center;
  border: none;
`;

const Input = styled.textarea`
  background-color: #bbeaff;
  border-radius: 5px;
  width: 100%;
  height: 100%;
  resize: none;
  border-width: 3px;
  border-color: #007dab;
  font-family: sans-serif;
  padding: 0;
  font-size: 13px;
  &::placeholder {
    font-size: 15px;
    color: black;
  }
  &:focus {
    border-color: #00C9FF;
    outline: none;
  }
`;

const Ul = styled.ul`
 top: calc(42% + 25px);
 left: calc(10% + -21px);
 color: white;
 position: absolute;
 background-color:  #0F0F0F;
 margin: 0;
 margin-top: 3px;
 padding: 0;
 width: 100%;
 min-height: 100%;
 max-height: 800%;
 border-radius: 5px;
 box-shadow: 0px 0px 5px 1px #00C9FF;
 overflow-y: auto;
  /* Estilo para el contenedor del scroll */
  &::-webkit-scrollbar {
   width: 10px;
 }

 /* Estilo para la barra de scroll */
 &::-webkit-scrollbar-thumb {
   background: #888; 
   border-radius: 10px;
 }

 /* Estilo para la barra de scroll cuando se pasa el mouse por encima */
 &::-webkit-scrollbar-thumb:hover {
   background: #555; 
 }
`;

const UserListItem = styled.li`
  margin-bottom: 0px;
  padding-top: 3px;
  padding-bottom: 3px;
  cursor: pointer;
  color: #c9c9c9;
  width: 100%;
  list-style: none;
  border-radius: 5px;
  &:hover {
    background-color:#545454;
  }
`;

const AddUserToTask = (props) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userList, setUserList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchApiUsersTerm = async () => {
    try {
      const response = await api.get(`/usuario/traerUsuariosDeProyectoSinTarea/${searchTerm}/${props.idProyecto}/${props.idTarea}`);
      setUserList(response.data);
    } catch (error) {
      console.error("Error al obtener listado de usuarios por terminacion:", error);
    }
  };

  const addUserToTask = async (user) => {
    setIsLoading(true);
    try {
      const response = await api.put(`/usuario/asignarUsuarioATarea/${props.idTarea}/${user.id}`);
      console.log(response.data);
      props.toggleAssign();
      props.cargarListadoTareas();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error al agregar usuario a la tarea:", error);
    }
  };

  useEffect(() => {
    if (selectedUser && selectedUser.usuario !== searchTerm) {
      setSelectedUser(null);
    }

    if(searchTerm !== "" && !selectedUser){
      fetchApiUsersTerm();
    }

  }, [searchTerm, props.idProyecto, props.idTarea]);

  const handleUserSelect = (user) => {
    setSelectedUser(user)
    setUserList([]);
    setSearchTerm(user.usuario);
    addUserToTask(user);
  };

  return (
      <Container>
        <Input
          type="text"
          value={searchTerm}
          placeholder="Buscar usuario..."
          onFocus={() => setIsDropdownOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isDropdownOpen && searchTerm !== "" && userList.length > 0 &&(
          <Ul>
            {userList.map((user) => (
              <UserListItem key={user.id} onClick={() => handleUserSelect(user)}>
                {user.usuario}
              </UserListItem>
            ))}
          </Ul>
        )}
        <Loading isLoading={isLoading}></Loading>
      </Container>
  );
};

export default AddUserToTask;
