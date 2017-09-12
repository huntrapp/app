// @flow

// state def
export type LogosState = {
    [uri: string]: string
};

const defaultState: LogosState = {};

// actions
type SetLogoAction = {
    type: 'SET_LOGO',
    payload: {
        [uri: string]: string
    }
};

type ResetLogosAction = {
    type: 'RESET_LOGOS'
};

export type Action = SetLogoAction | ResetLogosAction;

// reducer
export default (state: LogosState = defaultState, action: Action) => {
    switch (action.type) {
        case 'SET_LOGO':
            return {
                ...state,
                ...action.payload
            };
        case 'RESET_LOGOS':
            return defaultState;
        default:
            return state;
    }
};

// action creators
export const setLogo = (logoUrl: string, dataUrl: string) => ({
    type: 'SET_LOGO',
    payload: {
        [logoUrl]: dataUrl,
    },
});

export const resetLogos = (): ResetLogosAction => ({
    type: 'RESET_LOGOS',
});
