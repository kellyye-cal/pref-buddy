import React from "react";
import ReactDOM from "react-dom";

const FloatingModal = ({ isOpen, closeFunc, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="overlay" onClick={closeFunc}>
            <div className="floatingModal" onClick={(e) => e.stopPropagation()}>
                {/* <button className="close-button" onClick={closeFunc}>×</button> */}
                {children}
            </div>
        </div>,
        document.body
    );
};

export default FloatingModal;