import React from 'react'
import {BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom'
import { Friends } from './NavBar/Friends'
import { Home } from './NavBar/Home'
import NavBar from './NavBar/NavBar'
import Profile from './Profile'

export default function MainApp (props) {
    return(
        <div>
            <Router>
            <NavBar/><div style={{height: '50px'}}/>
                <Switch>
                    <Route exact path="/"><Home/></Route>
                    <Route path="/friends"><Friends/></Route>
                    <Route path='/profile/:id'><Profile/></Route>
                </Switch>
            </Router>
        </div>
    )
}