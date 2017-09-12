// @flow

import { CALL_API, ApiError } from 'redux-api-middleware';
import { feedUrl } from '../constants/apiUrls';
import { REHYDRATE } from 'redux-persist/constants';
import { ICard } from '../entities/index';

// state def

export type FeedState = {
    error: ?ApiError,
    isLoading: boolean,
    items: {
        docs: ICard[],
        page: number,
        pages: number,
        total: number,
        limit: number
    }
};

const defaultState: FeedState = {
    error: null,
    isLoading: false,
    items: {
        docs: [],
        page: 0,
        pages: 0,
        total: 0,
        limit: 0,
    },
};

// actions
export type FeedFailureAction = {
    type: 'FEED_FAILURE',
    payload: ApiError
};

export type FeedRequestAction = {
    type: 'FEED_REQUEST',
    payload: null,
    error?: boolean
};

export type FeedSuccessAction = {
    type: 'FEED_SUCCESS',
    payload: any
};

export type Action = FeedFailureAction | FeedRequestAction | FeedSuccessAction;

// reducer

export const reducer = (state: FeedState = defaultState, action: Action) => {
    switch (action.type) {
        case REHYDRATE: {
            // we only allow rehydration of items key.
            const items = 'feed' in action.payload ? action.payload.feed.items : defaultState.items;
            return {
                ...state,
                items,
            };
        }
        case 'FEED_REQUEST':
            return {
                ...state,
                error: action.error ? action.payload : null,
                isLoading: !action.error,
            };
        case 'FEED_SUCCESS': {
            // backend returns a string for some reason...
            const page = parseInt(action.payload.page);
            return {
                ...state,
                items: {
                    ...action.payload,
                    docs: page === 1 ? action.payload.docs : [...state.items.docs, ...action.payload.docs],
                    page,
                },
                isLoading: false,
            };
        }
        case 'FEED_FAILURE':
            return {
                ...state,
                error: action.payload,
                isLoading: false,
            };
        default:
            return state;
    }
};

// action creators

export const getFeed = (token: string, page: number = 1) => ({
    [CALL_API]: {
        endpoint: feedUrl(page),
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        types: ['FEED_REQUEST', 'FEED_SUCCESS', 'FEED_FAILURE'],
    },
});
