// only the parts we need are typed...

export type IChromeAPI = {
    runtime: {
        lastError: Error
    },
    storage: {
        sync: {
            set: (key: string, value: any) => void,
            get: (key: string) => any,
            remove: (key: string) => any
        }
    },

    // type this if we ever use it's contents... for now only used to check if we're an extension.
    extension: any
}

export type ICard = {
    _id: string,
    type: string,
    size: 'small' | 'medium' | 'large',
    score: number,
    ranking: number,
    url: string,
    timestamp: number, // publication date
    title: string, // title
}

export type MessageIcon = 'cloud_off' | 'check' | 'warning' | null;
export type MessageType = 'error' | 'message';
export type IMessage = {
    type: MessageType,
    icon: MessageIcon,
    text: string,
    id: number,
    expiration: number
};
