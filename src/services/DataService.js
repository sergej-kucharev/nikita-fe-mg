'use strict';

export class DataService {
    constructor(...keys) {
        const events = keys.reduce((K, k) => ({ ...K, [k]: [], }), {});
        const E = (key) => events[key] || [];
        const eq = (..._) => e => e.every((e, i) => e === _[i]);
        Object.defineProperties(this, {
            emit: {
                get: () => async (key, ...data) => {
                    const E = events[key];
                    if (!E) return false;
                    return Promise.allSettled(E.map(async([call]) => call(...data)));
                },
            },
            keys: { get: () => [...keys], },
            off: {
                get: () => (key, call, owner) => {
                    const index = E(key).findIndex(eq(call, owner));
                    if (index<0) return false;
                    E.splice(index, 1);
                    return true;
                },
            },
            on: {
                get: () => (key, call, owner) => {
                    const E = events[key];
                    if (!E) return false;
                    const index = E(key).findIndex(eq(call, owner));
                    if (index>=0) return false;
                    E.push([call, owner]);
                    return true;
                },
            },
        });
    };

    url(path) {
        return new URL(path, 'http://localhost:4000');
    }
};