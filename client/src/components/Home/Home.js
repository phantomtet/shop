import React from 'react'
import {Link} from 'react-router-dom'
import HomeLeft from './HomeLeft'
import HomeMid from './HomeMid'
import HomeRight from './HomeRight'
import {FaHome} from 'react-icons/fa'
import { useSelector } from 'react-redux'
export function HomeButton () {
    return(
        <Link to='/' className='canclick collapse1000' style={{width: '100px', padding: '0 25px'}}>
            <FaHome size='50' color=''/>
        </Link>
    )
}
export function Home () {
    const client = useSelector(state => state.firebase.profile)
    return (
        <div id='home'>
            <HomeLeft/>
            {client.id && <HomeMid client={client}/>}
            <HomeRight/>
        </div>
    )
}

