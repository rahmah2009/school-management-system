
import { Component } from "react";
import ServerError from "../../pages/public/ServerError";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Greenfield application error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ServerError />;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
