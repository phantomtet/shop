const express = require('express')
const app = express()
const mysql = require('mysql')
const cors  = require('cors')
const { isObject } = require('util')
app.use(cors())
app.use(express.json())


const defaultConfig = {
    "friends": "public",
    "canAddFriend": "true",
}
const defaultFriendRequest = {
    sent: [],
    receive: []
}

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    password: 'password',
    database: 'statuslist',
})

app.post('/login', (req, res) => {
    const id = req.body.id
    const pass = req.body.pass
    db.query('select id, name, friends, friendrequest from user where loginid=? and password=?', [id, pass], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})
app.post('/signup', (req, res) => {
    const loginid = req.body.loginid
    const password = req.body.password
    const name = req.body.name

    db.query('insert into user (loginid, password, config, name, friends, friendrequest) values (?,?,?,?,?,?)', [loginid, password, JSON.stringify(defaultConfig), name, JSON.stringify([]), JSON.stringify(defaultFriendRequest)], (err, result) => {
        if (err) {console.log(err.errno), res.send(false)}
        else res.send(true)
    })
})
app.get('/profile', (req, res) => {
    const id = req.query.id
    db.query('select name from user where id=?', [id], (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})
app.post('/sentfriendrequest', (req, res) => {
    const from = req.body.from
    const to =  req.body.to
    db.query('update user set friendrequest = json_array_append(friendrequest, "$.receive", ?) where id=?', [from, to], (err) => {
        if (err) console.log(err)
        else db.query('update user set friendrequest = json_array_append(friendrequest, "$.sent", ?) where id=?', [to, from], (err, result) => {
            if (err) console.log(err)
            else console.log('friend request sent')
        })
    })
})

app.get('/fetch', (req, res) => {
    const data = req.query.data
    const id = req.query.id
    const query = `select ${data} from user where id=${id}`
    db.query(query, (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})
app.listen(3001)