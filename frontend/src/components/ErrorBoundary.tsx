import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "./ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center font-display">
                    <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6">
                        <AlertTriangle className="w-10 h-10 text-destructive" />
                    </div>
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tight mb-2">
                        Something went wrong
                    </h1>
                    <p className="text-muted-foreground font-bold mb-8 max-w-md">
                        The application encountered an unexpected error. This can sometimes happen due to translation conflicts.
                    </p>
                    <Button
                        onClick={() => window.location.reload()}
                        className="rounded-xl px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primary/20"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Reload Application
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
