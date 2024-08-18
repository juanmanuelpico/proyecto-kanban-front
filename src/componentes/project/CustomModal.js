import React from "react";
import styled from "styled-components";
import Draggable from "react-draggable";

const ModalContainer = styled.div`
  font-family: sans-serif;
  color: white;
  z-index: 1000;
  position: fixed;
  background-color: #3a3a40;
  border: none;
  border-radius: 5px;
  padding: 20px;
  max-width: 400px;
  width: 80%;
  box-shadow: 0px 0px 6px 1px #c9c9c9;
  cursor: pointer;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: red;
    border: solid 1px black;
  }
`;

function CustomModal({ isOpen, onRequestClose, children }) {
  if (!isOpen) return null;

  return (
    <Draggable defaultPosition={{x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 500}}>
      <ModalContainer>
        <CloseButton onClick={onRequestClose}>X</CloseButton>
        {children}
      </ModalContainer>
    </Draggable>
  );
}

export default CustomModal;
