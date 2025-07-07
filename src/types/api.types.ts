import {  ZodIssue } from "zod";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string | ZodIssue[] | string[];
  errors?: any[];
  timestamp: string;
}

export interface SuccessResponse<T = any> extends ApiResponse<T> {
  success: true;
  data: T;
}

export interface ErrorResponse extends ApiResponse {
  success: false;
  data?: null;
  error?: any[];
}
