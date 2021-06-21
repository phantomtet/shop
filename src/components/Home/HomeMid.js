import React, {useState, useEffect} from 'react'
import { useCollectionDataOnce, useDocumentData, useCollectionData, useDocumentDataOnce, useDocument } from 'react-firebase-hooks/firestore'
import firebase, { auth, firestore, storage } from '../../firebase'
import Tag from '../Tag'
import { useSelector } from 'react-redux'
import {RiLiveLine} from 'react-icons/ri'
import {v4} from 'uuid'
import {FcGallery} from 'react-icons/fc'
import { BiDislike, BiLike } from 'react-icons/bi'
import { addNotify, timeFormat } from '../function'
export default function HomeMid () {
    const client = useSelector(state => state.firebase.profile)
    const [numberOfPost, setNumberOfPost] = useState(14)
    const [posts] = useCollectionData(firestore.collection('posts').orderBy('createdAt', 'desc').limit(numberOfPost))
    
    const handleScroll = () => {
        
    }
    
    return (
        <div className='mid' style={{minWidth: '500px', maxWidth: '680px'}}>
            <NewPost/>
            {posts && posts.map(data => <SinglePost key={data.id} data={data}/>)}
        </div>
    )
}

export function SinglePost ({data}) {
    const client = useSelector(state => state.firebase.profile)
    const [focus, setFocus] = useState(false)
    const [numberOfComment, setNumberOfComment] = useState(3)
    const [commentlist] = useCollectionData(firestore.collection(`posts/${data.id}/comment`).orderBy('createdAt').limitToLast(numberOfComment))
    const [comment, setComment] = useState('')
    const [isCloseComment, setCloseComment] = useState(false)
    const [createdUser] = useDocumentDataOnce(firestore.collection('users').doc(data.createdBy))
    const [reaction, setReaction] = useState(() => {
        if (data.likeCount.includes(client.id)) return 'liked'
        else if (data.dislikeCount.includes(client.id)) return 'disliked'
        else return ''
    })
    
    const handeLikeClick = () => {
        switch (reaction) {
            case 'liked': 
                firestore.doc(data.path).update({likeCount: firebase.firestore.FieldValue.arrayRemove(client.id)}).then(() => setReaction(''))
                return
            case 'disliked':
                firestore.doc(data.path).update({dislikeCount: firebase.firestore.FieldValue.arrayRemove(client.id)})
                .then(() => firestore.doc(data.path).update({likeCount: firebase.firestore.FieldValue.arrayUnion(client.id)})
                .then(() => setReaction('liked')))
                return
            case '':
                firestore.doc(data.path).update({likeCount: firebase.firestore.FieldValue.arrayUnion(client.id)}).then(() => setReaction('liked'))
                return
        }
    }
    const handeDislikeClick = () => {
        switch (reaction) {
        case 'disliked': 
        firestore.doc(data.path).update({dislikeCount: firebase.firestore.FieldValue.arrayRemove(client.id)}).then(() => setReaction(''))
        return
        case 'liked': 
        firestore.doc(data.path).update({likeCount: firebase.firestore.FieldValue.arrayRemove(client.id)}).then(() => setReaction(''))
        .then(() => firestore.doc(data.path).update({dislikeCount: firebase.firestore.FieldValue.arrayUnion(client.id)})
        .then(() => setReaction('disliked')))
        return
        case '':
            firestore.doc(data.path).update({dislikeCount: firebase.firestore.FieldValue.arrayUnion(client.id)}).then(() => setReaction('disliked'))
            return
        }
    }
    const handleFocus = (condition) => setFocus(condition)
    const handleCommentChange = ({target}) => {
        setComment(target.value)
    }
    useEffect(() => {
        if (!focus || !comment) return
        const func = (e) => {
            if (e.key === 'Enter') {
                const newComment = firestore.collection(`${data.path}/comment`).doc()
                newComment.set({
                    text: comment,
                    createdAt: Date.now(),
                    createdBy: client.id,
                    id: newComment.id,
                })
                firestore.doc(data.path).update({numberOfComment: firebase.firestore.FieldValue.increment(1) })
                addNotify(client.id, data.createdBy, {
                    createdAt: Date.now(),
                    path: `posts/${data.id}`,
                    createdBy: client.id,
                    seen: false,
                    type: 'comment'
                })
                
                setComment('')
            }
        }
        document.addEventListener('keydown', func)
        return () => document.removeEventListener('keydown', func)
    }, [focus, comment])
    if (data)
    return(
        <div className='color3' style={{borderRadius: '10px', width: '100%', padding: '12px 16px 0 16px', marginBottom: '12px', maxWidth: '680px', minWidth: '500px'}}>
            <div style={{display: 'flex'}}>
                <img className='circle1' src={createdUser && createdUser.avatarURL}/>
                <div style={{width: '100%', marginLeft: '10px',}}>
                    <div style={{fontSize: '20px'}}>
                        {createdUser && <Tag info={createdUser}/>}
                    </div>
                    <div style={{fontSize: '13px'}}>
                        {timeFormat(data.createdAt)}
                    </div>
                </div>
            </div>
            <div style={{margin: '5px 0 5px 0'}}>
                {data.text}
                {data.fileURL && <img src={data.fileURL} style={{width: '100%', padding: '0 -16px 0 -16px'}}/>}
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0 5px 0'}}>
                <div style={{display: 'flex',}}>
                    { data.likeCount.length !== 0 && 
                    <>
                        {data.likeCount.length} <BiLike color={reaction === 'liked' ? 'green' : ''} style={{marginRight: '10px'}}/>
                    </>}
                    { data.dislikeCount.length !== 0 &&
                        <>
                            {data.dislikeCount.length} <BiDislike color={reaction === 'disliked' ? 'red' : ''}/>
                        </>
                    }
                </div>
                <div className='canclick2' onClick={() => setCloseComment(prev => !prev)}>
                    {data.numberOfComment !== 0 && data.numberOfComment + ' comment'}
                </div>
            </div>
            <div style={{display: 'flex', borderTop: '1px solid #c4dfe6', borderBottom: '1px solid #c4dfe6', padding: '3px 0 3px 0'}}>
                <div style={{display: 'flex', width: '100%', height: '40px', justifyContent: 'center'}}>
                    <div onClick={handeLikeClick} className='canclick ' style={{width: '100%', justifyContent: 'center', display: 'flex', padding: '12px 0 12px 0', color: reaction === 'liked' ? 'green':''}}>
                        Like
                    </div>
                    
                    <div onClick={handeDislikeClick} className='canclick 'style={{width: '100%', justifyContent: 'center', display: 'flex', padding: '12px 0 12px 0', color: reaction === 'disliked' ? 'red':''}}>
                        Dislike
                    </div>
                </div>
                <div className='canclick' onClick={() => {setCloseComment(false); setFocus(true)}} style={{display: 'flex', width: '100%', height: '40px', padding: '12px 0 12px 0', justifyContent: 'center'}}>
                    Comment
                </div>
            </div>
            {!isCloseComment && 
            <>
                <div className='canclick2' onClick={() => setNumberOfComment(numberOfComment + 10)} style={{margin: '5px 0'}}>
                    {commentlist && data.numberOfComment > commentlist.length ? 'View previous comments' : ''}
                </div>
                <div>
                    {commentlist && commentlist.map(data => <SingleComment key={data.id} data={data}/>)}
                </div>
                <div style={{marginTop: '10px', paddingBottom: '10px'}}>
                    {/* comment input */}
                    <div style={{display: 'flex'}}>           
                        <img className='circle0' src={client.avatarURL}/>
                        <input value={comment} onChange={handleCommentChange} onBlur={() => handleFocus(false)} onFocus={() => handleFocus(true)} placeholder='Write a public comment...' style={{borderRadius: '20px', width: '100%', marginLeft: '5px'}} type='text'/>
                    </div>
                </div>
            </>}
        </div>
    )
    else return 'a'
}
function SingleComment ({data}) {
    const [createdUser] = useDocumentDataOnce(firestore.collection('users').doc(data.createdBy))
    return (
        <div style={{display: 'flex', marginTop: '10px'}}>
            <img className='circle0' src={createdUser && createdUser.avatarURL}/>
            <div>
                <div className='color4' style={{marginLeft: '10px', width: '100%', padding: '8px 12px 8px 12px', borderRadius: '15px'}}>
                    <div style={{wordWrap: 'break-word', maxWidth: '380px'}} >
                        {createdUser && <Tag info={createdUser}/>}
                        {data.text}
                    </div>
                </div>
                <div  style={{marginLeft: '18px'}}>
                    {timeFormat(data.createdAt)}
                </div>
            </div>
        </div>
    )
}
export function NewPost() {
    const [text, setText] = useState('')
    const [file, setFile] = useState('')
    const client = useSelector(state => state.firebase.profile)
    const handleTextInput = ({target}) => {
        setText(target.value)
    }
    const handleFileInput = ({target}) => {
        setFile(target.files[0])
    }
    const addfile = () => {
        document.getElementById('addfilebutton').click()
    }
    const handleSubmit = () => {
        if (text || file) {
            const newDoc = firestore.collection('posts').doc()
            newDoc.set({
                text: text,
                createdAt: Date.now(),
                createdBy: client.id,
                likeCount: [],
                dislikeCount: [],
                id: newDoc.id,
                fileURL: '',
                numberOfComment: 0,
                relateTo: [client.id],
                path: `posts/${newDoc.id}`
            })
            if (file) {
                const id = v4()
                storage.ref(`photo/${client.id}/${id}`).put(file)
                .then(() =>
                    storage.ref(`photo/${client.id}/${id}`).getDownloadURL().then(url => newDoc.update({fileURL: url}))
                )      
            }        
            setText('')
            setFile('')
        }
        else alert('')
    }
    return (
        <div className='color3' style={{width: '100%', padding: '12px 16px 10px 16px', borderRadius: '10px', margin: '15px 0'}}>
            <div style={{display: 'flex', marginBottom: '10px'}}>
                <img src={client.avatarURL} className='circle0'/>
                <input value={text} onChange={handleTextInput} type='text' placeholder='What is on your mind?' style={{borderRadius: '20px', width: '100%' }}/>
                <input type='submit' onClick={handleSubmit}/>
            </div>
            <div>
                {file && file.name}
            </div>
            <hr/>
            <div style={{display: 'flex', marginTop: '10px'}}>
                <div className=' canclick' style={{width: '100%',  display: 'flex', padding: '8px', justifyContent: 'center'}}>
                    <RiLiveLine size='24' color='red'/>
                    <div style={{padding: '3px 0 0 5px'}}>Live Video</div>
                </div>
                    <div onClick={addfile} className=' canclick' style={{width: '100%',  display: 'flex', padding: '8px', justifyContent: 'center'}}>
                        <input onChange={handleFileInput} id='addfilebutton' type='file' style={{display: 'none'}}/>
                        <FcGallery size='24'/>
                        <div style={{padding: '3px 0 0 5px'}}>Photo/Video</div>
                    </div>

                <div className=' canclick' style={{width: '100%',  display: 'flex', padding: '8px', justifyContent: 'center'}}>
                    <img style={{width: '24px', height: '24px'}} src='https://iconarchive.com/download/i108219/google/noto-emoji-smileys/10006-grinning-face-with-smiling-eyes.ico'/>
                    <div style={{padding: '3px 0 0 5px'}}>Feeling/Activity</div>
                </div>
                
            </div>
        </div>
    )
}