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
import ReactPlayer from 'react-player'
export default function HomeMid () {
    const client = useSelector(state => state.firebase.profile)
    const [numberOfPost, setNumberOfPost] = useState(14)
    const [posts, setPosts] = useState([])      // post la 1 array luu tru id cua bai viet cua nhung nguoi minh follow
    useEffect(() => {
        firestore.collection(`posts`).orderBy('createdAt', 'desc').get()
        .then(docs => {
            let array = []
            docs.forEach(doc => array = array.concat(doc.id))
            setPosts(array)
        })
    },[])
    
    // const [followIDs, setFollowIDs] = useState(['tcShMQXNwtfBqT7hzaW15kdu6M53'])      // array id cua nhung nguoi minh follow
    // useEffect(() => {
    //     let followArray = []
        
    // if (!followIDs.length) {            //neu followids rong
    //         firestore.collection(`users/${client.id}/relationship`).where('follow', '==', true).limit(1).get()
    //         .then(docs => {
    //             docs.forEach(doc => followArray = followArray.concat(doc.id))
    //             setFollowIDs(followArray)
    //         })
    //     }
    //     else {      //neu followids co it nhat 1 phan tu
    //         firestore.collection(`users/${client.id}/relationship`).where('follow', '==', true).orderBy('id').startAfter(followIDs[followIDs.length-1]).limit(1).get()
    //         .then(docs => {
    //             docs.forEach(doc => followArray = followArray.concat(doc.id))
    //             setFollowIDs(followArray)
    //         })
    //     }
    // }, [numberOfPost, client])


    // useEffect(() => {
    //     if (!followIDs.length) return
    //     if (!posts.length) {            // neu chua co bai viet nao duoc hien thi
    //         firestore.collection(`posts`).orderBy('createdAt', 'desc').where('createdBy', 'in', followIDs).limit(1).get()
    //         .then(docs => {
    //             let array = []
    //             docs.forEach(doc => array = array.concat(doc.id))
    //             setPosts(array)
    //         })
    //     }
    //     else {                  //neu da co bai viet
    //         firestore.collection(`posts`).orderBy('createdAt', 'desc').where('createdBy', 'in', followIDs).startAfter(posts[posts.length-1]).limit(1).get()
    //         .then(docs => {
    //             let array = []
    //             docs.forEach(doc => array = array.concat(doc.id))
    //             setPosts(prevPosts => prevPosts.concat(array))
    //         })
    //     }
    // }, [followIDs])
    
    return (
        <div className='mid' style={{minWidth: '500px', maxWidth: '680px'}}>
            <NewPost/>
            {posts && posts.map(id => <SinglePost key={id} id={id}/>)}
        </div>
    )
}

export function SinglePost ({id}) {
    const [data, setData] = useState('')
    const client = useSelector(state => state.firebase.profile)
    const [focus, setFocus] = useState(false)
    const [numberOfComment, setNumberOfComment] = useState(3)
    const [commentlist] = useCollectionData(firestore.collection(`posts/${id}/comment`).orderBy('createdAt').limitToLast(numberOfComment))
    const [comment, setComment] = useState('')
    const [isCloseComment, setCloseComment] = useState(false)
    const [createdUser, setCreatedUser] = useState('')
    const [reaction, setReaction] = useState('')
    useEffect(() => {
        firestore.doc(`posts/${id}`).get()
        .then(doc => setData(doc.data()))
    }, [reaction])
    useEffect(() => {
        if (data) {
            firestore.doc(`users/${data.createdBy}`).get()
            .then(doc => setCreatedUser(doc.data()))
            if (data.likeCount.includes(client.id)) setReaction('liked')
            else if (data.dislikeCount.includes(client.id)) setReaction('disliked')
        }
    }, [data])
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
                    text: 'comment on your post'
                })
                
                setComment('')
            }
        }
        document.addEventListener('keydown', func)
        return () => document.removeEventListener('keydown', func)
    }, [focus, comment])
    if (data)
    return(
        <div className='color3 shadow' style={{borderRadius: '10px', width: '100%', padding: '12px 16px 0 16px', margin: 'auto auto 12px auto', maxWidth: '680px', minWidth: '480px'}}>
            <div style={{display: 'flex'}}>
                <img className='circle1 shadow' src={createdUser && createdUser.avatarURL}/>
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
                {data.fileURL && <ReactPlayer width='100%' controls url={data.fileURL}/>}
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
                        <img className='circle0 shadow' src={client.avatarURL}/>
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
        <div style={{display: 'flex', marginTop: '10px', maxWidth: '100%'}}>
            <img className='circle0 shadow' src={createdUser && createdUser.avatarURL}/>
            <div style={{maxWidth: '90%'}}>
                <div className='color4 shadow' style={{marginLeft: '10px', maxWidth: '100%', padding: '8px 12px 8px 12px', borderRadius: '15px'}}>
                    <div  style={{wordWrap: 'break-word', }} >
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
        // if (target.file && target.files[0].size >= 2097152 || !['image/gif', 'image/jpeg', 'image/png'].includes(target.files[0].type)) {
        //     alert('File is too big or invalid file type')
        //     target.value = ''
        // }
        // else 
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
                .then(snapshot =>
                    snapshot.ref.getDownloadURL().then(url => newDoc.update({fileURL: url}))
                )      
            }        
            setText('')
            setFile('')
        }
        else alert('Type something first')
    }
    return (
        <div className='color3 shadow' style={{width: '100%', minWidth: '480px', maxWidth: '680px', padding: '12px 16px 10px 16px', borderRadius: '10px', marginBottom: '15px'}}>
            <div style={{display: 'flex', marginBottom: '10px'}}>
                <img src={client.avatarURL} className='circle0 shadow'/>
                <input value={text} onChange={handleTextInput} type='text' placeholder='What is on your mind?' style={{borderRadius: '20px', width: '100%', margin: '0 5px' }}/>
                <div onClick={handleSubmit} className='canclick'  style={{width: '80px', borderRadius: '10px', display: 'flex', backgroundColor: '#c4dfe6'}}>
                    <div style={{margin: 'auto'}}>
                        Post
                    </div>
                </div>
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
                        <input onChange={handleFileInput} id='addfilebutton' type='file' accept='.jpeg, .png' style={{display: 'none'}}/>
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