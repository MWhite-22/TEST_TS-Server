declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string;
    SESSION_ID: string;
    SESSION_SECRET: string;
    REDIS_URL: string;
    DATABASE_URL: string;
    FRONTEND_URL: string;
    EMAIL_HOST: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
  }
}
