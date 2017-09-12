// @flow

import type { IMessage, MessageIcon, MessageType } from '../entities/index';

// state def

export type MessagesState = IMessage[];

const defaultState: MessagesState = [];

// actions
type AddMessageAction = {
    type: 'ADD_MESSAGE',
    payload: IMessage
};

type RemoveMessageAction = {
    type: 'REMOVE_MESSAGE',
    payload: {
        id: number
    }
};

export type Action = AddMessageAction | RemoveMessageAction;

// reducer
export default (state: MessagesState = defaultState, action: Action): MessagesState => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return [...state, action.payload];
        case 'REMOVE_MESSAGE':
            return [...state].filter((message: IMessage) => message.id !== action.payload.id);
        default:
            return state;
    }
};

// action creators
export const addMessage = (text: string, type: MessageType = 'message', icon: MessageIcon = null, id: number = Math.round(Math.random() * 100000), expiration: number = 5000): AddMessageAction => ({
    type: 'ADD_MESSAGE',
    payload: { text, type, icon, id, expiration },
});

export const removeMessage = (id: number): RemoveMessageAction => ({
    type: 'REMOVE_MESSAGE',
    payload: {
        id,
    },
});
