import { RefObject, ReactNode } from 'react';

declare module '@react-google-maps/api' {
  interface LoadScriptProps extends LoadScriptUrlOptions {
    children?: ReactNode;
    id: string;
    nonce?: string;
    loadingElement?: ReactNode;
    onLoad?: () => void;
    onError?: (error: Error) => void;
    onUnmount?: () => void;
    preventGoogleFontsLoading?: boolean;
  }

  class LoadScriptComponent extends React.Component<LoadScriptProps> {
    check: RefObject<HTMLDivElement>;
    state: {
      loaded: boolean;
    };
    cleanupCallback: () => void;
    componentDidMount(): void;
    componentDidUpdate(prevProps: LoadScriptProps): void;
    componentWillUnmount(): void;
    isCleaningUp: () => Promise<void>;
    cleanup: () => void;
    injectScript: () => void;
    render(): ReactNode;
  }
}
