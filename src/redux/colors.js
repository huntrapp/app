/**
 * the colors reducer acts as a cache (gets completely rehydrated),
 * so we don't have to calculate the vibrant color of a image again.
 */

// @flow

// state def
export type ColorsState = {
    [url: string]: string
};

const defaultState: ColorsState = {};

// actions
type SetColorAction = {
    type: 'SET_COLOR',
    payload: {
        [url: string]: string
    }
};

export type Action = SetColorAction;

// reducer

export default (state: ColorsState = defaultState, action: Action) => {
    switch (action.type) {
        case 'SET_COLOR':
            return {
                ...state,
                ...action.payload
            };
        case 'RESET_COLORS':
            return defaultState;
        default:
            return state;
    }
};

// action creators
export const setColor = (url: string, color: string): SetColorAction => ({
    type: 'SET_COLOR',
    payload: {
        [url]: color,
    },
});
