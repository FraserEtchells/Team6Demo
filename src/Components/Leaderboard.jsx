import React, { Component } from "react";
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components'
import openSocket from "socket.io-client";

const socket = openSocket("http://demoteam6.azurewebsites.net:" + process.env.PORT);
const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Passion+One&display=swap');
  body {
    background-color:  #714C8A;
    font-family: 'Passion One', cursive;
    overflow: hidden;
    text-align: center;
  
  }
`;
export const Grid = styled.div`
 
`;

export const Row = styled.div`

    display: flex;
    background-color: #E1D3E4;
    display: block ruby;
  margin: 0;
`;


export const Col = styled.div`
    flex: ${(props) => props.size};


`;



const CardStyle = styled.div`

    display: table;
    padding-right: 30px;
  font-size: 35px;
  background-color: #E1D3E4;
  color: #2A1D34;
  margin: 0; 

  height: 3.57em;


`;

const TextStyle = styled.p`
  

`;

const CardImg = styled.div`

   position: relative;
    top: 0.4em;
    padding-left: 2em;

`;

const Leadheader =  styled.div`
  display: block;
  background-color: #422D53;
  justifyContent: center;
  alignItems: center;
  color: #C3B0D3;
  width: 100%;
  height: 3.1rem;
  font-size: 45px;
  border-radius: 5px 5px 0 0;
  padding-top: 0.04rem;
  padding-bottom: 4rem;
`;


const Container =  styled.div`

  width: 30%;
  position: relative;
  left: 65%;
 top: -39em;
`;


const Title = styled.h1`
  margin: 0.1em
`;

const LeaderboardHeader = () => {
  return (
    <Leadheader>
        <Title>LEADERBOARD</Title>
    </Leadheader>
  )
}

class Card extends React.Component {
  render(){
    return (
      <CardStyle>
        <TextStyle>{this.props.name}</TextStyle><TextStyle>{this.props.score}</TextStyle> 
      </CardStyle>
    )

  }
}
class Leaderboard extends React.Component {

    
    constructor(props) {
        
        // makes this refer to this component
        super(props);

        // // set local state
        // this.state = {
        //     name: this.props.name,
        //     score: this.props.score,
        // };

    }

    render() {
      const name = this.props.leaderboard[0].name; 
      const score = this.props.leaderboard[0].score;
      return (
      <React.Fragment>
      <GlobalStyle/>
        <Container>

          <LeaderboardHeader />

            <Grid>
                <Row>

                <CardStyle>     
                     <Col size={1}>
                        <Card name ={name} />
                     </Col>
                </CardStyle>

                <CardStyle> 
                    <Col size={1}>
                            <Card score={score} />
                    </Col>
                    </CardStyle>
                </Row>
            </Grid>
      </Container>
    
      </React.Fragment>      )
    }
}

export default Leaderboard;

