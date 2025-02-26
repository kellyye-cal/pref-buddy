import React from "react";
import ReactDOM from "react-dom";

const EditRatingModal = ({ isOpen, closeFunc, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="overlay" onClick={closeFunc}>
            <div className="editRatingModal" onClick={(e) => e.stopPropagation()}>
                {/* <button className="close-button" onClick={closeFunc}>×</button> */}
                {children}
            </div>
        </div>,
        document.body
    );
};

export default EditRatingModal;