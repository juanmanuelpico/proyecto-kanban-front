//EN ESTE ARCHIVO SE CONSUMIRAN LAS APIS NECESARIOS Y SE IMPLEMENTARA LO NECESARIO PARA AGREGAR A UN USUARIO AL PROYECTO
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Loading from "../loading/Loading";
import api from '../api/apiToken';

const Overlay = styled.div`
  font-family: sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Esto hace que el fondo sea negro y semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Asegura que el overlay esté en la parte superior */
`;

const FormContainer = styled.div`
  width: 35%;
  background-color: #3a3a40;
  padding: 20px;
  border-radius: 30px;
  box-shadow: 0px 0px 6px 1px #c9c9c9;
  color: #c9c9c9;
  align-items: center;
  justify-content: center;
`;

const FormTitle = styled.h2`
  text-align: center;
  margin-top: 0;
  margin-bottom: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: auto;
  margin-left: 0;
`;

const Label = styled.label`
  margin-right: auto ;
  margin-bottom: 10px;
  margin-top: 30px;
  text-align: left;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 0;
  margin-right: auto;
  width: 70%;
  height: 10px;
  border: 1px solid #9fffff;
  border-radius: 5px;
  &:focus {
    border-color: blue;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 8px;
  margin-bottom: 30px;
  margin-right: auto;
  font-size: 12px;
  width: 30%;
  height: 30px;
  border: 1px solid #9fffff;
  border-radius: 5px;
  appearance: none; /* Elimina el estilo predeterminado del sistema */
  &:focus {
    border-color: blue;
    outline: none;
  }
`;

const Option = styled.option`
 appearance: none; /* Elimina el estilo predeterminado del sistema */
font-family: sans-serif;
font-size: 13px;
background-color: #b9bac0;
border: 1px solid #9fffff;
border-radius: 5px;
margin-top: 10px;
`;

const Ul = styled.ul`
 position: absolute;
 background-color:  #0F0F0F;
 margin: 0;
 margin-top: 3px;
 padding: 0;
 width: 50%;
 min-height: 400%;
 max-height: 800%;
 border-radius: 5px;
 box-shadow: 0px 0px 5px 1px #c9c9c9;
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
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
  color: #c9c9c9;
  width: 100%;
  list-style: none;
  border-radius: 5px;
  &:hover {
    background-color:#545454;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 10px;
  margin-left: auto;
  background-color: #126b78;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #00d2db;
  }
  &:active {
    background-color: #3da9d9;
  }
`;

const InputListContainer = styled.div`
   width: 90%;
   position: relative;
`;

const Span = styled.span`
  padding-top: 10px;
  margin-left: 50px;
`;
function AddUserToProject(props){
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  //se guarda la terminación
  const [searchTerm, setSearchTerm] = useState('');
  //lista de usuarios
  const [userList, setUserList] = useState([]);
  

  //se consume la api que busca usuarios por terminación
  const fetchApiUsersTerm = async () => {
      try {
        const response = await api.get(
          `/usuario/traerUsuariosPorNombreUsuario/${searchTerm}/${props.idProyecto}`
        );
        setUserList(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error al obtener listado de usuarios por terminacion:", error);
      }
  };

  //controlamos que al dar click fuera del FormContainer, se actualice el estado del Home llamado formAddUser
  useEffect(() => {

    if (selectedUser && selectedUser.usuario !== searchTerm) {
      setSelectedUser(null);
    }

    if(searchTerm !=="" && !selectedUser){
      fetchApiUsersTerm();
    }


    document.addEventListener('mousedown', handleClickFormAddUserOutside);
  
    return () => {
      document.removeEventListener('mousedown',handleClickFormAddUserOutside);
    };

    

  }, [searchTerm, selectedUser]);

  const formAddUserRef = useRef();
  //al reconocer que se hace click fuera, se ejecuta la funcion instalada en el home para que no se muestre el formulario
  const handleClickFormAddUserOutside = (event) => {
    if (formAddUserRef.current && !formAddUserRef.current.contains(event.target)) {
     props.handleClickAgregarPersonaIcon();
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (selectedRole === "") {
      window.alert("Debe ingresar un rol");
    } else if (!selectedUser) {
    window.alert("Por favor, seleccione un usuario de la lista");
     } else{
      setIsLoading(true);
      // Aquí puedes enviar el formulario
      console.log("idProyecto: ", props.idProyecto)
      console.log("Usuario:", selectedUser);
      console.log("Rol:", selectedRole);
      const json = {
        idUsuario: selectedUser.id,
        idProyecto: props.idProyecto,
        idRolUsuario: selectedRole
      }
      api.post("/proyecto/agregarUsuarioAProyecto", json)
      .then(response => {
          console.log('¡Datos enviados con éxito!', response.data);
          window.alert("Se ingreso el usuario al proyecto");
          props.handleClickAgregarPersonaIcon();
          props.fetchUsersInProject(props.idProyecto);
          setIsLoading(false);
      })
      .catch(error => {
          console.error('Error al enviar los datos:', error);
          window.alert("No se puede enviar el formulario")
      });
    }
  };

  //Se guarda el rol seleccionado en ese estado
  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
  };

  //guardamos el usuario seleccionado
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setUserList([]);
    setSearchTerm(user.usuario);
    console.log("Usuario seleccionado:", user);
  };

    return(
        <Overlay>
        <FormContainer ref = {formAddUserRef}>
         <FormTitle>Añadir usuario al proyecto</FormTitle>
          <Form onSubmit={handleSubmit}>
           <Label htmlFor="usuario">Selecciona usuario</Label>

           <InputListContainer>
            <Input
              type="text"
              value={searchTerm}
              //
              onChange={(e) => {
                const nuevoValor = e.target.value;
                setSearchTerm(nuevoValor);
                console.log(searchTerm);
              }
            }
              placeholder="Buscar usuario..."
            />
            {userList.length > 0 &&(
              <Ul>
                {userList.map((user) => (
                  <UserListItem key={user.id} onClick={() => handleUserSelect(user)}>
                    <Span>{user.usuario}</Span>
                  </UserListItem>
                ))}
              </Ul>
            )}
          </InputListContainer>

           <Label htmlFor="rol">Selecciona rol</Label>
           <Select id='rol' name='rol' value={selectedRole} onChange={handleRoleChange} required>
            <Option value="">Seleccione Rol</Option>
            <Option value="1">Administrador</Option>
            <Option value="2">Colaborador</Option>
           </Select>
          <Button type="submit">Agregar</Button>
        </Form>
      </FormContainer>
      <Loading isLoading={isLoading}></Loading>
      </Overlay>
    );
}

export default AddUserToProject;