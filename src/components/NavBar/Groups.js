import React from 'react'
import { FaUsers } from 'react-icons/fa'
import { Link, useRouteMatch } from 'react-router-dom'
export default function Groups (props) {
    return(
        <Link className='canclick' to='/groups' style={{width: '100px', padding: '0 25px'}}>
            <FaUsers size='50' color= { useRouteMatch({path: '/groups'}) && '#00ccff'}/>
        </Link>
    )
}