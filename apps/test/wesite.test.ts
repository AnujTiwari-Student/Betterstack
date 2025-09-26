import { describe, it, expect } from 'bun:test';
import axios from 'axios';

let BASE_URL = process.env.BASE_URL || 'http://localhost:5000/api/v1';

describe('Website API - Create URL', () => {
    it('❌ Website should NOT be created if url is missing', async () => {
        try {
            await axios.post(`${BASE_URL}/website/create_url`, {});
        } catch (error: any) {
            console.log('Response when url is missing:', error.response?.data);
            console.log('Status code:', error.response?.status);
            expect(error.response?.status).toBe(410);
        }
    });

    it('✅ Website should be created when url is present', async () => {
        const payload = { url: 'https://example.com', userId: "cmg0qx7me0000rna7thqjvn7s" };
        const response = await axios.post(`${BASE_URL}/website/create_url`, payload);

        console.log('Response when url is provided:', response.data);

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data.url).toBe(payload.url);
    });
});
    