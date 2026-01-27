import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogService } from '../services/audit/audit-log.service';
import { Request } from 'express';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(private auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, ip, headers } = request;
    const user = (request as any).user;

    const action = this.getActionFromMethod(method);
    const resourceType = this.getResourceTypeFromUrl(url);

    return next.handle().pipe(
      tap(() => {
        // Log successful operation
        this.auditLogService
          .logDataAccess(
            user?.userId,
            action,
            resourceType,
            this.getResourceIdFromUrl(url) || '',
            ip,
            {
              method,
              url,
              userAgent: headers['user-agent'],
            },
          )
          .catch((error) => {
            this.logger.error('Failed to log audit event', error);
          });
      }),
      catchError((error) => {
        // Log failed operation
        this.auditLogService
          .log({
            userId: user?.userId,
            action,
            resourceType,
            resourceId: this.getResourceIdFromUrl(url) || '',
            description: `Failed ${action} operation`,
            ipAddress: ip,
            userAgent: headers['user-agent'],
            status: 'error',
            errorMessage: error.message,
          })
          .catch((logError) => {
            this.logger.error('Failed to log audit error', logError);
          });

        throw error;
      }),
    );
  }

  private getActionFromMethod(method: string): 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' {
    const methodMap: Record<string, 'READ' | 'CREATE' | 'UPDATE' | 'DELETE'> = {
      GET: 'READ',
      POST: 'CREATE',
      PUT: 'UPDATE',
      PATCH: 'UPDATE',
      DELETE: 'DELETE',
    };

    return methodMap[method.toUpperCase()] || 'READ';
  }

  private getResourceTypeFromUrl(url: string): string {
    // Extract resource type from URL (e.g., /api/users -> USER)
    const parts = url.split('/').filter((part) => part && part !== 'api' && part !== 'v1');
    return parts[0] ? parts[0].toUpperCase().slice(0, -1) : 'UNKNOWN';
  }

  private getResourceIdFromUrl(url: string): string | null {
    // Extract resource ID from URL (e.g., /api/users/123 -> 123)
    const parts = url.split('/').filter((part) => part && part !== 'api' && part !== 'v1');
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    for (const part of parts) {
      if (uuidRegex.test(part)) {
        return part;
      }
    }

    return null;
  }
}
