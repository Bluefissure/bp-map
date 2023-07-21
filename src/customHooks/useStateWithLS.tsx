import { useState, useCallback } from 'react';

export const useStateWithLS = <T, >(key: string, initialState: T): [T, (arg1: T) => void] => {
    const initState = localStorage.getItem(key) === undefined
        ? initialState
        : JSON.parse(localStorage.getItem(key) as string) as T;
    const [state, _setState] = useState(initState);
    const setState = useCallback(
        (newState: unknown) => {
            if (typeof newState === 'function') {
                _setState((prevState: T) => {
                    const computedState = newState(prevState) as T;
                    localStorage.setItem(key, JSON.stringify(computedState));
                    return computedState;
                });
            } else {
                localStorage.setItem(key, JSON.stringify(newState));
                _setState(newState as T);
            }
        },
        []
    );
    return [state, setState];
}