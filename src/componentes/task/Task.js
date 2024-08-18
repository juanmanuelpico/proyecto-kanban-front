import React, { useState, useEffect, useRef } from "react";
import styled from 'styled-components';
import { PiUserCircleFill } from "react-icons/pi";
import { SlOptions } from "react-icons/sl";
import MenuOption from "./MenuOption";
import AddUserToTask from "../user/AddUserToTask";
import BubbleAlert from "../utils/BubbleAlert";

const Contenedor = styled.div`
  position: relative;
  margin: 5px 10px 5px 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  width: 90%;
  min-height: auto;
  background-color: aliceblue;
  border-radius: 5px;
  border: none;
  color: black;
  display: grid;
  flex-direction: column;
  background-color: rgba(90, 90, 90, 0.5);
  &:hover {
    cursor: pointer;
  }
`;

const Span = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 5px;
  color: #c9c9c9;
  text-align: left;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssignTask = styled(PiUserCircleFill)`
  font-size: 24px;
  margin-left: 10px;
  margin-right: 10px;
  &:hover {
    color: #1d90cc;
  }
`;

const Options = styled(SlOptions)`
  font-size: 24px;
  margin-left: 10px;
  margin-right: 10px;
  &:hover {
    color: #1d90cc;
  }
`;

const AddUserContainer = styled.div`
  position: relative;
  z-index: 3;
  bottom: 28px;
`;

const SpanBubble = styled.span `
  position: absolute;
  left: 226px;
`;

function Task(props) {
  const [menuOpenTask, setMenuOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const menuRef = useRef(null);
  const assignRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if ((menuOpenTask && menuRef.current && !menuRef.current.contains(event.target)) ||
          (assignOpen && assignRef.current && !assignRef.current.contains(event.target))) {
        setMenuOpen(false);
        setAssignOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };


  }, [menuOpenTask, assignOpen, props.idTarea]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpenTask);
  };

  const toggleAssign = () => {
    setAssignOpen(!assignOpen);
    setMenuOpen(false);
  };

  

  return (
    <Contenedor ref={menuRef}>
      <Span>
        {props.titulo}
        <IconContainer>
          <Options title="Opciones" onClick={toggleMenu}/>
          {(props.estado === "EN PROCESO" || props.estado === "PARA HACER") && (
            <div>
              
            <AssignTask title="Asignar usuario" onClick={toggleAssign} />

            {props.cantidad > 0 && (
              <SpanBubble title="cantidad usuarios asignados"><BubbleAlert value={props.cantidad} /></SpanBubble>
            )}
            
            </div>
          )}
        </IconContainer>
      </Span>
      {menuOpenTask && <MenuOption isOpen={menuOpenTask} toggleMenu={toggleMenu} idTarea={props.idTarea} titulo={props.titulo} fetchData={props.fetchData} idProyecto={props.idProyecto}  />}
      {assignOpen && (
        <AddUserContainer ref={assignRef}>
          <AddUserToTask toggleAssign={toggleAssign} idProyecto={props.idProyecto} idTarea={props.idTarea} cargarListadoTareas={props.fetchData}/>
        </AddUserContainer>
      )}
    </Contenedor>
  );
}

export default Task;