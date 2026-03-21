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

    let status = 500;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') message = res;
      else if (typeof res === 'object' && res !== null)
        message = (res as any).message || message;
    } else if (exception?.code) {
      switch (exception.code) {
        case 'P2002':
          message = 'Duplicate value. Record already exists.';
          status = 400;
          break;
        case 'P2003':
          message =
            'Cannot delete or update this record because it is linked to other resources.';
          status = 400;
          break;
        case 'P2025':
          message = 'Record not found.';
          status = 404;
          break;
        default:
          message = exception.message || message;
      }
    } else if (
      exception?.clientVersion &&
      exception?.message?.includes('violates RESTRICT')
    ) {
      message =
        'Cannot delete or update this record because it is linked to other resources.';
      status = 400;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
