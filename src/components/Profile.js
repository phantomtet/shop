import React, { useEffect, useState } from 'react'
import { Route, Switch, useParams, useRouteMatch } from 'react-router-dom'
import  { firestore, storage, } from '../firebase'
import {useCollectionData, useCollectionDataOnce, useDocumentData, useDocumentDataOnce} from 'react-firebase-hooks/firestore'
import {Link} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {BsThreeDots} from 'react-icons/bs'
import {addOpen, removeCollapse} from '../actions/chatlistAction'
import {BsFillPersonCheckFill, BsXOctagon} from 'react-icons/bs'
import { NewPost } from './Home/HomeMid'
import { SinglePost } from './Home/SinglePost'
import {TiTick, TiTimes} from 'react-icons/ti'
import Tag from './Tag'
import { BiCamera, BiCaretDown, BiMessageDetail } from 'react-icons/bi'
import { RiUserAddFill } from 'react-icons/ri'
import { v4 } from 'uuid'
import { addNotify } from './function'
export  default function Profile () {
    const client = useSelector(state => state.firebase.profile)
    const { id } = useParams()
    const [opponents] = useDocumentData(firestore.collection('users').doc(id))
    const {path, url} = useRouteMatch()
    const [friends] = useCollectionData(firestore.collection(`users/${id}/relationship`).where('relationship', '==', 'friends'))
    const [editTab, setEditTab] = useState('')
    const [newName, setNewName] = useState('')
    const [openTab, setOpenTab] = useState('')
    useEffect(() => {
        if (openTab) {
            const func = (e) => {
                if (!document.getElementById(openTab).contains(e.target)) setOpenTab('')
            }
            document.addEventListener('mousedown', func)
            return () => document.removeEventListener('mousedown', func)
        }
        else return
    }, [openTab])

    const handleEditSubmit = () => {
        switch (editTab) {
            case 'name': 
                firestore.collection('users').doc(client.id).set({name: newName}, {merge: true})
                setEditTab('')
            
        }
    }
    const checkValidAvatar = ({target}) => {
        if (target.file && target.files[0].size >= 2097152 || target.file && !['image/gif', 'image/jpeg', 'image/png'].includes(target.files[0].type)) {
            alert('File is too big or invalid file type')
            target.value = ''
        }
        else {
            const id = v4()
            storage.ref(`photo/${client.id}/${id}`).put(target.files[0])
            .then(snapshot => snapshot.ref.getDownloadURL().then(url => firestore.doc(`users/${client.id}`).set({avatarURL: url}, {merge: true})))
        }
    }
    const checkValidBackground = ({target}) => {
        if (target.file && target.files[0].size >= 2097152 || target.file && !['image/gif', 'image/jpeg', 'image/png'].includes(target.files[0].type)) {
            alert('File is too big or invalid file type')
            target.value = ''
        }
        else {
            const id = v4()
            storage.ref(`photo/${client.id}/${id}`).put(target.files[0])
            .then(snapshot => snapshot.ref.getDownloadURL().then(url => firestore.doc(`users/${client.id}`).set({backgroundURL: url}, {merge: true})))
        }
    }
    if (opponents)
    return ( 
        <div>
            {/* header */}
            <div className='color3' style={{}}>
                <div style={{maxWidth: '960px', margin: 'auto', position: 'relative'}}>
                    <div style={{paddingBottom: '37%', position: 'relative'}}>
                        {/* background  */}
                        <img className='shadow' style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover'}} src={opponents.backgroundURL || opponents.avatarURL}/>
                        {client.id === opponents.id && <BiCamera onClick={() => document.getElementById('inputBackground').click()} title='Edit your background' className='canclick shadow' size='30' style={{position: 'absolute', borderRadius: '100%', bottom: '0', right: 0, backgroundColor: 'lightgray'}}/>}
                        <input onChange={checkValidBackground} id='inputBackground' type='file' style={{display: 'none'}} accept='.jpeg, .png, .jpg'/>
                    </div>
                    <div style={{position: 'absolute', left: '50%', top: '90%', display: 'flex', transform: 'translate(-50%, -50%)'}}>
                        {/* avatar */}
                        <img className='circle3 shadow' style={{ objectFit: 'cover'}} src={opponents.avatarURL}/>
                        {client.id === opponents.id && <BiCamera onClick={() => document.getElementById('inputAvatar').click()} title='Edit your avatar' className='canclick shadow' size='30' style={{position: 'absolute', borderRadius: '100%', bottom: '0', right: 0, backgroundColor: 'lightgray'}}/>}
                        <input onChange={checkValidAvatar} id='inputAvatar' type='file' style={{display: 'none'}} accept='.jpeg, .png, .jpg'/>
                    </div>
                </div>
                <div style={{display: 'flex', justifyContent: 'center', padding: '60px 0 0 0', maxWidth: '960px', margin: 'auto'}}>
                    <div style={{fontSize: '40px'}}>
                        { editTab !== 'name' &&
                            <div>
                                {opponents.name}
                                { client.id === opponents.id &&
                                    <span onClick={() => setEditTab('name')} className='canclick2' title='Edit your profile name' style={{fontSize: '15px', position: 'absolute', }}>Edit</span>}
                            </div>}
                        { editTab === 'name' && client.id === opponents.id &&
                        <div style={{display: 'flex'}}>
                            <input value={newName} onChange={({target}) => setNewName(target.value)} maxLength='22' style={{ fontSize: '30px'}} placeholder='New name'/>
                            { newName &&
                                <TiTick onClick={handleEditSubmit} className='canclick' size='30' style={{margin: 'auto'}}/>}
                            <TiTimes onClick={() => setEditTab('')} className='canclick' size='30' style={{margin: 'auto'}}/>
                        </div>}
                    </div>
                </div>
            
            </div>
            
            {/* sticky navigatebar div */}
            <div className='color3 shadow' style={{zIndex: 1, position: 'sticky', top: '50px'}}>
                <div style={{maxWidth: '960px', margin: 'auto', padding: '0 10px'}}>   
                    <div style={{display: 'flex', justifyContent: 'space-between', width: '100%',}}>
                        <div style={{display: 'flex'}}>
                            <Link to={`${url}`}>
                                <div className='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                                    Posts
                                </div>
                            </Link>
                            <Link className='collapse730' to ={`${url}/about`}>
                                <div className='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                                    About
                                </div>
                            </Link>
                            <Link className='collapse730' to={`${url}/friends`}>
                                <div className='canclick' style={{display: 'flex', height: '60px', padding: '20px 16px 20px 16px'}}>
                                    <div style={{marginRight: '5px'}}>Friends</div>
                                    <div>
                                        {friends && <div>{friends.length}</div>}
                                    </div>
                                </div>
                            </Link>
                            <Link className='collapse730'>
                                <div className='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                                    Photos
                                </div>
                            </Link>
                            <div onClick={() => setOpenTab('adv')} className='canclick' style={{position: 'relative',height: '60px', padding: '20px 16px 20px 16px', display: 'flex'}}>
                                More <BiCaretDown />
                                { openTab === 'adv' &&
                                    <div id='adv' className='color3 shadow' style={{maxHeight: '300px', overflow: 'auto', position: 'absolute', left: '85px', minWidth: '150px'}}>
                                    <Link to={`${url}`}>
                                        <div className='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                                            Posts
                                        </div>
                                    </Link>
                                    <Link to ={`${url}/about`}>
                                        <div className='canclick' style={{height: '60px', padding: '20px 16px 20px 16px'}}>
                                            About
                                        </div>
                                    </Link>
                                    <Link to={`${url}/friends`}>
                                        <div className='canclick' style={{display: 'flex', height: '60px', padding: '20px 16px 20px 16px'}}>
                                            <div style={{marginRight: '5px'}}>Friends</div>
                                            <div>
                                                {friends && <div>{friends.length}</div>}
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to={`${url}/photos`}>
                                        <div className='canclick' style={{display: 'flex', height: '60px', padding: '20px 16px 20px 16px'}}>
                                            <div style={{marginRight: '5px'}}>Photos</div>
                                        </div>
                                    </Link>
                                    <Link to={`${url}/videos`}>
                                        <div className='canclick' style={{display: 'flex', height: '60px', padding: '20px 16px 20px 16px'}}>
                                            <div style={{marginRight: '5px'}}>Videos</div>
                                        </div>
                                    </Link>
                                    <Link to={`${url}/checkin`}>
                                        <div className='canclick' style={{display: 'flex', height: '60px', padding: '20px 16px 20px 16px'}}>
                                            <div style={{marginRight: '5px'}}>Check-ins</div>
                                        </div>
                                    </Link>
                                </div>}
                            </div>
                        </div>
                        <div style={{width: '300px', display: 'flex', paddingTop: '15px'}}>
                            <AddFriendButton id={id} />
                            <MessageButton id={id}/>
                            <AdvanceOptions/>
                        </div>
                    </div>
                </div>
                </div> 
            
            {/* main  */}
            <div style={{maxWidth: '960px', margin: 'auto', padding: '0 10px'}}>
                <Switch>
                    <Route exact path={`${url}`}>
                        <Posts opponents={opponents} friends={friends}/>
                    </Route>
                    <Route path={`${url}/about`}>
                        Under construction
                    </Route>
                    <Route path={`${url}/friends`}>
                        <FriendList opponents={opponents}/>
                    </Route>
                </Switch>
            </div>
        
        </div>
    )
    else return "This Page Isn't Available"
}
function Posts ({opponents, friends}) {
    const client = useSelector(state => state.firebase.profile)
    const [posts] = useCollectionDataOnce(firestore.collection(`posts`).where('relateTo', 'array-contains', opponents.id).limit(10).orderBy('createdAt', 'desc'))
    // const [postsWithPhoto] = useCollectionDataOnce(firestore.collection(`posts`).orderBy('fileURL').orderBy('createdAt', 'desc').where('relateTo', 'array-contains', opponents.id).where('fileURL', '!=', '').limit(9))
    const [imagePaths, setImagePaths] = useState([])
    useEffect(() => {
        storage.ref(`${opponents.id}/image`).list({maxResults: 9})
        .then(value => {
            let array = []
            value.items.forEach(item => array = array.concat(item.fullPath))
            setImagePaths(array)
        })
    },[])
    return (
        <div style={{display: 'flex', justifyContent: 'space-between', maxWidth: '100%'}}>    
            <div className='collapse1000' style={{minWidth: '300px', margin: '15px'}}>      
                <div className='color3 shadow' style={{padding: '0 16px 0 16px', marginBottom: '15px', borderRadius: '10px'}} >  
                    <div style={{fontWeight: 'bold', padding: '20px 0 4px'}}>Intro</div>
                    <div>{opponents.intro ? opponents.intro : 'No information given'}</div>
                </div>
                <div className='color3 shadow' style={{padding: '0 16px 0 16px', marginBottom: '15px', borderRadius: '10px' }}>  
                    <div style={{fontWeight: 'bold', padding: '20px 0 4px'}}>Photos</div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridRowGap: '5px', gridTemplateRows: 'auto auto auto'}}>
                        {imagePaths.length !== 0 && imagePaths.map((path, index) => <SinglePhoto key={index} path={path} />)}
                    </div>
                </div>
                <div className='color3 shadow' style={{padding: '16px', marginBottom: '15px', borderRadius: '10px'}}>  
                    <div style={{fontWeight: 'bold'}}>Friends</div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridRowGap: '5px', gridTemplateRows: 'auto auto auto'}}>
                        {friends && friends.map((val, index) => <SingleFriend key={index} id={val.id}/>)}
                    </div>
                </div>
            </div>
            {/* owner posts */}
            <div style={{ margin: '15px auto', maxWidth: '600px', width: '100%'}}>                   {/*right div */}              
                {/* <div className='color3' style={{ fontWeight: 'bold', fontSize: '25px', margin: '15px 0', padding: '5px', borderRadius: '10px'}}>
                    {posts && posts.length ? 'Posts' : 'This user has no post yet'}
                </div> */}
                {client.id === opponents.id  && <NewPost/>}
                {posts && posts.map(id => <SinglePost key={id} id={id}/>)}
            </div>
        </div>
    )
}

