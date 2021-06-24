import React from 'react'
import {AiFillShop} from 'react-icons/ai'
import { Link, useRouteMatch } from 'react-router-dom'
export default function Market (props) {
    return(
        <Link to='/market' className='canclick' style={{width: '100px', padding: '0 25px'}}>
            <AiFillShop size='50' color= { useRouteMatch({path: '/market'}) && '#00ccff'}/>
        </Link>
    )
}