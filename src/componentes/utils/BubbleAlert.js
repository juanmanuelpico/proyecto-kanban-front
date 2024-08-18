import { Component } from "react";
import styled from "styled-components";

const Span = styled.span`
  background-color: #E9725A;
  border-radius: 20px;
  color: #fff;
  padding: 5px 8px;
  font-size: 0.5rem;
  width: 20px;
  position: relative;
  top: -7px; 
`;

class BubbleAlert extends Component {
    getNumber(n){
        if(!n) { return ""}
        return n > 9 ? "9+" : n
    }
    render() {
        const { value } = this.props
        return (
            <Span>
                {this.getNumber(value)}
            </Span>
        )
    }
}

export default BubbleAlert