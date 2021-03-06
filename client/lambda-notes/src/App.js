import React, { Component } from 'react';
import axios from 'axios';
import All from './components/ViewAll/All'
import { NavLink, Route } from 'react-router-dom'
import CreateNew from './components/nav/CreateNew'
import NoteView  from './components/NoteView/NoteView'
import Search from './components/Search/Search'

import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
      expandedNote: {},
      value: '',
    }
  }

  //gets all the data from the api
  componentDidMount () {
    axios
    .get('https://safe-tor-44897.herokuapp.com/api/notes')
    .then(response => {
      console.log(response);
      this.setState({notes: response.data})
    }) 
    .catch (error => {
      console.log('Error', error);
    })
  }

  //function that sets the state to the incoming data
  addNewNote = data => {
    this.setState({notes: data})
  }


refresh () {
  window.location.reload();
}


  render() {
    return (
      <div className="App">
        <div className = 'wrapper' >
          <nav className = 'navBar'>
            <h1 className = 'roll-in-left lambda-notes'> Lambda Notes </h1>
            <Search className = 'search' />
            <div className = 'topButtons'>
            <NavLink onClick = {this.refresh} className = "links bounce-in-top" to = '/' > View Your Notes </NavLink>
            <NavLink className = " createnew bounce-in-top"
            to = '/create-new-note'> + Create New Note </NavLink>
            </div>
          </nav>
          <div className = 'mainPage'>
          <Route 
            exact path='/' 
            render=
              {props =>
                <All
                 {...props} 
                notes = {this.state.notes}
                />
              }
           />

          <Route 
              exact path='/create-new-note' 
              render=
                {props =>
                  <CreateNew 
                    {...props}
                    addNewNote = {this.addNewNote}
                  />
                }
          />

          <Route 
                exact path='/api/notes/:id' 
                render=
                {props =>
                    <NoteView
                    {...props}
                    note = {this.state.notes} 
                    />
                }
                />

              
           </div>           

        </div>          
      
      </div>
    );
  }
}

export default App;
