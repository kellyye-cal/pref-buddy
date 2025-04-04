import React, { useEffect, useState, useContext } from 'react';
import axios from '../../api/axios';

import AuthContext from '../../context/AuthProvider';
import { sanitizeJudgeNotes } from '../Utils';


import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBold, faItalic, faList, faPen } from "@fortawesome/free-solid-svg-icons";

function JudgeNotes({judgeId, editing, setEditing}) {

    const {auth, setAuth} = useContext(AuthContext);

    const [note, setNote] = useState('');
    const [newNote, setNewNote] = useState('');

    useEffect(()=>{
        axios.get('/api/judges/get_notes', {params:{u_id: auth.userId, j_id: judgeId}, headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then((res) => {
            setNote(res.data.notes)
            setNewNote(res.data.notes)
        })
        .catch((err)=>console.error(err))
    }, [judgeId]);

    const handleSave = () => {
        axios.post(`/api/judges/save_note`, {u_id: auth.userId, j_id: judgeId, note: newNote}, {headers: {
            Authorization: `Bearer ${auth?.accessToken}`,
        }}).then((res) => {
            setEditing(false)
            setNote(newNote)

        })
        .catch((err)=>console.err(err))
    }

    const cancel = () => {
        setNewNote(note)
        setEditing(false)
    }

    const insertText = (prefix, suffix = "") => {
        const textarea = document.getElementById("note");
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = newNote;

        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        const newText = `${before}${prefix}${selected}${suffix}${after}`
        setNewNote(newText)

        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = start + prefix.length;
            textarea.selectionEnd = end + prefix.length;
        }, 10);
    }

    return (
        <div style={{height: "calc(100% - 78px)"}}>
            {editing ?
                <div style={{height: "100%"}}>
                    <div className="judge-notes editing">
                        <div>
                            <button onClick={() => insertText("**", "**")}> <FontAwesomeIcon icon={faBold} /> </button>
                            <button onClick={() => insertText("_", "_")}> <FontAwesomeIcon icon={faItalic} /> </button>
                            <button onClick={() => insertText("\n- ")}> <FontAwesomeIcon icon={faList} /> </button>
                        </div>
                        <textarea
                            id="note"
                            value = {newNote}
                            onChange={(e) => setNewNote(sanitizeJudgeNotes(e.target.value))}
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
    )
};

export default JudgeNotes;