// utils/logger.ts
import winston from 'winston';

// Formato personalizado para métricas
const metricsFormat = winston.format.printf(({ timestamp, level, message, ...meta }) => {
  const metaData = meta as any; // Cast para evitar errores de TypeScript
  if (metaData.response || metaData.pagination) {
    return `${timestamp} [${level.toUpperCase()}] ${message} | Endpoint: ${metaData.context?.endpoint || 'unknown'} | User: ${metaData.context?.userId || 'anonymous'} | Time: ${metaData.context?.executionTime || 'unknown'} | Status: ${metaData.response?.status || 'unknown'} | DataSize: ${metaData.response?.dataSize || 0}B`;
  }
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    // Archivo específico para métricas de performance
    new winston.transports.File({ 
      filename: 'logs/metrics.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ],
});

// Solo loguea en consola si no estás en producción
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.colorize(),
      metricsFormat
    ),
  }));
}
