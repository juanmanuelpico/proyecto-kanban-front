  import React, { useEffect, useState } from "react";
  import ProjectList from "../project/ProjectList";
  import styled from "styled-components";
  import FormProject from "../project/FormProject";
  import TaskBoard from "../task/TaskBoard";
  import GlobalStyles from "./GlobalStyles";
  import SearchProject from "../project/SearchProject";
  import { IoIosNotifications } from "react-icons/io";
  import AddUserToProject from "../user/AddUserToProject";
  import { Link } from "react-router-dom";
  import api from "../api/apiToken";

  const Header = styled.header `
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 250px;
    z-index: 2;
    transition: all 0.5s;
    padding: 0 15px;
    background-color: #171719;
    overflow: hidden;
    border-right: 2px solid #272729; /* Color del borde más claro */
  `;

  const Perfil = styled.button `
    font-family: sans-serif;
    background-color: #1d90cc;
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px; /* Añade un poco de espacio interno para que no esté pegado al borde */
    margin:20px;
    border: none; /* Quita el borde para un aspecto más limpio */
    cursor: pointer; /* Cambia el cursor al pasar sobre el botón */
    transition: background-color 0.3s; /* Agrega una transición suave al cambio de color */
    border-radius:10px;
    &:hover {
      background-color: #276465;
    }
  `;

  // Estilizando la ventana desplegable
  const DropdownContent = styled.div`
    display: ${(props) => (props.open ? 'block' : 'none')};
    position: absolute;
    top: 70px;
    right: 0;
    background-color: rgba(172, 158, 156, 0.4);
    min-width: 100px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    margin-right: 20px;
    padding: 12px 16px;
    z-index: 1;
    border: none;
    border-radius: 10px;

    span {
      font-family: sans-serif;
      display: block;
      margin-bottom: 15px;
      text-decoration: none;
      color: white;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 2px;
        bottom: -2px;
        left: 0;
        background-color: #1d90cc;
        transform-origin: bottom left;
        transition: transform 0.25s ease-out;
        transform: scaleX(0);
      }

      &#editar:hover::after {
        transform: scaleX(0.8);
      }
      &#cerrar:hover::after {
        transform: scaleX(1);
      }
    }
  `;

  const Campana = styled(IoIosNotifications)`
  margin-right: 6px;
  font-size: 45px;
  margin-top:18px;
  color:#1d90cc;
  &:hover {
    font-size: 50px;
    cursor: pointer;
    transition: font-size 0.7s; /* Controla la velocidad de cambio en el hover */
    filter: brightness(70%); /* Reduce el brillo al pasar el cursor */
  }
  position: absolute;
  top: 0;
  right: 60px; /* Ajusta el valor de left según sea necesario */
  `;

  const Container = styled.div`
    margin-left: 100px;
    padding: 0;
    overflow: hidden; /* Evita que haya scroll horizontal o vertical */
    background-color: #171719;
    width: 100vw; /* Ocupa todo el ancho de la ventana */
    height: 100vh; /* Ocupa todo el alto de la ventana */
    display: flex;
    justify-content: center; /* Centra horizontalmente */
    align-items: start; /* Centra verticalmente */
    z-index: -1;
  `;

  function Home () {
    //const user = JSON.parse(localStorage.getItem("user"));
    const [user, setUser] = useState(() => {
      // Intenta recuperar el usuario del localStorage
      const storedUser = window.localStorage.getItem("user");
      // Si hay un usuario almacenado, conviértelo de nuevo en un objeto JavaScript
      return storedUser ? JSON.parse(storedUser) : null;
    });
    const [proyectos, setProyectos] = useState([]);
    const [error, setError] = useState(null);
    //obtenemos el idProject del local storage
    const [selectedIdProject, setSelectedIdProject] = useState(null);
    const [usersInProject, setUsersInProject] = useState([]); // Nuevo estado para almacenar los usuarios del proyecto seleccionado

    const fetchUsersInProject = async (idProyecto) => {
      // Función para obtener la lista de usuarios del proyecto seleccionado
      try {
        const response = await api.get(`usuario/traerUsuariosPorIdProyecto/${idProyecto}`);
        setUsersInProject(response.data);
      } catch (error) {
        console.error("Error al obtener listado de usuarios por proyecto:",error);
      }
    };

    const fetchData = () => {
      return api.get(`/proyecto/traerProyectos/${user.id}`)
      .then((response) => {
        setProyectos(response.data);
      })
      .catch(error => {
        setError("Error al obtener proyectos");
        console.log(error);
      });
    }

    const handleSearchProject = (searchTerm) => {
      if (searchTerm.trim() !== '') {
        // Realizar búsqueda por nombre
        api.get(`proyecto/buscarProyectos/${user.id}/${searchTerm}`)
        .then((response) => {
          setProyectos(response.data);
        })
        .catch(error => {
          console.error("Error al buscar proyectos:", error);
        });
      } else {
        // Si la barra de búsqueda está vacía, actualizar la lista de proyectos por ID
        fetchData();
      }
    };

    useEffect(() => {
      if(user){
      fetchData();
      window.localStorage.setItem("user", JSON.stringify(user));
      }
    }, [user])

    const actualizarProyectos = () => {
      fetchData();
    }
    const [open, setIsOpen] = useState(false);
    const toggleDropdown = () => {
      setIsOpen(!open);
    };

    const handleProjectClick = (idProyecto) => {
      setSelectedIdProject(idProyecto);
      fetchUsersInProject(idProyecto);
    }
    //controla si se abre o no el formulario para agregar usuario al proyecto
    const [formAddUser, setFormAddUser] = useState(false);

    const handleClickAgregarPersonaIcon = () => {
      setFormAddUser(!formAddUser);
    };

    const handleLogout = () => {
      if(window.confirm("¿Estás seguro/a de que deseas cerrar sesión?")){
      // Eliminar todos los datos almacenados en localStorage
      localStorage.clear();
      // Redirigir al usuario a la página de inicio de sesión
      window.location.href = "/login";
      }
  };

    return (
      <>
      {user && (
        <>
        <GlobalStyles/>
        <Header>
          <FormProject actualizarProyectos={actualizarProyectos} />
          <SearchProject onSearch={handleSearchProject}></SearchProject>
          <ProjectList 
            listaProyectos={proyectos}
            actualizarProyectos={actualizarProyectos}
            clickProyecto = {handleProjectClick} />
            {formAddUser && (
              <AddUserToProject 
              actualizarProyectos={actualizarProyectos}
              handleClickAgregarPersonaIcon = {handleClickAgregarPersonaIcon}
              idProyecto = {selectedIdProject}
              fetchUsersInProject={handleProjectClick}
              />
            )}
          
        </Header>
        <Container>
          <div>
            <Campana />
            <Perfil onClick={toggleDropdown}>{ user.nombre[0] }{ user.apellido[0] } </Perfil>

            <DropdownContent open={open}>
                    <Link>
                      <span id="cerrar" onClick={handleLogout}>Cerrar sesión</span>
                    </Link>

                    <Link to="/editProfile">
                      <span id="editar">Editar perfil</span>
                    </Link>
            </DropdownContent>
          </div>
          
          {selectedIdProject && (
            <TaskBoard
            proyectoId = {selectedIdProject}
            //viaja para taskboard, y luego para search task, donde esta el boton de agregar usuario al proyecto
            //por lo tanto, dicho boton va a activar éste método 
            handleClickAgregarPersonaIcon = {handleClickAgregarPersonaIcon}
            userList={usersInProject}
            recargarUserList={fetchUsersInProject}
            />
          )
          }
        </Container>
        </>
      )}
        
     
      
      </>
    )
  }

  export default Home;