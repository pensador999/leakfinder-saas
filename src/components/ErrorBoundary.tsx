import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 m-4 border border-rose-500/30 bg-[#101211] rounded-2xl text-center shadow-xl">
          <AlertTriangle className="w-12 h-12 text-rose-500 mb-4" />
          <h3 className="text-lg font-bold text-[#FFFCE1] mb-2">Ops! Ocorreu um erro nesta seção.</h3>
          <p className="text-sm text-[#BBBAA6] max-w-md">
            {this.props.fallbackMessage || 'Algo deu errado ao carregar estes dados. Mas não se preocupe, o restante da plataforma continua funcionando.'}
          </p>
          {this.state.error && (
            <div className="mt-4 p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-left max-w-xl w-full overflow-x-auto">
              <p className="text-xs font-mono font-bold text-rose-300">{this.state.error.name}: {this.state.error.message}</p>
              {this.state.error.stack && (
                <pre className="text-[10px] font-mono text-rose-400/80 mt-1 whitespace-pre-wrap">{this.state.error.stack}</pre>
              )}
            </div>
          )}
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-[#141716] border border-white/10 text-[#FFFCE1] rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors cursor-pointer"
          >
            Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
