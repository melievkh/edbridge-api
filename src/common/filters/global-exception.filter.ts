import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Default values
    let status = 500;
    let message = 'Internal server error';

    // If it's an HttpException (BadRequest, NotFound, etc.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        message = (res as any).message || message;
      }
    }

    // Prisma errors (example catching)
    else if (exception.code === 'P2003') {
      // foreign key constraint error
      message = 'This record is linked to another resource and cannot be deleted';
      status = 400;
    } else if (exception.code === 'P2002') {
      // unique constraint
      message = 'Duplicate value. This record already exists';
      status = 400;
    }

    return response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
