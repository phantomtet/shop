import { useDocumentData } from "react-firebase-hooks/firestore";
import { useParams } from "react-router";
import { firestore } from "../firebase";
import { SinglePost } from "./Home/HomeMid";

export default function Post () {
    const { id } = useParams()
    if (id)
    return (
        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '15px'}}>
            <SinglePost id = {id}/>
        </div>
    )
    else return (
        <div>
            <div style={{width: '500px', wordWrap: 'break-word', display: 'flex', justifyContent: 'center', color: 'whitesmoke'}}>
                <img style={{width: '112px'}} src='https://www.facebook.com/images/comet/empty_states_icons/permissions/permissions_dark_mode.svg'/><br/>
                This Content Isn't Available Right Now <br/>
                When this happens, it's usually because the owner only shared it with a small group of people, changed who can see it or it's been deleted.
            </div>
        </div>
    )
}