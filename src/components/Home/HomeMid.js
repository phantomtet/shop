import React, {useState, useEffect} from 'react'
import { useCollectionDataOnce, useDocumentData, useCollectionData, useDocumentDataOnce, useDocument, useCollectionOnce } from 'react-firebase-hooks/firestore'
import firebase, { auth, firestore, storage } from '../../firebase'
import Tag from '../Tag'
import { useSelector } from 'react-redux'
import {RiLiveLine} from 'react-icons/ri'
import {v4} from 'uuid'
import {FcGallery} from 'react-icons/fc'
import { BiDislike, BiLike, BiX } from 'react-icons/bi'
import { addNotify, timeFormat } from '../function'
import ReactPlayer from 'react-player'
import { BsFillEjectFill } from 'react-icons/bs'
import { SinglePost } from './SinglePost'
export default function HomeMid () {
    const client = useSelector(state => state.firebase.profile)
    const [posts, setPosts] = useState([])
    const [firstDoc, setFirstDoc] = useState('')
    const [lastDoc, setLastDoc] = useState('')
    useEffect(() => {       // fetch first data
        firestore.collection(`posts`).orderBy('createdAt', 'desc').limit(7).get()
        .then(docs => {
            setFirstDoc(docs.docs[0])
            let array = []
            let lastDoc = ''
            docs.forEach(doc => {
                array.push(doc.data())
                lastDoc = doc
            })
            setPosts(array)
            setLastDoc(lastDoc)
        })
    }, [])

    const addNewPosts = () => {
        let numberOfPost = 5
        let array = []
        //fetch newest post
        firestore.collection(`posts`).orderBy('createdAt', 'asc').startAfter(firstDoc).limit(numberOfPost).get()
        .then(docs => {
            if (!docs.docs.length) return
            let firstDoc = ''
            docs.forEach(doc => {
                array.push(doc.data())
                firstDoc = doc
                numberOfPost--
            })
            setFirstDoc(firstDoc)
        })
        //then fetch older post
        .then(() => {
            firestore.collection(`posts`).orderBy('createdAt', 'desc').startAfter(lastDoc).limit(numberOfPost).get()
            .then(docs => {
                if (!docs.docs.length) return
                let lastDoc = ''
                docs.forEach(doc => {
                    array.push(doc.data())
                    lastDoc = doc
                })
                setLastDoc(lastDoc)
            })
            .then(() => setPosts(prevState => prevState.concat(array)))
        })
    }


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
        <div className='mid' style={{minWidth: '500px', maxWidth: '680px', width: '50vw'}}>
            <NewPost/>
            {posts && posts.map(data => <SinglePost key={data.id} data={data}/>)}
            <button onClick={addNewPosts}>Fetch new post</button>
        </div>
    )
}

export function MediaPlayer ({file}) {
    const [type, setType] = useState('')
    const [url, setURL] = useState('')
    useEffect(() => {
        storage.ref(file).getMetadata()
        .then(data => {
            if (data.contentType.includes('image/')) {
                setType('image')
                return
            }
            if (data.contentType.includes('video/')) {
                setType('video')
                return
            }
        })
        storage.ref(file).getDownloadURL()
        .then(url => setURL(url))
    },[])
    switch (type) {
        case 'image':
            return (
                <div style={{width: '100%'}}>
                    <img src={url} style={{width: '100%', height: '100%'}}/>
                </div>
            )
        case 'video':
            return (
                <ReactPlayer controls width='100%' height='100%' url={url}/>
            )
        default:
            return ''
    }
}
export function SingleComment ({data}) {
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
    const [file, setFile] = useState([])
    const client = useSelector(state => state.firebase.profile)
    const handleFileInput = ({target}) => {
        if (file.length >= 4) {           
            alert('We support upload 4 files per time only')
            return
        }
        else if (target.file && target.files[0].size >= 209715200 || target.file &&  !['image/jpeg', 'image/png', 'image/jpg', 'video/mp4', ].includes(target.files[0].type)) {
            alert('File is too big or invalid file type' + target.files[0].type)
            target.value = ''
        }
        else setFile(prevState => [...prevState, target.files[0]])
    }
    const addfile = () => {
        document.getElementById('addfilebutton').click()
    }
    const handleSubmit = () => {
        if (text || file.length) {
            const newDoc = firestore.collection('posts').doc()
            newDoc.set({
                text: text,
                createdAt: Date.now(),
                createdBy: client.id,
                id: newDoc.id,
                file: [],
                likeCount: [],
                dislikeCount: [],
                numberOfComment: 0,
                relateTo: [client.id],
                path: `posts/${newDoc.id}`
            })
            if (file.length !== 0) {
                file.forEach(filee => {
                    const id = v4()
                    if (filee.type.includes('image/')) {
                        storage.ref(`${client.id}/image/${id}`).put(filee)
                        .then(snapshot => {
                            snapshot.ref.updateMetadata({customMetadata: {post: newDoc.path}})
                            newDoc.update({file: firebase.firestore.FieldValue.arrayUnion(snapshot.ref.fullPath)})
                        })
                        return
                    }
                    if (filee.type.includes('video/')) {
                        storage.ref(`${client.id}/video/${id}`).put(filee)
                        .then(snapshot => {
                            snapshot.ref.updateMetadata({customMetadata: {post: newDoc.path}})
                            newDoc.update({file: firebase.firestore.FieldValue.arrayUnion(snapshot.ref.fullPath)})
                        })
                        return
                    }
                })     
            }        
            setText('')
            setFile([])
        }
        else alert('Type something first')
    }
    return (
        <div className='color3 shadow' style={{width: '100%', minWidth: '480px', maxWidth: '680px', padding: '12px 16px 10px 16px', borderRadius: '10px', marginBottom: '15px'}}>
            <div style={{display: 'flex', marginBottom: '10px'}}>
                <img src={client.avatarURL} className='circle0 shadow'/>
                <input value={text} onChange={({target}) => setText(target.value)} type='text' placeholder='What is on your mind?' style={{borderRadius: '20px', width: '100%', margin: '0 5px' }}/>
                <div onClick={handleSubmit} className='canclick'  style={{width: '80px', borderRadius: '10px', display: 'flex', backgroundColor: '#c4dfe6'}}>
                    <div style={{margin: 'auto'}}>
                        Post
                    </div>
                </div>
            </div>
            <div>
            {
                // action xoa item trong file list 
                file.length !== 0 && file.map((filee, indexx) => <SingleFile key={indexx} file={filee} action={() => setFile(prevState => prevState.filter((a, index) => index !=indexx))}/>)
            }
            </div>
            <hr/>
            <div style={{display: 'flex', marginTop: '10px'}}>
                <div className=' canclick' style={{width: '100%',  display: 'flex', padding: '8px', justifyContent: 'center'}}>
                    <RiLiveLine size='24' color='red'/>
                    <div style={{padding: '3px 0 0 5px'}}>Live Video</div>
                </div>
                    <div onClick={addfile} className=' canclick' style={{width: '100%',  display: 'flex', padding: '8px', justifyContent: 'center'}}>
                        <input onChange={handleFileInput} id='addfilebutton' type='file' accept='image/*, video/*' style={{display: 'none'}}/>
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
function SingleFile ({file, action}) {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div>
                {file.name}
            </div>
            <BiX className='canclick' onClick={action}/>
        </div>
    )
}