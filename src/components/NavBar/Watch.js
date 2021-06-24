import React from 'react'
import {RiYoutubeLine} from 'react-icons/ri'
import { useRouteMatch, Link } from 'react-router-dom'
export default function Watch (props) {
    return(
        <Link to='/watch' className='canclick' style={{width: '100px', padding: '0 25px'}}>
            <RiYoutubeLine size='50' color= { useRouteMatch({path: '/watch'}) && '#00ccff'}/>
        </Link>
    )
}