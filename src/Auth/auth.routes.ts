import { Router } from "express";
import { Request, Response } from "express";
import { auth } from "../utils/auth.js";
import { internalServerErrorResponse, successResponse } from "../utils/responseHandler.js";


export const router = Router();



router.post("/sign-up", async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;
        const response = await auth.api.signUpEmail({
            body: {
                email,
                password,
                name
            },
        });
        if (!response) {
            internalServerErrorResponse(res, "Sign-up failed");
            return;
        }
        successResponse(res, response, "Sign-up successful");
    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ error: "Sign-up failed" });
    }
});

router.post("/sign-in", async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const response = await auth.api.signInEmail({
            body: {
                email,
                password
            },
            returnHeaders: true,
        });
        
        
        successResponse(res, response, "Sign-in successful");
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ error: "Sign-in failed" });
    }
});

