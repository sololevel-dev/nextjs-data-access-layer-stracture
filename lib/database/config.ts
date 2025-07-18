// Database configuration and connection management

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  connectionTimeout?: number;
  maxConnections?: number;
}

export class DatabaseConnection {
  private static instance: DatabaseConnection;
  private config: DatabaseConfig;
  private isConnected: boolean = false;

  private constructor() {
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'app_db',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'password',
      ssl: process.env.NODE_ENV === 'production',
      connectionTimeout: 10000,
      maxConnections: 10,
    };
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  public async connect(): Promise<void> {
    try {
      // In a real application, this would establish actual database connection
      // For demo purposes, we'll simulate connection
      console.log('Connecting to database...');
      console.log(`Host: ${this.config.host}:${this.config.port}`);
      console.log(`Database: ${this.config.database}`);
      
      // Simulate async connection
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.isConnected = true;
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      throw new Error('Failed to connect to database');
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      // Simulate disconnection
      await new Promise(resolve => setTimeout(resolve, 50));
      this.isConnected = false;
      console.log('Database disconnected');
    }
  }

  public isConnectionActive(): boolean {
    return this.isConnected;
  }

  public getConfig(): DatabaseConfig {
    return { ...this.config };
  }
}

// Database utility functions
export class DatabaseUtils {
  public static generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  public static getCurrentTimestamp(): Date {
    return new Date();
  }

  public static validateConnection(): boolean {
    const db = DatabaseConnection.getInstance();
    return db.isConnectionActive();
  }
}