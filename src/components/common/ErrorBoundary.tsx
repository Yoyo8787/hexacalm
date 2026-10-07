import { Component, type ErrorInfo, type ReactNode } from "react";
import WorldError from "./WorldError";

interface ErrorBoundaryProps {
  children: ReactNode;
  onBack: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("The world could not be rendered.", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <WorldError onBack={this.props.onBack} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
