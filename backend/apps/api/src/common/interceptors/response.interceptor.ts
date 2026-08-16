import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface SuccessResponse<Data> {
  data: Data;
  success: true;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse<unknown>> {
    return next.handle().pipe(map((data) => ({ data, success: true })));
  }
}
