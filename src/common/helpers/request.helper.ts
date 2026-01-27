import { FastifyRequest } from 'fastify';

export class RequestHelper {
  static getClientIp(request: FastifyRequest): string {
    const forwarded = request.headers['x-forwarded-for'];
    if (forwarded) {
      return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    }
    return request.ip || request.socket.remoteAddress || 'unknown';
  }

  static getUserAgent(request: FastifyRequest): string {
    return request.headers['user-agent'] || 'unknown';
  }
}
