import React, { useState } from "react";
import styled from 'styled-components';
import DetailsTask from "./DetailsTask";
import EditTask from "./EditTask";
import Loading from "../loading/Loading";
import api from "../api/apiToken";

const MenuContainer = styled.div`
  position: absolute;
  top: calc(15% + 5px);
  right: calc(15% + 5px);
  background-color: black;
  border: none;
  border-radius: 10px;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  z-index: 1;
`;

const MenuItem = styled.div`
  color: white;
  padding: 8px 16px;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background-color: #545454;
  }
`;

function MenuOption(props) {
  const [showDetails, setShowDetails] = useState(false);
  const [taskDetails, setTaskDetails] = useState(false);
  const [taskEdit, setTaskEdit] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(true);

  const handleDeleteClick = async () => {
    setMenuAbierto(false);
    const confirmDelete = window.confirm(`¿Estás seguro que deseas borrar la tarea: \n<<${props.titulo}?>>`);
    if (confirmDelete) {
      setIsLoading(true); // Activamos el cartel de carga al iniciar la petición
      try {
        const response = await api.put(`/tarea/bajaTarea/${props.idTarea}`);
        console.log("Tarea eliminada exitosamente");
        props.toggleMenu();
        props.fetchData();
        setIsLoading(false); // Activamos el cartel de carga al iniciar la petición
      } catch (error) {
        console.error("Error al eliminar la tarea", error);
      }
    }
  };

  const handleViewDetails = async () => {
    setMenuAbierto(false);
    setIsLoading(true); // Activamos el cartel de carga al iniciar la petición
    try {
      const response = await api.get(`/tarea/traerTareaPorId/${props.idTarea}`);
      setTaskDetails(response.data);
      setShowDetails(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener los detalles de la tarea", error);
    }
   
  };

  const handleEditTask = async () => {
    setMenuAbierto(false);
    setIsLoading(true);
    try{
      const response = await api.get(`/tarea/traerTareaPorId/${props.idTarea}`);
      setTaskEdit(response.data)
      setShowEditForm(true)
      setIsLoading(false);
    } catch (error) {
      console.error("Error al intentar editar la tarea" , error);
    }
  
  };

  return (
    <div>
    <MenuContainer isOpen={menuAbierto}>
      <MenuItem onClick={handleViewDetails}>Ver detalles</MenuItem>
      <MenuItem onClick={handleEditTask}>Editar</MenuItem>
      <MenuItem onClick={handleDeleteClick}>Eliminar</MenuItem>
    </MenuContainer>
      {showDetails && (
        <DetailsTask
          isOpen={showDetails}
          taskDetails={taskDetails}
          defaultPosition={{ x: window.innerWidth / 2 - 1120, y: window.innerHeight / 2 - 400 }}
          recargarListadoTareas={props.fetchData}
          idProyecto={props.idProyecto}
          handleViewDetails={handleViewDetails}

        />
      )}
      {showEditForm && (
        <EditTask
          taskEdit={taskEdit}
          fetchData={props.fetchData}
          setShowEditForm={setShowEditForm}
          defaultPosition={{ x: window.innerWidth / 2 - 1120, y: window.innerHeight / 2 - 800 }}
        />
      )}
      <Loading isLoading={isLoading}></Loading>
      </div>
  );
}

export default MenuOption;