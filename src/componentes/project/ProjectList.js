import React, { useState, useRef } from "react";
import styled from "styled-components";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrEdit } from "react-icons/gr";
import { FiInfo } from "react-icons/fi";
import axios from "axios";
import CustomModal from "./CustomModal";
import Loading from "../loading/Loading";
import api from "../api/apiToken";

const Li = styled.li`
  position: relative;
  color: ${(props) => (props.clicked === "true" ? "#9fffff" : "#c9c9c9")};
  background-color: ${(props) => (props.clicked === "true" ? "#194070" : "none")};
  overflow: hidden;
  white-space: nowrap;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 13px;
  margin: 1px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 3px 3px;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  &:hover {
    transform: translate(10px);
    background-color: #194070;
  }
`;


const Ul = styled.ul`
  height: 100%;
  padding: 0;
  margin: 0;
`;

const P = styled.p`
  padding-top: 50px;
  color: #c9c9c9;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: 13px;
  text-align: center;
`;

const IconsContainer = styled.div`
  position: absolute;
  right: 5px;
  display: flex;
`;

const Info = styled(FiInfo)`
  margin-left: 6px;
  &:hover {
    font-size: 15px;
    cursor: pointer;
  }
`;

const Edit = styled(GrEdit)`
  margin-left: 6px;
  &:hover {
    font-size: 15px;
    cursor: pointer;
  }
`;

const Delete = styled(RiDeleteBin6Line)`
  margin-left: 6px;
  &:hover {
    font-size: 15px;
    color: red;
    cursor: pointer;
  }
`;

const Span = styled.span`
  margin-right: 24px;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ContainerFormEdit = styled.div`
  margin-top: 10px;
  padding: 3px;
  border: solid 1px rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  align-items: center;
  color: white;
`;

const EditForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 5px;
`;

const SubmitButton = styled.button`
  padding: 5px;
  background-color: #194070;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

function ProjectList({ listaProyectos, actualizarProyectos, clickProyecto }) {
  const [selectedIdItem, setSelectedIdItem] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formProjectEdit, setFormEdit] = useState();
  const [editFormOpen, setEditFormOpen] = useState(false);
  const formRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (index, projectId) => {
    setSelectedIdItem(index);
    clickProyecto(projectId);
    // Cerrar el formulario de edición cuando se selecciona otro proyecto
    setEditFormOpen(false);
  };

  const handleInfoClick = async (projectId) => {
    setIsLoading(true); // Activamos el cartel de carga al iniciar la petición
    try {
      const response = await api.get(`/proyecto/traerProyectoId/${projectId}`);
      const projectDetails = response.data;
      setSelectedProject(projectDetails);
      setIsLoading(false);
      setModalIsOpen(true);
    } catch (error) {
      console.error("Error al obtener los detalles del proyecto:", error);
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
    setModalIsOpen(false);
  };

  const handleDeleteClick = async (projectId, projectNombre) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro que deseas borrar el proyecto ${projectNombre}?`
    );
    if (confirmDelete) {
      try {
        const response = await api.put(
          `/proyecto/bajaProyecto/${projectId}`
        );
        actualizarProyectos();
        console.log("Proyecto eliminado exitosamente");
      } catch (error) {
        console.error("Error al eliminar el proyecto", error);
        actualizarProyectos();
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditClick = async (projectId) => {
    try {
      const response = await api.get(
        `/proyecto/traerProyectoId/${projectId}`
      );
      setFormEdit(response.data);
      setEditFormOpen(true);
    } catch (error) {
      console.error("Error al obtener los detalles del proyecto:", error);
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Activamos el cartel de carga al iniciar la petición
    try {
      const response = await api.put(`/proyecto/editarProyecto/${formProjectEdit.id}/${formProjectEdit.nombre}/${formProjectEdit.descripcion}`);
      actualizarProyectos();
      setIsLoading(false);
      console.log("Proyecto editado exitosamente");
    } catch (error) {
      console.error("Error al editar el proyecto", error);
      actualizarProyectos();
    }
    setEditFormOpen(false);
  };

  return (
    <div>
      <Ul>
        {listaProyectos && listaProyectos.length > 0 ? (
          listaProyectos.map((proyectoObj, index) => (
            <React.Fragment key={proyectoObj.id}>
              <Li
                onClick={() => handleClick(index, proyectoObj.id)}
                clicked={index === selectedIdItem ? "true" : "false"}
              >
                <Span title={proyectoObj.nombre}>
                  {proyectoObj.nombre}
                </Span>
                {index === selectedIdItem && (
                  <IconsContainer ref={formRef}>
                    <Info onClick={() => handleInfoClick(proyectoObj.id)} title="info"/>
                    <Edit onClick={() => handleEditClick(proyectoObj.id)} title="editar"/>
                    <Delete onClick={() => handleDeleteClick(proyectoObj.id, proyectoObj.nombre)} title="eliminar proyecto"/>
                  </IconsContainer>
                )}
              </Li>
              {editFormOpen && index === selectedIdItem && (
                <ContainerFormEdit>
                  <EditForm onSubmit={handleSubmitEdit}>
                    <Input
                      type="text"
                      name="nombre"
                      value={formProjectEdit.nombre}
                      onChange={handleChange}
                    />
                    <Input
                      type="text"
                      name="descripcion"
                      value={formProjectEdit.descripcion}
                      onChange={handleChange}
                    />
                    <SubmitButton>Enviar</SubmitButton>
                  </EditForm>
                </ContainerFormEdit>
              )}
            </React.Fragment>
          ))
        ) : (
          <P>No hay proyectos disponibles</P>
        )}
      </Ul>

      <CustomModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Detalles del Proyecto"
      >
        {selectedProject && (
          <div>
            <h2>{selectedProject.nombre}</h2>
            <p>
              <strong>ID:</strong> {selectedProject.id}
            </p>
            <p>
              <strong>Nombre:</strong> {selectedProject.nombre}
            </p>
            <p>
              <strong>Descripción:</strong> {selectedProject.descripcion}
            </p>
            <p>
              <strong>Fecha de Inicio:</strong>{" "}
              {selectedProject.fechaInicio}
            </p>
            <p>
              <strong>Fecha de Fin:</strong> {selectedProject.fechaFin}
            </p>
          </div>
        )}
      </CustomModal>
      <Loading isLoading={isLoading}></Loading>
    </div>
  );
}

export default ProjectList;
