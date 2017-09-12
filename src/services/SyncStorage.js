/* eslint no-console: 0 */
// @flow

import { IChromeAPI } from '../entities';

declare var chrome: IChromeAPI;

const promisify = (func: Function) => {
    return (...args) => {
        return new Promise((resolve, reject) => {
            func(...args, (...args) => {
                const error = chrome.runtime.lastError;
                if (error) {
                    return reject(error);
                }
                resolve(...args);
            });
        });
    };
};

const nop = () => {
};
const hasStorage = 'storage' in chrome;
const set = promisify(hasStorage ? chrome.storage.sync.set : nop);
const get = promisify(hasStorage ? chrome.storage.sync.get : nop);
const remove = promisify(hasStorage ? chrome.storage.sync.remove : nop);

export default class SyncStorage {
    static async getItem (key: string, cb: Function) {
        console.debug('SyncStorage.getItem', key);
        try {
            const result = (await get(key))[key];
            cb(null, result);
        } catch (ex) {
            cb(ex);
        }
    }

    static async setItem (key: string, value: any, cb: Function) {
        console.debug('SyncStorage.setItem', key, value);
        try {
            await set({
                [key]: value,
            });
            cb(null);
        } catch (ex) {
            cb(ex);
        }
    }

    static async getAllKeys (cb: Function) {
        console.debug('getAllKeys');
        try {
            const result = Object.keys(await get(null));
            cb(null, result);
        } catch (ex) {
            cb(ex);
        }
    }

    static async removeItem (key: string, cb: Function) {
        console.debug('SyncStorage.removeItem', key);
        try {
            await remove(key);
            cb(null);
        } catch (ex) {
            cb(ex);
        }
    }
}
