import { describe, it, expect } from 'bun:test';
import axios from 'axios';

let BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api/v1';
describe('Website gets created', () => {
    it('Website not created if url is not present', async () => {
        await expect(axios.post(`${BASE_URL}/website`, {})).rejects.toThrow('Request failed with status code 410');
    });
});
