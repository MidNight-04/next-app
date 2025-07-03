import { AuthContext } from '../context/authContext';
import { useContext } from 'react';

export const useSession = () => useContext(AuthContext);
