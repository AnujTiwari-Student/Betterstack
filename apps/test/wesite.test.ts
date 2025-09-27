import { describe, it, expect, beforeAll } from 'bun:test';
import axios, { AxiosError, type AxiosResponse } from 'axios';
import { BASE_URL } from 'configs/config';
import { createUser } from './utils/test_user';

interface ApiErrorResponse {
    error: string;
    details?: any;
}

interface WebsiteResponse {
    id: string;
    url: string;
    userId: string;
}


describe('Website API - Create URL', () => {

    let authToken: string | null = null;
    let userId: string | null = null;

    beforeAll(async () => {
        try {
            const userData = await createUser();
            authToken = userData.token;
            userId = userData.id;
            console.log('Test setup completed for user:', userData.username);
        } catch (error) {
            console.error('Test setup failed:', error);
            throw error;
        }
    });

    it('❌ Should return 400 when URL is missing', async () => {
        try {
            await axios.post(`${BASE_URL}/website/create_url`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            expect.unreachable('Should have thrown an error');
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            
            expect(axiosError.response?.status).toBe(400);
            expect(axiosError.response?.data).toHaveProperty('error');
            
            console.log('Expected error response:', axiosError.response?.data);
        }
    });

    it('❌ Should return 401 when Authorization header is missing', async () => {
        try {
            await axios.post(`${BASE_URL}/website/create_url`, {
                url: 'https://example.com'
            });
            expect.unreachable('Should have thrown an error');
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            
            expect(axiosError.response?.status).toBe(401);
            expect(axiosError.response?.data).toHaveProperty('error');
            
            console.log('Auth error response:', axiosError.response?.data);
        }
    });

    it('❌ Should return 401 when token is invalid', async () => {
        try {
            await axios.post(`${BASE_URL}/website/create_url`, {
                url: 'https://example.com'
            }, {
                headers: {
                    Authorization: 'Bearer invalid_token_here',
                    'Content-Type': 'application/json'
                }
            });
            expect.unreachable('Should have thrown an error');
        } catch (error) {
            const axiosError = error as AxiosError<ApiErrorResponse>;
            
            expect(axiosError.response?.status).toBe(401);
            expect(axiosError.response?.data).toHaveProperty('error');
            
            console.log('Invalid token response:', axiosError.response?.data);
        }
    });


    it('✅ Should create website when valid URL and auth are provided', async () => {
        const payload = { 
            url: 'https://example.com'
        };

        try {
            const response: AxiosResponse<WebsiteResponse> = await axios.post(
                `${BASE_URL}/website/create_url`, 
                payload, 
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            expect(response.status).toBe(201);
            expect(response.data).toHaveProperty('id');
            expect(response.data).toHaveProperty('url');
            expect(response.data.url).toBe(payload.url);
            expect(response.data).toHaveProperty('userId');
            
            console.log('Successful creation response:', response.data);
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Unexpected error:', axiosError.response?.data);
            throw error;
        }
    });

    it('❌ Should return 400 for invalid URL format', async () => {
        const invalidUrls = [
            'not-a-url',
            'http://',
            'ftp://example.com',
            'javascript:alert("xss")',
            ''
        ];

        for (const invalidUrl of invalidUrls) {
            try {
                await axios.post(`${BASE_URL}/website/create_url`, {
                    url: invalidUrl
                }, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                expect.unreachable(`Should have rejected invalid URL: ${invalidUrl}`);
            } catch (error) {
                const axiosError = error as AxiosError<ApiErrorResponse>;
                expect(axiosError.response?.status).toBe(400);
                console.log(`Invalid URL "${invalidUrl}" correctly rejected:`, axiosError.response?.data);
            }
        }
    });
    
});
    