'use strict'
import * as path from 'path';
const cache = require('memory-cache');

const memoryCache = {
    getGlobal: (key: string) => {
        return cache.get(key);
    },
    setGlobal: (key: string, value: any) => {
        cache.put(key, value);
    },
    delGlobal: (key: string) => {
        cache.del(key);
    },
    get: (key: string) => {
        return cache.get(memoryCache.getLocalKey(key));
    },
    set: (key: string, value: any) => {
        cache.put(memoryCache.getLocalKey(key), value);
    },
    del: (key: string) => {
        cache.del(memoryCache.getLocalKey(key));
    },
    getLocalKey: (key: string) => {
        return path.relative(process.cwd(), __filename) + ":" + key;
        // console.log(path.relative(process.cwd(), __filename));
        // console.log(path.join(__dirname, __filename, key));
    }
};

export default memoryCache