// utils/logger.ts
import winston from 'winston';
import chalk from 'chalk';

// Interfaces para tipado
interface LogContext {
  method: string;
  endpoint: string;
  userId: string;
  executionTime: string;
  requestId?: string;
}

interface LogResponse {
  status: number;
  dataSize: number;
  message?: string;
}

interface LogError {
  name?: string;
  message?: string;
  stack?: string;
}

interface LogPagination {
  page: number;
  totalPages: number;
  recordsCount: number;
  total: number;
}

interface LogInfo {
  timestamp: string;
  level: string;
  message: string;
  response?: LogResponse;
  context?: LogContext;
  pagination?: LogPagination;
  error?: LogError;
  [key: string]: any;
}

// Función para formatear el tamaño de datos de manera más legible
const formatDataSize = (size: number): string => {
  if (size === 0) return '0B';
  if (size < 1024) return `${size}B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
};

// Función para obtener emoji según el status
const getStatusEmoji = (status: number): string => {
  if (status >= 200 && status < 300) return '✅';
  if (status >= 300 && status < 400) return '🔀';
  if (status >= 400 && status < 500) return '⚠️ ';
  if (status >= 500) return '❌';
  return '📝';
};

// Función para colorear según el status
const colorizeStatus = (status: number, text: string): string => {
  if (status >= 200 && status < 300) return chalk.green(text);
  if (status >= 300 && status < 400) return chalk.cyan(text);
  if (status >= 400 && status < 500) return chalk.yellow(text);
  if (status >= 500) return chalk.red(text);
  return chalk.white(text);
};

// Función para colorear el método HTTP
const colorizeMethod = (method: string): string => {
  switch (method?.toUpperCase()) {
    case 'GET': return chalk.blue(method);
    case 'POST': return chalk.green(method);
    case 'PUT': return chalk.yellow(method);
    case 'DELETE': return chalk.red(method);
    case 'PATCH': return chalk.magenta(method);
    default: return chalk.white(method);
  }
};

// Función para formatear el tiempo de ejecución con color
const formatExecutionTime = (time: string): string => {
  const timeNum = parseInt(time);
  if (isNaN(timeNum)) return chalk.gray(time);
  
  if (timeNum < 100) return chalk.green(time);
  if (timeNum < 500) return chalk.yellow(time);
  if (timeNum < 1000) return chalk.red(time);
  return chalk.red(time);
};

// FORMATO PRINCIPAL - Este es el que arregla el problema
const consoleFormat = winston.format.printf((info: any) => {
  const { timestamp, level, message, response, context, pagination, error, ...rest } = info;
  
  // Manejo de errores
  if (level === 'error' && error && context) {
    const emoji = '💥';
    const method = colorizeMethod(context.method);
    const endpoint = chalk.cyan(context.endpoint);
    const userId = context.userId === 'anonymous' ? chalk.gray('anonymous') : chalk.blue(context.userId);
    const executionTime = chalk.red(context.executionTime);
    const errorName = chalk.red.bold(error.name || 'Error');
    const errorMsg = chalk.red(error.message || 'Unknown error');
    
    let logLine = `${chalk.gray(timestamp)} ${emoji} ${chalk.red('ERROR')} ${method} ${endpoint}`;
    logLine += ` │ User: ${userId}`;
    logLine += ` │ Time: ${executionTime}`;
    logLine += `\n${chalk.red('┌─')} ${errorName}: ${errorMsg}`;
    
    if (context.requestId) {
      logLine += `\n${chalk.red('│')} RequestID: ${chalk.gray(context.requestId)}`;
    }
    
    if (error.stack && process.env.NODE_ENV !== 'production') {
      const stackLines = error.stack.split('\n').slice(1, 4);
      stackLines.forEach((line: string) => {
        logLine += `\n${chalk.red('│')} ${chalk.gray(line.trim())}`;
      });
    }
    
    logLine += `\n${chalk.red('└─')}`;
    return logLine;
  }
  
  // Manejo de respuestas exitosas
  if (response && context) {
    const emoji = getStatusEmoji(response.status);
    const statusText = colorizeStatus(response.status, `${response.status}`);
    const method = colorizeMethod(context.method);
    const endpoint = chalk.cyan(context.endpoint);
    const userId = context.userId === 'anonymous' ? chalk.gray('anonymous') : chalk.blue(context.userId);
    const executionTime = formatExecutionTime(context.executionTime);
    const dataSize = chalk.magenta(formatDataSize(response.dataSize));
    
    let logLine = `${chalk.gray(timestamp)} ${emoji} ${statusText} ${method} ${endpoint}`;
    logLine += ` │ User: ${userId}`;
    logLine += ` │ Time: ${executionTime}`;
    logLine += ` │ Size: ${dataSize}`;
    
    if (pagination) {
      const pageInfo = chalk.yellow(`Page ${pagination.page}/${pagination.totalPages} (${pagination.recordsCount}/${pagination.total})`);
      logLine += ` │ ${pageInfo}`;
    }
    
    if (response.message && response.message !== 'Operación exitosa') {
      logLine += ` │ ${chalk.italic(response.message)}`;
    }
    
    return logLine;
  }
  
  // Formato por defecto para otros logs
  const levelColor = level === 'info' ? chalk.blue : 
                    level === 'warn' ? chalk.yellow : 
                    level === 'error' ? chalk.red : chalk.white;
  
  let logLine = `${chalk.gray(timestamp)} ${levelColor(`[${level.toUpperCase()}]`)} ${message}`;
  
  // Si hay metadata adicional, mostrarla de forma limpia
  if (Object.keys(rest).length > 0) {
    logLine += `\n${chalk.gray(JSON.stringify(rest, null, 2))}`;
  }
  
  return logLine;
});

// Formato para archivos (sin colores)
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Formato para métricas específicas
const metricsFormat = winston.format.printf((info: any) => {
  const { timestamp, response, context, pagination } = info;
  
  if (response && context) {
    let metricsLine = `${timestamp} | ${context.method} ${context.endpoint}`;
    metricsLine += ` | Status: ${response.status}`;
    metricsLine += ` | User: ${context.userId}`;
    metricsLine += ` | Time: ${context.executionTime}`;
    metricsLine += ` | Size: ${formatDataSize(response.dataSize)}`;
    
    if (pagination) {
      metricsLine += ` | Records: ${pagination.recordsCount}/${pagination.total}`;
    }
    
    if (context.requestId) {
      metricsLine += ` | ReqID: ${context.requestId}`;
    }
    
    return metricsLine;
  }
  
  return `${timestamp} | ${info.level.toUpperCase()} | ${info.message}`;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: fileFormat,
  transports: [
    // Archivo de errores
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      format: fileFormat
    }),
    
    // Archivo combinado
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      format: fileFormat
    }),
    
    // Archivo específico para métricas de performance
    new winston.transports.File({ 
      filename: 'logs/metrics.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        metricsFormat
      )
    })
  ],
});

// Solo loguea en consola si no estás en producción
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      consoleFormat
    ),
  }));
}

// Función helper para logs de desarrollo
export const devLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(chalk.cyan('🔧 DEV:'), message, data ? chalk.gray(JSON.stringify(data, null, 2)) : '');
  }
};

// Función helper para logs de debug
export const debugLog = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production' && process.env.DEBUG === 'true') {
    console.log(chalk.magenta('🐛 DEBUG:'), message, data ? chalk.gray(JSON.stringify(data, null, 2)) : '');
  }
};