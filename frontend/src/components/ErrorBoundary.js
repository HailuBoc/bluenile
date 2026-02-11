"use client";

import { Component } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { InteractiveButton } from "./InteractiveComponents";
import { cn } from "../utils/cn";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, errorId: Date.now() };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console and/or error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You could also log to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
          <motion.div
            className="max-w-md w-full text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Error Icon */}
            <motion.div
              className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
            >
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </motion.div>

            {/* Error Message */}
            <motion.h1
              className="text-2xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Oops! Something went wrong
            </motion.h1>

            <motion.p
              className="text-gray-400 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              We encountered an unexpected error. Our team has been notified and is working to fix this issue.
            </motion.p>

            {/* Error ID for debugging */}
            {this.state.errorId && (
              <motion.p
                className="text-xs text-gray-500 mb-6 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Error ID: {this.state.errorId}
              </motion.p>
            )}

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <InteractiveButton
                onClick={this.handleReset}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </InteractiveButton>
              
              <InteractiveButton
                variant="secondary"
                onClick={this.handleGoHome}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go Home
              </InteractiveButton>
            </motion.div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <motion.details
                className="mt-8 text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-400 mb-2">
                  Error Details (Development Only)
                </summary>
                <div className="bg-black/50 rounded-lg p-4 text-xs text-gray-400 overflow-auto max-h-40">
                  <p className="font-mono mb-2">{this.state.error.toString()}</p>
                  <pre className="whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </div>
              </motion.details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ✅ Functional Error Boundary for specific components
export function ErrorFallback({ error, resetErrorBoundary, errorId }) {
  return (
    <div className="p-6 text-center">
      <motion.div
        className="max-w-sm mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-400 mb-4 text-sm">
          {error?.message || "An unexpected error occurred"}
        </p>
        <InteractiveButton
          onClick={resetErrorBoundary}
          size="sm"
          className="flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </InteractiveButton>
      </motion.div>
    </div>
  );
}

// ✅ Async Error Boundary for async operations
export function AsyncErrorBoundary({ children, fallback }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = (error) => {
    console.error("Async error caught:", error);
    setError(error);
  };

  const resetError = () => {
    setError(null);
  };

  if (error) {
    return fallback || <ErrorFallback error={error} resetErrorBoundary={resetError} />;
  }

  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}

// ✅ Hook for error handling in functional components
export function useErrorHandler() {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    console.error("Error caught by useErrorHandler:", error);
    setError(error);
  };

  const resetError = () => {
    setError(null);
  };

  return { error, handleError, resetError };
}
