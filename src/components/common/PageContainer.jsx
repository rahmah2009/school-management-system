function PageContainer({ children, className = "" }) {
    return (
        <div className={`mx-auto max-w-7xl px-6 md:px-12 ${className}`}>
            {children}
        </div>
    );
}

export default PageContainer;