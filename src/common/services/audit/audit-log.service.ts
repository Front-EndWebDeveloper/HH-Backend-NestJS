import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../../models/audit/entities/audit-log.entity';

export interface AuditLogData {
  userId?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  description?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status?: 'success' | 'failure' | 'error';
  errorMessage?: string;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Create an audit log entry
   */
  async log(data: AuditLogData): Promise<AuditLog> {
    try {
      const auditLog = this.auditLogRepository.create({
        user_id: data.userId,
        action: data.action,
        resource_type: data.resourceType,
        resource_id: data.resourceId,
        description: data.description,
        metadata: data.metadata,
        ip_address: data.ipAddress,
        user_agent: data.userAgent,
        status: data.status || 'success',
        error_message: data.errorMessage,
      });

      return await this.auditLogRepository.save(auditLog);
    } catch (error) {
      this.logger.error('Failed to create audit log', error);
      // Don't throw - audit logging failure shouldn't break the application
      throw error;
    }
  }

  /**
   * Log authentication event
   */
  async logAuthEvent(
    userId: string,
    action: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'PASSWORD_RESET',
    ipAddress?: string,
    userAgent?: string,
    status: 'success' | 'failure' = 'success',
    errorMessage?: string,
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resourceType: 'AUTH',
      description: `Authentication event: ${action}`,
      ipAddress,
      userAgent,
      status,
      errorMessage,
    });
  }

  /**
   * Log data access event
   */
  async logDataAccess(
    userId: string,
    action: 'READ' | 'CREATE' | 'UPDATE' | 'DELETE',
    resourceType: string,
    resourceId: string,
    ipAddress?: string,
    metadata?: Record<string, any>,
  ): Promise<void> {
    await this.log({
      userId,
      action,
      resourceType,
      resourceId,
      description: `${action} operation on ${resourceType}`,
      ipAddress,
      status: 'success',
      metadata,
    });
  }

  /**
   * Get audit logs for a user
   */
  async getUserAuditLogs(userId: string, limit: number = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get audit logs for a resource
   */
  async getResourceAuditLogs(
    resourceType: string,
    resourceId: string,
    limit: number = 100,
  ): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: {
        resource_type: resourceType,
        resource_id: resourceId,
      },
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
