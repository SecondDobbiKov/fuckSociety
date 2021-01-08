import React from 'react';

export const request = async (url, method = 'GET', headers = {}, body = null) => {
    let _url = `https://localhost:44396${url}`;
    const req = await fetch(_url, {method, headers, body});
    return req;
};
