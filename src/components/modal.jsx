function Modal({ children }) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                {children}
            </div>
        </div>
    )
}

export default Modal