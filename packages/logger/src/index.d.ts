import winston from 'winston';
export declare const logger: winston.Logger;
export declare const createScopedLogger: (moduleName: string) => {
    debug: (msg: string, meta?: Record<string, unknown>) => winston.Logger;
    info: (msg: string, meta?: Record<string, unknown>) => winston.Logger;
    warn: (msg: string, meta?: Record<string, unknown>) => winston.Logger;
    error: (msg: string, meta?: Record<string, unknown>) => winston.Logger;
    fatal: (msg: string, meta?: Record<string, unknown>) => winston.Logger;
};
//# sourceMappingURL=index.d.ts.map