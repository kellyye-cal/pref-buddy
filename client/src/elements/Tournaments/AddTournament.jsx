import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import AuthContext from "../../context/AuthProvider"


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../Spinner';
import FloatingModal from '../FloatingModal';

function AddTournament({onAdd}) {
    const {auth, setAuth} = useContext(AuthContext);

    const [url, setURL] = useState('');
    const [validURL, setValidURL] = useState('')
    const [errMsg, setErrMsg] = useState('')

    const [isOpen, setIsOpen] = useState(false)
    const [submitted, setSubmit] = useState(false)

    useEffect(() => {
        setErrMsg('');
    }, [url])

    useEffect(() => {
        const regex = /^https:\/\/www\.tabroom\.com\/index\/tourn\/judges\.mhtml\?category_id=\d+&tourn_id=\d+$/;
        setValidURL(regex.test(url))
    })

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = document.getElementById('addForm');

        setSubmit(true)

        try {
            const res = await axios.post('http://localhost:4000/api/tournaments/scrape',
                {
                    u_id: auth.userId,
                    url: url
                },
                {
                    headers: {Authorization: `Bearer ${auth?.accessToken}`},
                    withCredentials: true
                }
            );

            closeModal();
            setSubmit(false);

            if (onAdd) {
                onAdd();
            }
            
        } catch(err) {
            console.error("Error scraping tournament data", err)
        }

        setURL('')
        form.reset();


    }

    return (
        <div>
            <button
                className="pillButton"
                onClick={openModal}>
                <FontAwesomeIcon icon={faPlus} size="xs" style={{paddingRight: "8px"}}/>
                Link Tournament
            </button>

            <FloatingModal isOpen={isOpen} closeFunc={closeModal}>
                <div className="h-between">
                    <h3> Link Tournament </h3>
                    <button onClick={closeModal}>
                    <FontAwesomeIcon icon={faTimes} size="sm" style={{paddingRight: "8px"}}/>
                    </button>
                </div>

                {(!submitted) ?
                    <form onSubmit={handleSubmit} id="addForm" >
                        <p className={errMsg ? "errmsg" : "offscreen"}> {errMsg} </p>

                        <label htmlFor="url" style={{marginTop: 8, marginBottom: 4}}> Enter the Tabroom link to the list of judges for tournament you want to link</label>
                        <input
                            type="url"
                            id="tab_url"
                            onChange={(e) => setURL(e.target.value)}
                            value={url}
                            required
                        />

                        <p id="urlnote" className={url && !validURL ? "instructions": "offscreen"}> *Enter a valid Tabroom Link to the judges page of a tournament</p>

                        
                        <button className="cta" disabled={!validURL ? true : false}>
                            Link Tournament
                        </button>
                    </form>
                :
                <div>
                    <p> Fetching tournament data...</p>
                    <Spinner />
                </div>
                }

            </FloatingModal>
            
        </div>
    )
}

export default AddTournament;