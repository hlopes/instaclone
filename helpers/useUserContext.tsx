import React, {
    createContext,
    useReducer,
    useContext,
    useEffect,
    useMemo,
    useCallback,
} from 'react';

import { login, register } from '@lib/api-user';

import { User } from '../types/User';
import { UserContext as UserContextType, Result } from '../types/UserContext';

type UserContextProviderProps = {
    children: any;
};

type State = {
    isLoading: boolean;
    error: any;
    result: Result;
};

const initialState = {
    isLoading: false,
    error: null,
    result: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'START_USER':
            return {
                ...state,
                isLoading: true,
            };
        case 'SUCCESS_USER':
            return {
                ...state,
                isLoading: false,
                result: action.payload,
            };
        case 'FAIL_USER':
            return {
                ...state,
                isLoading: false,
                result: null,
                error: action.payload,
            };
        case 'RESET_USER':
            return {
                ...initialState,
            };
        case 'AUTO_USER':
            return {
                ...initialState,
                result: {
                    ...state.result,
                    user: action.payload,
                },
            };
        default:
            return state;
    }
};

export const UserContext = createContext<UserContextType>({
    isAuthenticated: false,
    isLoading: false,
    error: null,
    result: {
        user: null,
        token: null,
    },
});

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
    const [state, dispatch]: [State, any] = useReducer(reducer, initialState);

    const isAuthenticated = useMemo(() => !!state?.result?.user?.email, [
        state,
    ]);

    const loginUser = useCallback(async ({ username, password }) => {
        try {
            dispatch({ type: 'START_USER' });

            const result = await login(username, password);

            if (result?.errorCode) {
                throw new Error(result?.message);
            }

            localStorage.setItem('jwt', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            dispatch({ type: 'SUCCESS_USER', payload: result });
        } catch (error) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');

            return dispatch({ type: 'FAIL_USER', payload: error });
        }
    }, []);

    const registerUser = useCallback(async ({ name, username, password }) => {
        try {
            dispatch({ type: 'START_USER' });

            const result = await register(name, username, password);

            if (result?.errorCode) {
                throw new Error(result?.message);
            }

            localStorage.setItem('jwt', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            dispatch({ type: 'SUCCESS_USER', payload: result });
        } catch (error) {
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');

            return dispatch({ type: 'FAIL_USER', payload: error });
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('user');

        dispatch({ type: 'RESET_USER', payload: null });
    }, [dispatch]);

    // Automatic login when there is an user in local storage
    useEffect(() => {
        const user: User = JSON.parse(localStorage.getItem('user'));

        if (user) {
            dispatch({ type: 'AUTO_USER', payload: user });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <UserContext.Provider
            value={{
                ...state,
                isAuthenticated,
                loginUser,
                registerUser,
                logout,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

const useUserContext = (): UserContextType =>
    useContext<UserContextType>(UserContext);

export default useUserContext;
