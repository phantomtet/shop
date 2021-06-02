import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { updateinfo } from '../actions/clientinfoAction'
export  default function Profile () {
    const [userinfo, setUserInfo] = useState('')
    const client = useSelector(state => state.clientinfo)
    const { id } = useParams()
    const dispatch = useDispatch()
    const [relationship, setRelationship] = useState(() => {
        if (client.friends.includes(id)) return 'friend'
        if (JSON.parse(client.friendrequest).sent.includes(id)) return 'sent'
        if (JSON.parse(client.friendrequest).receive.includes(id)) return 'receive'
        return 'notfriend'
    })
    const clickFriendButton = () => {
        dispatch(updateinfo('friends'))
        

    }
    useEffect(() => {
        Axios.get('http://localhost:3001/profile', {params: {id: id}})
        .then(res => setUserInfo(res.data[0]))

    })
    if (userinfo)
    return ( 
        <div>
            <div class='test' style={{display: 'flex', justifyContent: 'center', position: 'relative',}}>
                <img src='https://img.freepik.com/free-vector/abstract-banner-background-with-red-shapes_1361-3348.jpg?size=626&ext=jpg' style={{width: '960px', maxHeight: '348px', maxWidth: '100%'}}/>
                <div style={{position: 'absolute', left: '50%', top: '90%', transform: 'translate(-50%, -50%)'}}>
                    <img class='circle3'/>       
                    <p style={{textAlign: 'center', fontSize: '32px',}}>{userinfo.name}</p>
                </div>
            </div>
            <div style={{paddingTop: '100px'}}></div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', width: '960px', borderTop: '1px solid gray'}}>
                    <div style={{display: 'flex'}}>
                        <div onClick={clickFriendButton} class='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                            Posts
                        </div>
                        <div class='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                            About
                        </div>
                        <div class='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                            Friends
                        </div>
                        <div class='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                            Photos
                        </div>
                        <div class='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                            Videos
                        </div>
                    </div>
                    <div style={{display: 'flex', paddingTop: '15px'}}>
                        <AddFriendButton relationship={relationship} id={id}/>
                        <MessageButton/>
                        <AdvanceOptions/>
                    </div>
                </div>
            </div>
        </div>
    )
    else return '404 not found'
}
export function AddFriendButton (props) {
    const client = useSelector(state => state.clientinfo)
    const sentfriendrequest = () => {
        Axios.post('http://localhost:3001/sentfriendrequest', {from: client.id, to: props.id})
    }

    
    switch (props.relationship) {
    case 'notfriend': 
        return (
            <div onClick={sentfriendrequest} class='canclick' style={{display: 'flex', height: '36px', padding: '7px 12px 7px 12px', backgroundColor: 'green', borderRadius: '10px'}}>
                <img style={{position: 'relative', top: '-5px', left: '-5px', height: '30px', width: '30px'}} src='https://cdn0.iconfinder.com/data/icons/social-media-glyph-1/64/Facebook_Social_Media_User_Interface-35-512.png'/>
                <p>Add Friend</p>
            </div>
        )
    case 'friend': 
        return (
            <div class='canclick' style={{display: 'flex', height: '36px', padding: '7px 12px 7px 12px', backgroundColor: 'lightgray', borderRadius: '10px'}}>
                <img style={{position: 'relative', top: '-5px', left: '-5px', height: '30px', width: '30px'}} src='https://lh3.googleusercontent.com/proxy/MuOzW6uXs_EwkOccrAPtPXmNcawjj8Y6k2MoEcLfuUveRV_w6CYyaSZQw3XzMpLmn8Geio4R7NoObvd4DvF48skEuZuDS1OKJXSmA3d-5F6B8KDb54Bn'/>
                <p>Friends</p>
            </div>
        )
    case 'sent':
        return (
            <div class='canclick' style={{display: 'flex', height: '36px', padding: '7px 12px 7px 12px', backgroundColor: 'lightgray', borderRadius: '10px'}}>
                <img style={{position: 'relative', top: '-5px', left: '-5px', height: '30px', width: '30px'}} src='https://cdn2.iconfinder.com/data/icons/user-management/512/cancel-512.png'/>
                <p>Cancel Request</p>
            </div>
        )
    case 'receive':
        return (
            <div class='canclick' style={{display: 'flex', height: '36px', padding: '7px 12px 7px 12px', backgroundColor: 'lightgray', borderRadius: '10px'}}>
                <img style={{position: 'relative', top: '-5px', left: '-5px', height: '30px', width: '30px'}} src='https://condotelvandon.com/wp-content/uploads/sites/81/2017/06/icon-v.png'/>
                <p>Accept Request</p>
            </div>
        )
    default:
        return '' 
    }
}

export function MessageButton () {
    return (
        <div class='canclick' style={{display: 'flex', height: '36px', padding: '7px 12px 7px 12px', backgroundColor: 'lightgray', borderRadius: '10px'}}>
            <img style={{position: 'relative', top: '-5px', left: '-5px', height: '30px', width: '30px'}} src='https://i.pinimg.com/originals/7b/7b/c6/7b7bc658d3fce83780679e84dc62f2fa.png'/>
            <p>Message</p>
        </div>
    )
}
export function AdvanceOptions () {
    return (
        <div class='canclick' style={{height: '36px', width: '36px', backgroundColor: 'lightgray'}}>
            <div style={{position: 'relative',top: '-6px', textAlign: 'center', fontSize: '30px'}}>
                ...
            </div>
        </div>
    )
}
