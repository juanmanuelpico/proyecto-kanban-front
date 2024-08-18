import UserLogo from "./UserLogo";
import styled from "styled-components";

const Div = styled.div`
  display: flex;
  align-items: center;
`;

const Span = styled.span`
  font-size: 20px;
  font-family: sans-serif;
  color: #c9c9c9;
  margin-left: 5px;
  font-weight: bold;
`;

function UserLogoList({ userList, proyectoId, recargarUserList, recargarTareas }) {

  console.log(userList);
  return (
    <Div>
      {userList.map((user) => (
        <UserLogo
          key={user.id}
          id={user.id}
          usuario={user.usuario}
          nombre={user.nombre}
          apellido={user.apellido}
          proyectoId={proyectoId}
          recargarUserList={recargarUserList}
          recargarTareas={recargarTareas}
        />
      ))}
      <Span>{userList.length}</Span>
    </Div>
  );
}

export default UserLogoList;