function SinglePhoto ({path}) {
    const [url, setURL] = useState('')
    const [postPath, setPostPath] = useState('')
    useEffect(() => {
        storage.ref(path).getDownloadURL()
        .then(url => setURL(url))
        storage.ref(path).getMetadata()
        .then(metadata => setPostPath(metadata.customMetadata.post))
    },[])
    if (postPath && url) return (
        <div style={{width: '100%', height: 'auto',}}>
            <Link to={`/${postPath}`}>
                <img className='shadow' src={url} style={{width: '92.66px', height: '92.66px'}}/>
            </Link>
        </div>
    )
    else return ''
}

function SingleFriend ({id}) {
    const [user] = useDocumentData(firestore.collection('users').doc(id))
    return (
        <div style={{width: '100%', height: 'auto',}}>
            <Link to={'/profile/' + id}>
                <img style={{width: '100%', height: '92.66px'}} src={user && user.avatarURL}/>
                <div style={{width: '90px', overflow: 'hidden'}}>
                    {user && user.name}
                </div>
            </Link>
        </div>
    )
}
function SingleFriend2 ({id}) {
    const [user] = useDocumentData(firestore.collection('users').doc(id))
    return (
        <div style={{display: 'flex', minWidth: '50%', margin: '10px 0'}}>
            <img src={user && user.avatarURL}/>
            <div>
                {user && <Tag info={user}/>}
                {user && <AddFriendButton id={user.id}/>}
            </div>
        </div>
    )
}


