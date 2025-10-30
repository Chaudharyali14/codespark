// src/lib/errorHandler.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(404, message);
  }
}

export class ValidationError extends ApiError {
  constructor(public issues: z.ZodIssue[], message = 'Validation Error') {
    super(400, message);
  }
}

export class DatabaseError extends ApiError {
  constructor(message = 'Database Error') {
    super(500, message);
  }
}

export function withErrorHandler<T extends (...args: any[]) => any>(
  handler: T
): (...args: Parameters<T>) => Promise<NextResponse> {
  return async (...args: Parameters<T>) => {
    try {
      const response = await handler(...args);
      return response;
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(
          { error: error.message, ...(error instanceof ValidationError && { issues: error.issues }) },
          { status: error.statusCode }
        );
      }

      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: 'Validation Error', issues: error.issues }, { status: 400 });
      }

      console.error('Unhandled API Error:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
}
