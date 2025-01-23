import { createContext, useContext } from 'react';

const CurrentUserContext = createContext(null);

export const useCurrentUser = () => useContext(CurrentUserContext);

export default CurrentUserContext;
