import styled from "styled-components"

const BodyPrincipal = styled.body `
  height: 100vh;
  margin: 0; /* Elimina los márgenes por defecto del body */
  padding: 0; /* Elimina el padding por defecto del body */
  overflow: hidden; /* Evita que haya scroll horizontal o vertical */
  background-image: url("/img/login2.jpg");
  background-size: contain;
  background-repeat: no-repeat; /* Evita que la imagen se repita */
  background-position: center; /* Centra la imagen */
  background-size: cover;
`;

export default BodyPrincipal;