import { z } from 'zod'
import axios from 'axios';
import { redirect } from 'next/navigation';

const baseUrl = process.env.BASE_BACKEND_URL

const loginSchema = z.object({
    identifier: z.string().min(1, "Username or email is required"),
    password: z.string().min(1, "Password is required"),
})

export async function login(state: any, formData: FormData) {
    const email = formData.get('email')
    const password = formData.get('password')
    const validatedFields = loginSchema.safeParse({
        email: email,
        password: password
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        };
    }

    try {
        const response = await axios.post(`${baseUrl}/user/login`, { email, password }, {
            withCredentials: true,
            headers: {
                'Content-type': 'application/json'
            }
        })

        // Log the full response to inspect headers
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);
        console.log('Response headers:', response.headers);

        // Check for Set-Cookie header explicitly
        const setCookie = response.headers['set-cookie'];
        console.log('Set-Cookie:', setCookie || 'No cookies found');

        if (response.status === 200) {
            // Access the cookie from the response headers
            // const cookies = response.headers['set-cookie'];
            // console.log('Cookies:', cookies);
            redirect('/gallery')
        }

        redirect('/login')
    } catch (error) {
        console.log(error)
    }
}
