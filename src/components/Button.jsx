function Button({children, onClick}) {
    return(
        <button className="btn" type="submit" onClick={onClick}>
            {children}
        </button>
    )
}

export default Button