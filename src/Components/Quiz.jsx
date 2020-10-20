import React, { Component } from "react";
import Leaderboard from "./Leaderboard"
import ReactDOM from 'react-dom';
import styled from "styled-components";
import { createGlobalStyle } from 'styled-components'
import openSocket from "socket.io-client";
import PassionOne from '../fonts/PassionOne.ttf';

const socket = openSocket('https://demoteam6.azurewebsites.net/?EIO=3&transport=polling&t=NL6W9oS');

const GlobalStyle = createGlobalStyle`
 @font-face {
    font-family: PassionOne;
    src: url(${PassionOne});
  }
  body {
    background-color:  #714C8A;
    font-family: 'Passion One', cursive;
    overflow: hidden;
    text-align: center;
    font: 50px;
  }

  button{

    font-family:'PassionOne';
    color: #714c8a;
    border: none;
    width: 50%;
    height: 200px;
    font-size: 1em;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-left: 10px;
    margin-right: 10px;
    outline: none;
    background-color: transparent;
    
    :hover {
      text-decoration: underline;
      font-size: 1.5em;
    }
`;


// grid width can be changed depending on how big the other components are
export const Grid = styled.div`
  background-color: #714C8A; // purple
  width: 940px;
  position: relative;
  left: 5em;
`;


//display: flex; stretches it out a bit vertically but then the text doesn't center align
//display: block; FIXES IT <3

//adding height stops it from stretching vertically
//but seems to put it in the top 'line' so if it's a long question it'll wrap to the line below
//so if it's a short one it leaves a gap for the line underneath
export const QuestionRow = styled.div`
  display: block;
  background-color: #DCC6E0; // lilac
  justifyContent: center;
  alignItems: center;
  margin:;
  padding: 1em;
  height:95%;
`;

export const QuestionText = styled.h2`

`;

export const Row = styled.div`
  display: flex;

  justifyContent:center;
    alignItems: center;
`;

export const Col = styled.div`
  flex: ${(props) => props.size};
`;

// button width used to be 400px but changed to percentage so it resizes

const Button = styled.button`
    font-family:'PassionOne';
    color: #714c8a;
    border: none;
    width: 50%;
    height: 200px;
    font-size: 2em;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-left: 10px;
    margin-right: 10px;
    outline: none;
    
    :hover {
      text-decoration: underline;
      font-size: 2.5em;
    }
`;



const Button1 = styled(Button)` 
  background: #98FB98; // green
  `;

const Button2 = styled(Button)`
  background: #89C4F4; // blue  
  `;

const Button3 = styled(Button)`
  background: #DDA0DD; // pink
  `;

const Button4 = styled(Button)`
  background: #F4A460; // orange
  `;

class Quiz extends Component{
    state = {
        question:[],
        code:"",
        name:"JohnDoe",
        leaderboard:{0:{
            name:"JohnDoe",
            score:0
        }}
    }

    componentWillMount(){
        //Join as host
        socket.emit("HOST",this.state.name);

        //Recive the lobby code
        socket.on("CODE",lobbyCode =>{
            this.setState({
                code: lobbyCode
            });

            console.log(this.state.code);
            let data={code:this.state.code}
            //Request the leaderboard
            socket.emit("LEADERBOARD",data);

            //Request the question
            data.number= 0;
            socket.emit("QUESTION",data);
        });

    

        //Recive the question
        socket.on("QUESTION", question =>{
            this.setState({
              question:[question]
            })
        })


        // data={code:this.state.code}
        //  //Request the leaderboard
        //  socket.emit("LEADERBOARD",data);

         //Recivce the leaderboard
         socket.on("LEADERBOARD", leaderboard => {
             this.setState({
                 leaderboard: leaderboard
             })

             console.log(this.state.leaderboard);
         });
    }

    nextQ = () =>{
        let data={code: this.state.code, number: 1}
        socket.emit("QUESTION",data);

        socket.on("QUESTION", question =>{
            this.setState({
              question:[question]
            })
        })
    }

    CheckAns = (userSelect) =>{

        userSelect= userSelect.toString();
        if(userSelect === this.state.question[0].correct_ans){
            console.log("nice")
            //Emit to server
            var data={
                score: 5,
                code: this.state.code
            }
            socket.emit("SCORE",data);

            data={
                code: this.state.code
            }
            socket.emit("LEADERBOARD",data);

            //Recivce the leaderboard
            socket.on("LEADERBOARD", leaderboard => {
                this.setState({
                    leaderboard: leaderboard
                });

            console.log(this.state.leaderboard);
        })
        }else{
            console.log("nope")
        }
    }

    renderQuestion = () =>{
        var {question} = this.state;

        return question.map( q => {
                return (
                    <h1>{q.question}</h1>
                );
            })
    }
    
    renderAnswerA = () =>{
        var {question} = this.state;

        return question.map( q => {
            return (
                <button onClick={() => {this.CheckAns(q.answer_a)}}>{q.answer_a}</button>
            )
        })
    }

    renderAnswerB = () =>{
        var {question} = this.state;

        return question.map( q => {
            return (
                <button onClick={() => {this.CheckAns(q.answer_b)}}>{q.answer_b}</button>
            )
        })
    }

    renderAnswerC = () =>{
        var {question} = this.state;

        return question.map( q => {
            return (
            <button onClick={() => {this.CheckAns(q.answer_c)}}>{q.answer_c}</button>
            )
        })
    }

    renderAnswerD = () =>{
        var {question} = this.state;

        return question.map( q => {
            return (
                <button onClick={() => {this.CheckAns(q.answer_d)}}>{q.answer_d}</button>
            )
        })
    }

    renderLeaderboard =() =>{
        var {leaderboard} = this.state;

        //var leaderboard= this.state.leaderboard

        return (
            //Pass the leaderboard into the object
            <Leaderboard leaderboard={leaderboard}/>
            //<Leaderboard name={leaderboard[0].name} score={leaderboard[0].score}/>
            )
        
    }

    render(){
        return(
            <React.Fragment>
            <GlobalStyle/>
                    <Grid>
                        <QuestionRow>
                            <QuestionText>
                            {this.renderQuestion()}
                        </QuestionText>
                </QuestionRow>

                <Row>
                  <Button1>{this.renderAnswerA()}</Button1>
                  <Button2>{this.renderAnswerB()}</Button2>
                </Row>
                <Row>

                  <Button3>{this.renderAnswerC()}</Button3>
                  <Button4>{this.renderAnswerD()}</Button4>
               </Row>
              </Grid>
        
                <div>{this.renderLeaderboard()}</div>
                <button onClick={this.nextQ}>Next</button>
               
            </React.Fragment>
        )
    }


}

export default Quiz;