export interface ServerApp {
  start(): Promise<void>;
  close(): Promise<void>;
}