function FriendList ({opponents}) {
    const [tab, setTab] = useState('all')
    const [list, setList] = useState([])
    useEffect(() => {
        setList([])
        const ref = firestore.collection(`users/${opponents.id}/relationship`)
        switch (tab) {
            case 'all': ref.where('relationship', '==', 'friends').get().then(snapshot => snapshot.docs.forEach(doc => setList(prev => [...prev,doc]))); return
            case 'recent': ref.where('relationship', '==', 'friends').where('friendSince', '>=', Date.now()-2592000000).get().then(snapshot => snapshot.docs.forEach(doc => setList(prev => [...prev,doc]))); return
            case 'birthday': return
            case 'following': ref.where('follow', '==', true).where('relationship', '!=', 'friends').get().then(snapshot => snapshot.docs.forEach(doc => setList(prev => [...prev,doc])))
        }
    }, [tab])
    return (
        <div className='color3' style={{padding: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div style={{fontWeight: 'bold', fontSize: '25px',}}>
                    Friends
                </div>
                <div style={{padding: '5px', display: 'flex', justifyItems: 'center'}}>
                    <input placeholder='Search' style={{width: '216px', height: '36px', marginRight: '15px', borderRadius: '25px'}}/>
                    <div className='canclick color4' style={{borderRadius: '5px', marginTop: 0}}>
                    <BsThreeDots  size='36' />
                    </div>
                </div>
            </div>
            {/* Query type */}
            <div style={{display: 'flex', height: '60px', justifyItems: 'center', marginBottom: '20px'}}>
                <div onClick={() => setTab('all')} className='canclick' style={{padding: '18px 10px', borderBottom: tab === 'all' ? '3px solid #c4dfe6' : '', color: tab === 'all' ? '#c4dfe6' : ''}}>
                    All Friends
                </div>
                <div onClick={() => setTab('recent')} className='canclick' style={{padding: '18px 10px', borderBottom: tab === 'recent' ? '3px solid #c4dfe6' : '', color: tab === 'recent' ? '#c4dfe6' : ''}}>
                    Recently Added
                </div>
                <div className='cantclick' title='You need to be VIP member to use this' style={{padding: '18px 10px', borderBottom: tab === 'birthday' ? '3px solid #c4dfe6' : '', color: tab === 'birthday' ? '#c4dfe6' : ''}}>
                    Birthdays
                </div>
                <div onClick={() => setTab('following')} className='canclick' style={{padding: '18px 10px', borderBottom: tab === 'following' ? '3px solid #c4dfe6' : '', color: tab === 'following' ? '#c4dfe6' : ''}}>
                    Following
                </div>
            </div>
            {/* list here */}
            <div style={{display: 'flex', flexWrap: 'wrap', overflow: 'auto', }}>
                {list && list.map(data => <SingleFriend2 key={data.id} id={data.id}/>)}
            </div>
        </div>
    )
}

export function AddFriendButton (props) {
    const client = useSelector(state => state.firebase.profile)
    const [relation] = useDocumentData(firestore.doc(`users/${client.id}/relationship/${props.id}`))
    const [relationship, setRelationship] = useState('')
    useEffect(() => {
        if (client.id === props.id) return
        if (relation) {
            setRelationship(relation.relationship)
        }   
    }, [relation])
    const sentfriendrequest = () => {
        firestore.doc(`users/${client.id}/relationship/${props.id}`).set({follow: true, relationship: 'sent', id: props.id}, {merge: true})
        firestore.doc(`users/${props.id}/relationship/${client.id}`).set({relationship: 'receive', id: client.id}, {merge: true})
        //trigger a notify
        addNotify(client.id, props.id, {
            text: 'sent you a friend request',
            path: `profile/${client.id}`,
            createdAt: Date.now(),
            createdBy: client.id
        })
    }
    const cancelfriendrequest = () => {
        firestore.doc(`users/${client.id}/relationship/${props.id}`).set({follow: false, relationship: ''}, {merge: true})
        firestore.doc(`users/${props.id}/relationship/${client.id}`).set({relationship: ''}, {merge: true})
    }
    const declinefriendrequest = () => {
        firestore.doc(`users/${client.id}/relationship/${props.id}`).set({relationship: ''}, {merge: true})
        firestore.doc(`users/${props.id}/relationship/${client.id}`).set({relationship: ''}, {merge: true})
    }
    const acceptfriendrequest = () => {
        firestore.doc(`users/${client.id}/relationship/${props.id}`).set({follow: true, relationship: 'friends', friendSince: Date.now()}, {merge: true})
        firestore.doc(`users/${props.id}/relationship/${client.id}`).set({follow: true, relationship: 'friends', friendSince: Date.now()}, {merge: true})
    }
    const removeFriend = () => {
        firestore.doc(`users/${client.id}/relationship/${props.id}`).set({follow: false, relationship: ''}, {merge: true})
        firestore.doc(`users/${props.id}/relationship/${client.id}`).set({follow: false, relationship: ''}, {merge: true})

    }
    switch (relationship) {
    case '': 
        return (
            <div onClick={sentfriendrequest} className='canclick color4' style={{fontSize: '18px', justifyContent: 'center', width: '100%', minWidth: '140px', display: 'flex', height: '36px', padding: '7px 12px 7px 12px', borderRadius: '10px'}}>
                <RiUserAddFill size='20' />
                <p >Add Friend</p>
            </div>
        )
    case 'friends': 
        return (
            <div className='color4' style={{fontSize: '18px', justifyContent: 'center', width: '100%', display: 'flex', height: '36px', padding: '7px 12px 7px 12px', borderRadius: '10px'}}>
                <BsFillPersonCheckFill size='18' style={{margin: 'auto 10px auto auto'}}/>
                <p>Friends</p>
                <BsXOctagon onClick={removeFriend} size='15' className='canclick' style={{margin: 'auto 0 auto auto'}} title='Remove this friend'/>
            </div>
        )
    case 'sent':
        return (
            <div onClick={cancelfriendrequest} className='canclick color4' style={{fontSize: '18px', justifyContent: 'center', width: '100%', display: 'flex', height: '36px', padding: '7px 12px 7px 12px', borderRadius: '10px', fontSize: '16px'}}>
                <img style={{position: 'relative', top: '-5px', left: '-5px', height: '30px', width: '30px'}} src='https://cdn2.iconfinder.com/data/icons/user-management/512/cancel-512.png'/>
                <p>Cancel Request</p>
            </div>
        )
    case 'receive':
        return (
            <div style={{fontSize: '18px', justifyContent: 'center', width: '100%', display: 'flex', height: '36px', borderRadius: '10px'}}>
                <div onClick={acceptfriendrequest} className='canclick color4' style={{display: 'flex', marginRight: '10px', height: '36px', justifyContent: 'center', padding: '7px', borderRadius: '10px'}}>
                    <p>Accept</p>
                </div>
                <div onClick={declinefriendrequest} className='canclick color4' style={{display: 'flex', marginRight: '10px', height: '36px', justifyContent: 'center', padding: '7px', borderRadius: '10px'}}>
                    <p>Decline</p>
                </div>
            </div>
        )
    case 'yourself':
        return 'aaaaaaaaaaa' 
    }
}

export function MessageButton ({id}) {
    const dispatch = useDispatch()
    const chatlist = useSelector(state => state.chatlist)
    const handleClick = () => {
        if (chatlist.open && chatlist.open.includes(id)) return
        dispatch(addOpen(id))
        if (chatlist.collapse && chatlist.collapse.includes(id)) dispatch(removeCollapse(id))
    }
    return (
        <div onClick={handleClick} className='canclick color4' style={{justifyContent: 'center', width: '100%', display: 'flex', height: '36px', padding: '7px 12px 7px 12px', borderRadius: '10px', margin: '0 4px'}}>
            <BiMessageDetail size='20' color='green' />
            <p>Message</p>
        </div>
    )
}
export function AdvanceOptions () {
    return (
        <div className='circle1 canclick color4' style={{margin: '0 4px'}}>
            <BsThreeDots size='30' style={{margin: '4px'}} />
        </div>
    )
}
