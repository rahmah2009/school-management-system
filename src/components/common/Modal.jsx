function Modal({
    isOpen,
    onClose,
    title,
    children,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-green-950">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl font-bold text-gray-500 hover:text-green-950"
                    >
                        ×
                    </button>
                </div>

                <div className="mt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Modal;