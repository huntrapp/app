// @flow

import { takeEvery, put, call } from 'redux-saga/effects';
import type { Action as FeedAction } from '../redux/feed';
import type { Action as MessageAction } from '../redux/messages';
import { addMessage, removeMessage } from '../redux/messages';
import { IMessage } from '../entities/index';

const wait = (timeout: number) => (
    new Promise((resolve) => {
        setTimeout(() => resolve(), timeout);
    },
    ));

function* onFeedError (action: FeedAction) {
    if (action.type === 'FEED_REQUEST' && !action.error) {
        return;
    }

    switch (action.type) {
        case 'FEED_REQUEST':
            yield put(addMessage('A server error occurred, try again later.', 'error', 'warning'));
            break;
        case 'FEED_FAILURE':
            yield put(addMessage('Could not connect to Quarry servers.', 'error', 'cloud_off'));
            break;
    }
}

function* removeOnExpire (action: MessageAction) {
    const message: IMessage = action.payload;

    yield call(wait, message.expiration);
    yield put(removeMessage(message.id));
}

export default function* (): Generator<*, *, *> {
    // feed actions
    yield takeEvery(['FEED_REQUEST', 'FEED_FAILURE'], onFeedError);

    // removal of messages once they expire
    yield takeEvery('ADD_MESSAGE', removeOnExpire);
}
