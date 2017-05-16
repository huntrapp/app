// @flow

// state def

export type TokenState = string;
const defaultState: TokenState = '';

export type Action = TokenStateAction;

// actions
type TokenStateAction = {
    type: 'TOKEN_STATE',
    payload: string
};

// reducer
export const reducer = (state: TokenState = defaultState, action: Action) => {
    switch (action.type) {
        case 'SET_TOKEN':
            return action.payload;
        default:
            return state;
    }
};

// action creators
export const setToken = (token: string) => ({
    type: 'SET_TOKEN',
    payload: token
});