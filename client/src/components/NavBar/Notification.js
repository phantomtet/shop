import React, { useState } from 'react'

export default function Notification (props) {
    const [isOpen, setOpen] = useState(false)
    const [List, setList] = useState([])

    const func = (target) => {
        if (!document.getElementById('Notification')) {document.removeEventListener('mousedown', func); return}
        if (!document.getElementById('Notification').contains(target.target)) {            //neu k click vao div 
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


    return(
        <div id='Notification' style={{margin: '0 2px 0 2px'}}>
            <img onClick={open} class='circle1 canclick' src='https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-bell-512.png'/>
            {isOpen ? 
            <div style={{backgroundColor: 'lightgreen', margin: '8px', padding: '8px 8px', width: '360px', right: '0', position: 'absolute', border: '1px solid green'}}>
                Under construction
            </div>
            :
            ''
            }
        </div>

    )
}

function SingleList (props) {
    return (
        <div>
            a
        </div>
    )
}