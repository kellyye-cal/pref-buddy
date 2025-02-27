import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios'

import AuthContext from '../../context/AuthProvider';


import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faItalic, faList, faPen } from "@fortawesome/free-solid-svg-icons";

function JudgeNotes({judgeId}) {

    const {auth, setAuth} = useContext(AuthContext);

    const [note, setNote] = useState('');
    const [newNote, setNewNote] = useState('');
    const [editing, setEditing] = useState(false);

    useEffect(()=>{
        axios.get('http://localhost:4000/api/judges/get_notes', {params:{u_id: auth.userId, j_id: judgeId}, headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then((res) => {
            setNote(res.data[0].notes)
            setNewNote(res.data[0].notes)
        })
        .catch((err)=>console.log(err))
    }, []);

    const handleSave = () => {
        axios.post(`http://localhost:4000/api/judges/save_note`, {u_id: auth.userId, j_id: judgeId, note: newNote}, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then((res) => {
            setEditing(false)
            setNote(newNote)
        })
        .catch((err)=>console.log(err))
    }

    const cancel = () => {
        setNewNote(note)
        setEditing(false)
    }

    return (
        <div className="container container-spacing">
            <div className="h-between" style={{alignItems: "center"}}>
                <h3> Notes </h3>
                <button className={`edit-button ${editing ? "hidden" : ""}`}
                        style={{marginBottom: 8}}
                        onClick={() => {setEditing(true)}}>
                    <FontAwesomeIcon icon={faPen} size="xs"/> Edit
                </button>
            </div>
            <div style={{height: "calc(100% - 78px)"}}>
                {editing ?
                    <div style={{height: "100%"}}>
                        <div className="judge-notes editing">
                            <div>
                                <button> <FontAwesomeIcon icon={faBold} /> </button>
                                <button> <FontAwesomeIcon icon={faItalic} /> </button>
                                <button> <FontAwesomeIcon icon={faList} /> </button>
                            </div>
                            <textarea
                                value = {newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                placeholder="Start typing..."
                            />
                        </div>

                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <button className="edit-button" onClick={cancel}> Cancel </button>
                            <button onClick={handleSave} className="pillButton save-note"> Save </button>
                        </div>

                    </div>
                    :
                    <div className="judge-notes">
                        {note ? <ReactMarkdown children={note}/> : <p> ... </p>}
                    </div>
                }
            </div>

        </div>
    )
};

export default JudgeNotes;