function now() {
  return new Date().toLocaleString();
}
class ConsoleLogger {
  private logMessage(colorCode: string, message: any, ...args: any[]): void {
    // eslint-disable-next-line no-console
    console.log(`\x1b[${colorCode}[Filmomètre ${now()}]\x1b[0m`, message, ...args);
  }

  error(message: any, ...args: any[]): void {
    this.logMessage('91m', message, ...args);
  }
}

export const consoleLogger = new ConsoleLogger();
