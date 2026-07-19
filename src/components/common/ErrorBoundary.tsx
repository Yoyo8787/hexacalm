import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
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
      return (
        <div className="grid h-full place-items-center p-6 text-center">
          <div>
            <p className="text-lg font-semibold">世界載入失敗</p>
            <p className="text-muted mt-2 text-sm">
              請重新整理頁面後再試一次。
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
