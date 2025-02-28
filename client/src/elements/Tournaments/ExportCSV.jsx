import React, {useContext, useEffect, useState} from 'react';
import AuthContext from '../../context/AuthProvider';

import axios from 'axios';
import FloatingModal from '../FloatingModal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function ExportCSV({tournId, defaultFileName}) {
    const {auth, setAuth} = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [fileName, setFilename] = useState(defaultFileName || "export")

    useEffect(() => {
        if (defaultFileName) {
            setFilename(defaultFileName);
        }
    }, [defaultFileName]);

    async function downloadCSV(filePath) {
        if (!fileName) return;

        const url = `http://localhost:4000/api/tournaments/${tournId}/judges/export_csv`
        
        try {
            const response = await axios.get(url, {params: {u_id: auth?.userId, filename: fileName}, headers: {Authorization: `Bearer ${auth?.accessToken}`}, responseType: "blob"})

            const blob = new Blob([response.data], {type: "text/csv"});
            const link = document.createElement("a");
            link.href=window.URL.createObjectURL(blob);
            link.setAttribute("download", fileName)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } catch (error) {
            console.error("Download error:", error);
        }
            
    }
    
    function exportPrefs() {
        setEditing(false)
        downloadCSV(fileName + ".csv")
    }

    const openFunc = () => {setEditing(true)}

    const closeFunc = () => {setEditing(false)}

    return (
        <div>
            <button className="pill-default" onClick={openFunc}> Export Prefs </button>

            <FloatingModal isOpen={editing} closeFunc={closeFunc}>
                <div className="h-between" style={{alignItems: "center"}}>
                    <h3 style={{marginBottom: 0}}> Export Prefs</h3>
                    <button onClick={closeFunc} style={{padding: 0}}> <FontAwesomeIcon icon={faTimes}/> </button>
                </div>

                <form className="form-vert" onSubmit={exportPrefs}>
                    <label htmlFor="filename" style={{marginTop: 8, marginBottom: 4}}> Enter a name for the file </label>
                    <div className="h-between" id="export-pref-filename-field">
                        <input
                            type="text"
                            id="filename"
                            onChange={(e) => setFilename(e.target.value)}
                            // placeholder={defaultFileName || "export.csv"}
                            value={fileName}
                            required
                        />

                        <div id="csv-unchangable"> .csv </div>
                    </div>

                    <button className="pillButton"> Download CSV </button>
                </form>

            </FloatingModal>
        </div>
    )
}

export default ExportCSV;