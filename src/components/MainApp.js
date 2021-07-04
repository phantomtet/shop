import React from 'react'
import {BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { Friends } from './NavBar/Friends'
import { Home } from './Home/Home'
import NavBar from './NavBar/NavBar'
import Profile from './Profile'
import Chat from './Chat'
import Post from './Post'

export default function MainApp () {
    return(
        <div>
            <Router>
                <NavBar/>
                <div style={{height: '50px'}}></div>
                <Switch>
                    <Route exact path="/"><Home/></Route>
                    <Route path="/friends"><Friends/></Route>
                    <Route path='/profile/:id'><Profile/></Route>
                    <Route path='/posts/:id'><Post/></Route>
                </Switch>
            <Chat />
            </Router>
        </div>
    )
}