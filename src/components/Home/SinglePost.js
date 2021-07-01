import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import Tag from "../Tag"
import { BiLike, BiDislike } from "react-icons/bi"
import firebase, { firestore } from "../../firebase"
import { useCollectionData, useDocumentData, useDocumentDataOnce } from "react-firebase-hooks/firestore"
import { addNotify, timeFormat } from "../function"
import { MediaPlayer, SingleComment } from "./HomeMid"
export function SinglePost ({data}) {
    const client = useSelector(state => state.firebase.profile)
    const [focus, setFocus] = useState(false)
    const [numberOfComment, setNumberOfComment] = useState(3)
    const [commentlist] = useCollectionData(firestore.collection(`posts/${data.id}/comment`).orderBy('createdAt').limitToLast(numberOfComment))
    const [comment, setComment] = useState('')
    const [isCloseComment, setCloseComment] = useState(false)
    const [createdUser] = useDocumentDataOnce(firestore.doc(`users/${data.createdBy}`))
    const [reaction] = useDocumentData(firestore.doc(`posts/${data.id}/reaction/${client.id}`))
    const [dynamicData, setDynamicData] = useState('')
    // dynamic data, update khi dependencies update
    useEffect(() => {
        firestore.doc(`posts/${data.id}`).get()
        .then(snapshot => setDynamicData(snapshot.data()))
    }, [reaction])
    const handeLikeClick = () => {
        if (!reaction) {
            firestore.collection(`posts/${data.id}/reaction`).doc(client.id).set({react: 'liked'}, {merge: true})
            firestore.doc(`posts/${data.id}`).set({likeCount: firebase.firestore.FieldValue.increment(1)}, {merge: true})
            return
        }
        switch (reaction.react) {
            case 'liked': 
                firestore.doc(`posts/${data.id}`).set({likeCount: firebase.firestore.FieldValue.increment(-1)}, {merge: true})
                firestore.collection(`posts/${data.id}/reaction`).doc(client.id).set({react: ''}, {merge: true})
                return
            case 'disliked':
                firestore.doc(`posts/${data.id}`).set({likeCount: firebase.firestore.FieldValue.increment(1)}, {merge: true})
                firestore.doc(`posts/${data.id}`).set({dislikeCount: firebase.firestore.FieldValue.increment(-1)}, {merge: true})
                firestore.collection(`posts/${data.id}/reaction`).doc(client.id).set({react: 'liked'}, {merge: true})
                return
            case '':
            firestore.doc(`posts/${data.id}`).set({likeCount: firebase.firestore.FieldValue.increment(1)}, {merge: true})
            firestore.collection(`posts/${data.id}/reaction`).doc(client.id).set({react: 'liked'}, {merge: true})
                return
        }
    }
    const handeDislikeClick = () => {
        if (!reaction) {
            firestore.collection(`posts/${data.id}/reaction`).doc(client.id).set({react: 'disliked'}, {merge: true})
            firestore.doc(`posts/${data.id}`).set({dislikeCount: firebase.firestore.FieldValue.increment(1)}, {merge: true})
            return
        }
        switch (reaction.react) {
            case 'liked':
                firestore.doc(`posts/${data.id}`).set({dislikeCount: firebase.firestore.FieldValue.increment(1)}, {merge: true})
                firestore.doc(`posts/${data.id}`).set({likeCount: firebase.firestore.FieldValue.increment(-1)}, {merge: true})
                firestore.collection(`posts/${data.id}/reaction`).doc(client.id).set({react: 'disliked'}, {merge: true})
                return
            case 'disliked':
                firestore.doc(`posts/${data.id}`).set({dislikeCount: firebase.firestore.FieldValue.increment(-1)}, {merge: true})
                firestore.collection(`posts/${data.id}/reaction`).doc(client.id).set({react: ''}, {merge: true})
                return
            case '':
                firestore.doc(`posts/${data.id}`).set({dislikeCount: firebase.firestore.FieldValue.increment(1)}, {merge: true})
                firestore.collection(`posts/${data.id}/reaction`).doc(client.id).set({react: 'disliked'}, {merge: true})
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
                <div className='test' style={{maxHeight: '', display: 'grid', gridTemplateColumns: '100%', gridTemplateRows: ''}}>
                    {data.file && data.file.map((filee, index) => <MediaPlayer key={index} file={filee}/>)}

                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0 5px 0'}}>
                <div style={{display: 'flex',}}>
                    { dynamicData.likeCount && 
                    <>
                        {dynamicData.likeCount} <BiLike color={reaction && reaction.react === 'liked' ? 'green' : ''} style={{marginRight: '10px'}}/>
                    </>}
                    { data.dislikeCount !== 0 &&
                        <>
                            {data.dislikeCount} <BiDislike color={reaction === 'disliked' ? 'red' : ''}/>
                        </>
                    }
                </div>
                <div className='canclick2' onClick={() => setCloseComment(prev => !prev)}>
                    {data.numberOfComment !== 0 && data.numberOfComment + ' comment'}
                </div>
            </div>
            <div style={{display: 'flex', borderTop: '1px solid #c4dfe6', borderBottom: '1px solid #c4dfe6', padding: '3px 0 3px 0'}}>
                <div style={{display: 'flex', width: '100%', height: '40px', justifyContent: 'center'}}>
                    <div onClick={handeLikeClick} className='canclick ' style={{width: '100%', justifyContent: 'center', display: 'flex', padding: '12px 0 12px 0', color: reaction && reaction.react === 'liked' ? 'green':''}}>
                        Like
                    </div>
                    
                    {/* <div onClick={handeDislikeClick} className='canclick 'style={{width: '100%', justifyContent: 'center', display: 'flex', padding: '12px 0 12px 0', color: reaction === 'disliked' ? 'red':''}}>
                        Dislike
                    </div> */}
                </div>
                <div className='canclick' onClick={() => {setCloseComment(false); setFocus(true)}} style={{display: 'flex', width: '100%', height: '40px', padding: '12px 0 12px 0', justifyContent: 'center'}}>
                    Comment
                </div>
            </div>
            {!isCloseComment && 
            <div>
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
            </div>}
        </div>
    )
    else return ''
}


export function SinglePost2 ({id}) {
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
                <div className='test' style={{maxHeight: '', display: 'grid', gridTemplateColumns: '100%', gridTemplateRows: ''}}>
                    {data.file && data.file.map((filee, index) => <MediaPlayer key={index} file={filee}/>)}

                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0 5px 0'}}>
                <div style={{display: 'flex',}}>
                    { data.likeCount && 
                    <>
                        {data.likeCount} <BiLike color={reaction && reaction.react === 'liked' ? 'green' : ''} style={{marginRight: '10px'}}/>
                    </>
                    }
                    { data.dislikeCount !== 0 &&
                        <>
                            {data.dislikeCount} <BiDislike color={reaction === 'disliked' ? 'red' : ''}/>
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
            <div>
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
            </div>}
        </div>
    )
    else return ''
}