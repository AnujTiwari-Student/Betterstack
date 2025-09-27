import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { BASE_URL } from 'configs/config';
import axios from 'axios';


let testUser = {
    username: `anuj_${Date.now()}`,
    password: 'anuj123',
};

let authToken: string | null = null;

describe('User API - Registration', () => {
    it('❌ User should NOT be created if username is missing', async () => {
        try {
            await axios.post(`${BASE_URL}/users/signup`, { password: testUser.password });
        } catch (error: any) {
            console.log('Response when username is missing:', error.response?.data);
            console.log('Status code:', error.response?.status);
            expect(error.response?.status).toBe(400);
        }
    });

    it('❌ User should NOT be created if password is missing', async () => {
        try {
            await axios.post(`${BASE_URL}/users/signup`, { username: testUser.username });
        } catch (error: any) {
            console.log('Response when password is missing:', error.response?.data);
            console.log('Status code:', error.response?.status);
            expect(error.response?.status).toBe(400);
        }
    });

    it('✅ User should be created when username and password are present', async () => {
        const response = await axios.post(`${BASE_URL}/users/signup`, testUser);

        console.log('Response when both username and password are provided:', response.data);

        expect(response.status).toBe(201);
        expect(response.data).toHaveProperty('id');
        expect(response.data).toHaveProperty('username', testUser.username);
        expect(response.data).toHaveProperty('message', 'User created successfully');
    });

    it('❌ User should NOT be created if username already exists', async () => {
        try {
            await axios.post(`${BASE_URL}/users/signup`, testUser);
        } catch (error: any) {
            console.log('Response when username already exists:', error.response?.data);
            console.log('Status code:', error.response?.status);
            expect(error.response?.status).toBe(409);
        }
    });
});

describe('User API - Login', () => {
    it('❌ User should NOT be able to login with incorrect username', async () => {
        try {
            await axios.post(`${BASE_URL}/users/login`, { username: 'wronguser', password: testUser.password });
        } catch (error: any) {
            console.log('Response when username is incorrect:', error.response?.data);
            console.log('Status code:', error.response?.status);
            expect(error.response?.status).toBe(401);
        }
    });

    it('❌ User should NOT be able to login with incorrect password', async () => {
        try {
            await axios.post(`${BASE_URL}/users/login`, { username: testUser.username, password: 'wrongpass' });
        } catch (error: any) {
            console.log('Response when password is incorrect:', error.response?.data);
            console.log('Status code:', error.response?.status);
            expect(error.response?.status).toBe(401);
        }
    });
    
    it('✅ User should be able to login with correct credentials', async () => {
        const response = await axios.post(`${BASE_URL}/users/login`, testUser);

        console.log('Response when login is successful:', response.data);

        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('token');
        expect(response.data).toHaveProperty('message', 'Login successful');

        authToken = response.data.token; 
    });
});