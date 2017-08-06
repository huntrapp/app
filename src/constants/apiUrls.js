const BASE_URL = 'http://quarry.host/'; // todo add production/dev check

export const feedUrl = (page = 1) => `${BASE_URL}feed?page=${page}`;