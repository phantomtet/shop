import React, { useEffect } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import tabaction from '../../actions/tabaction'
import {Link} from 'react-router-dom'

export function HomeButton (props) {
    const isChosen = useSelector(state => state.tab) === 'Home'
    const dispatch = useDispatch()
    return(
        <div>
            <Link to='/'><img onClick={() => dispatch(tabaction('Home'))} class='canclick' style={{ width: '50px', height: '50px', borderBottom: isChosen ? '3px solid black' : ''}} src='https://cdn0.iconfinder.com/data/icons/typicons-2/24/home-512.png'/></Link>
        </div>
    )
}
export function Home () {
    return (
        <div id='home' class='test' style={{display: 'flex', justifyContent: 'center'}}>
            <HomeLeft/>
            <HomeMid/>
            <HomeRight/>
        </div>
    )
}
function HomeLeft () {
    const client = useSelector(state => state.clientinfo)
    
    useEffect(() => console.log('change'), [client])
    return (
        <div class='test left' style={{ position: 'fixed', left: '0', width: '360px', padding: '10px 5px 10px 5px'}}>
            <div >
                <Link to={'/profile/30'}>
                    <div class='canclick' style={{display: 'flex', borderRadius: '10px'}}>
                        <img class='circle0'/>
                        <div style={{padding: '7px 0 0 10px', width: '100%'}}>
                            {client.name}
                        </div>
                    </div>
                </Link>
            </div>
        </div>
       
    )
}
function HomeRight () {
    return (
        <div class='test right' style={{ position: 'fixed', right: '0', width: '360px'}}>
            HomeRight
        </div>
    )
}
function HomeMid () {
    return (
        <div class='mid' style={{}}>
            <SingleFeed/>
            <SingleFeed/>
        </div>
    )
}
function SingleFeed (props) {
    return(
        <div style={{borderRadius: '10px', backgroundColor: '#79b486', border: '1px solid green', width: '500px', padding: '12px 16px 0 16px', marginBottom: '12px'}}>
            <div style={{display: 'flex'}}>
                <img class='circle1'/>
                <div style={{width: '100%', marginLeft: '10px'}}>
                    <div>
                        Line1
                    </div>
                    <div>
                        Line2
                    </div>
                </div>
            </div>
            <div style={{margin: '5px 0 5px 0'}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0 5px 0'}}>
                <div>
                    total likes, total dislikes
                </div>
                <div>
                    total comment
                </div>
            </div>
            <div style={{display: 'flex', borderTop: '1px solid green', borderBottom: '1px solid green', padding: '3px 0 3px 0'}}>
                <div class='canclick' style={{display: 'flex', width: '100%', height: '40px', padding: '12px 0 12px 0', justifyContent: 'center'}}>Like/Dislike</div>
                <div class='canclick' style={{display: 'flex', width: '100%', height: '40px', padding: '12px 0 12px 0', justifyContent: 'center'}}>Comment</div>
            </div>

        </div>
    )
}