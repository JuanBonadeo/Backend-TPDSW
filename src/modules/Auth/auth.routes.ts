import { Router } from 'express';
import { Request, Response } from 'express';
import { auth } from '../../utils/auth.js';
import { ResponseHandler } from '../../utils/ResponseHandler.js';
import { ErrorHandler } from '../../utils/ErrorHandler.js';


export const router = Router();

router.post('/sign-up', async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const response = await auth.api.signUpEmail({
            body: {
                email: body.email, // required
                password: body.password, // required
                name: body.name, // required
            },
        });
        if (!response) {
            throw new Error('User creation failed');
        }
        return ResponseHandler.created(res, response, 'User created successfully');  
    } catch (error) {
        return ErrorHandler.handle(error, res);
    }
});

router.post('/sign-in', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const response = await auth.api.signInEmail({
            body: {
                email,
                password,
            },
            returnHeaders: true,
        });

        if (!response) {
            throw new Error('User sign-in failed');
        }
        
        return ResponseHandler.success(res, response, 'User signed in successfully');
    } catch (error) {
        return ErrorHandler.handle(error, res);
    }
});
