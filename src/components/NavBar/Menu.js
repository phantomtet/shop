import React, {useState} from 'react'
import {RiMenuFill} from 'react-icons/ri'
export default function Menu (props) {
    const [isOpen, setOpen] = useState(false)
    
    const func = (target) => {
        if (!document.getElementById('Menu')) {document.removeEventListener('mousedown', func); return}
        if (!document.getElementById('Menu').contains(target.target)) {            //neu k click vao div 
            setOpen(false)

            document.removeEventListener('mousedown', func)
        }
    }
    const open = () => {
        if (isOpen === false) {
            setOpen(true)
            document.addEventListener('mousedown', func)
        }
        else {
            setOpen(false)
            document.removeEventListener('mousedown', func)
        }
    }
    return (
        <div id='Menu' style={{margin: '0 2px 0 2px'}}>
            <RiMenuFill size='40' className='canclick' onClick={open} style={{margin: '5px'}}/>
            {isOpen?
            <div className='color3 shadow' style={{margin: '8px', padding: '8px 8px', height: '470px', width: '360px', right: '0', position: 'absolute', borderRadius: '10px'}}>
                Under Construction  
            </div>
            :
            ''}
        </div>
    )
}