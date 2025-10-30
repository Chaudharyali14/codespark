// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
class MockFormData {
    constructor() {
        this.data = new Map();
    }
    append(key, value) {
        if (this.data.has(key)) {
            this.data.get(key).push(value);
        } else {
            this.data.set(key, [value]);
        }
    }
    get(key) {
        const values = this.data.get(key);
        return values ? values[0] : null;
    }
    getAll(key) {
        return this.data.get(key) || [];
    }
}
global.FormData = MockFormData;
global.FormData = MockFormData;

import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import '@next/env';
import '@testing-library/jest-dom';