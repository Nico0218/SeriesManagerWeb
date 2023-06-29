import { createContext } from 'react';
import GlobalAppContextProps from './global-app-context-props';

const GlobalAppContext = createContext<GlobalAppContextProps>({});
export default GlobalAppContext;
