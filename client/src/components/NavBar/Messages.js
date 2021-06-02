import React, { useState } from 'react'

export default function Messages (props) {
    const [isOpen, setOpen] = useState(false)

    const func = (target) => {
        if (!document.getElementById('Messages')) {document.removeEventListener('mousedown', func); return}
        if (!document.getElementById('Messages').contains(target.target)) {            //neu k click vao div 
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
        <div id='Messages' style={{margin: '0 2px 0 2px'}}>
            <img onClick={open} style={{backgroundColor: isOpen ? 'green' : ''}} class='circle1 canclick' src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Noun_Project_message_icon_1454470.svg/1024px-Noun_Project_message_icon_1454470.svg.png'/>
            {isOpen?
            <div style={{backgroundColor: 'lightgreen', margin: '8px', padding: '8px 8px', height: '470px', width: '360px', right: '0', position: 'absolute', border: '1px solid green'}}>
                Under Construction  
            </div>
            :
            ''}
        </div>
    )
}