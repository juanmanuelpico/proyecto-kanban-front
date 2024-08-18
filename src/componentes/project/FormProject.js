import React, { useState, useRef, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { MdOutlineLibraryAdd } from 'react-icons/md';
import { UserContext } from '../contexts/UserContext';
import Loading from "../loading/Loading";
import api from "../api/apiToken"

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); /* Esto hace que el fondo sea negro y semi-transparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que el overlay esté en la parte superior */
`;

const FormContainer = styled.div`
  color: white;
  box-shadow: 0px 0px 6px 1px #c9c9c9;
  background-color: #3a3a40;
  padding: 20px;
  border-radius: 5px;
`;

const FormTitle = styled.h2`
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
  &:focus {
    border-color: blue;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #1d90cc;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #3da9d9;
  }
  &:active {
    background-color: #3da9d9;
  }
`;

const DivCreate = styled.div `
  margin-top: 10px;
  padding: 3px;
  border: solid 1px rgba(255,255,255,0.3);
  border-radius: 5px;
  display: flex;
  align-items: center;
  color: white;

`;

const Span = styled.span `
  font-size: 0.8em;
  font-family: sans-serif;

`;

const ButtonAddProject = styled(MdOutlineLibraryAdd)`
  margin-left: 135px;
  font-size: 15px;
  color: white;
  cursor: pointer;
  &:hover {
    font-size: 20px;
    transition: ease-in-out 0.3s;
  }
`;

  function FormProject(props) {
    const [isLoading, setIsLoading] = useState(false);
 // CONSUMIR API

 //para obtener el usuario en contexto, osea el usuario logueado
 //para que se renderice la lista de proyectos
 const user = JSON.parse(window.localStorage.getItem("user"));
    const dataInicial = {
      idUsuario: user.id,
      nombre: '',
      descripcion: ''
    }
    const [formData, setFormData] = useState(dataInicial);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevState => ({
          ...prevState,
          [name]: value
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      setIsLoading(true); // Activamos el cartel de carga al iniciar la petición
      api.post("/proyecto/crear", formData)
      .then(response => {
          console.log('¡Datos enviados con éxito!', response.data);
          setIsLoading(false);
          alert('Se registro nuevo proyecto');
          setAbrirFormulario(false)
          setFormData(dataInicial)
          props.actualizarProyectos();
         
      })
      .catch(error => {
          console.error('Error al enviar los datos:', error);
          alert("No se puede enviar el formulario")
      });
    };

    //MOSTRAR EL FORMULARIO

  const [abrirFormulario, setAbrirFormulario] = useState(false);

  const formRef = useRef();

  const handleButtonClick = () => {
    setAbrirFormulario(true);
  };

  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      setAbrirFormulario(false);
    }
  }

    useEffect(() => {
      
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []); 

  
     
  return (
    <>
    <DivCreate><Span>Crear proyecto</Span>
    <ButtonAddProject onClick={handleButtonClick} title='crear proyecto'/>
    </DivCreate>
        {abrirFormulario && (
        <Overlay>
          <FormContainer ref={formRef}>
           <FormTitle>Ingrese los datos del proyecto</FormTitle>
            <Form onSubmit={handleSubmit}>
             <Label htmlFor="name">Nombre:</Label>
             <Input type="text" id="name" name="nombre" required
              value={formData.nombre}
              onChange={handleChange}  />

             <Label htmlFor="description">Descripción:</Label>
             <Input type="text" id="description" name="descripcion" required 
             value={formData.descripcion}
             onChange={handleChange}/>

            <Button type="submit">Crear</Button>
            <Loading isLoading={isLoading}></Loading>
          </Form>
        </FormContainer>
        </Overlay>
        )}   
    </>
  );
}


export default FormProject;