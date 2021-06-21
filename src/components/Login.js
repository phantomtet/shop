import React, { useState } from 'react'
import Axios from 'axios'
import {useDispatch, useSelector} from 'react-redux'
import {addinfo} from '../actions/clientinfoAction'

export default function Login (props) {
    const [islogin, setislogin] = useState(true)
    const [loginid, setloginid] = useState('')
    const [loginpassword, setloginpassword] = useState('')
    const [signupname, setsignupname] = useState('')
    const [signupid, setsignupid] = useState('')
    const [signuppassword, setsignuppassword] = useState('')
    const changeLoginMode = mode => {
        if (mode !== islogin) setislogin(mode)
    }
    
    const addinfotostate = useDispatch()
    const test = useSelector(state => state.clientinfo.name)
    const loginidChange = ({target}) => setloginid(target.value)
    const loginpasswordChange = ({target}) => setloginpassword(target.value)
    const signupidChange = ({target}) => setsignupid(target.value)
    const signupnameChange = ({target}) => setsignupname(target.value)
    const signuppasswordChange = ({target}) => setsignuppassword(target.value)
    const onLogin = () => {
        Axios.post('http://localhost:3001/login', {id: loginid, pass: loginpassword})
        .then(res => {
            if (res.data.length !==0) {
                addinfotostate(addinfo(res.data[0]))
                localStorage.setItem('id', res.data[0].id)
            }
            else alert('Sai ten dang nhap hoac mat khau')
        })
        
    }
    const onSignup = () => {
        Axios.post('http://localhost:3001/signup', {loginid: signupid, password: signuppassword, name: signupname})
        .then(res => {
            if (res.data) alert('Dang ky thanh cong, hay chuyen sang tab dang nhap')
            else alert('loi, co the ten dang nhap da co nguoi su dung')
        })
    }

    const loginForm = <div style={{padding: '10px',}}>
                    Username: <input onChange={loginidChange} value={loginid} style={{width: '440px', margin: '5px', padding: '11px'}}/>
                    Password:{test} <input onChange={loginpasswordChange} vaule={loginpassword} style={{width: '440px', margin: '5px', padding: '11px'}}/>
                    <button style={{width: '465px', margin: '5px', padding: '11px'}} onClick={onLogin}>Log in</button>
                    </div>
    const SignupForm = <div style={{padding: '10px '}}>
                        <input onChange={signupnameChange} value={signupname} style={{width: '440px', margin: '5px', padding: '11px'}} placeholder='Your name'/>
                        <input onChange={signupidChange} value={signupid} style={{width: '440px', margin: '5px', padding: '11px'}} placeholder='Username'/>
                        <input onChange={signuppasswordChange} value={signuppassword} style={{width: '440px', margin: '5px', padding: '11px'}} placeholder='Password'/>
                        <button style={{width: '465px', margin: '5px', padding: '11px'}} onClick={onSignup}>Sign up</button>
                    </div>

    return(
        <div id='Login'>
            <div style={{border: '1px solid green', display: 'grid', width: '500px', gridAutoColumns: 'auto auto auto auto auto auto'}}>
                <div onClick={() => changeLoginMode(true)} class='canclick' style={{borderBottom: '1px solid green', gridColumn: '1/3', display: 'flex', justifyContent: 'center', backgroundColor: islogin ? 'green' : '' }}>
                    <h3 style={{color: islogin ? 'white' : 'black'}}>LOGIN</h3>
                </div>
                <div onClick={() => changeLoginMode(false)} class='canclick' style={{borderBottom: '1px solid green', gridColumn: '3/5', display: 'flex', justifyContent: 'center', backgroundColor: !islogin ? 'green' : '' }}>
                    <h3 style={{color: !islogin ? 'white' : 'black'}}>SIGN UP</h3>
                </div>
                <div style={{gridRow: '2/5', gridColumn: '1/5'}}>
                    {islogin ? loginForm : SignupForm}
                </div>
            </div>
        </div>
    )
}