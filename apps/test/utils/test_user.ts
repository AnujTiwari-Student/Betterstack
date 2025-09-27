import axios, { type AxiosResponse } from "axios";
import { BASE_URL } from "configs/config";

interface CreateUserResponse {
    id: string;
    username: string;
    token: string;
}

let testUser = {
    username: `test_user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    password: 'SecureTest123!',
};

export async function createUser(): Promise<CreateUserResponse> {
    try {
        const signupResponse: AxiosResponse = await axios.post(`${BASE_URL}/users/signup`, testUser);
        const loginResponse: AxiosResponse = await axios.post(`${BASE_URL}/users/login`, testUser);
        
        return {
            id: signupResponse.data.id,
            username: signupResponse.data.username,
            token: loginResponse.data.token
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('API Error:', error.response?.data);
            console.error('Status:', error.response?.status);
        }
        throw new Error(`Failed to create test user: ${error}`);
    }
}