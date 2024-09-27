// エラーログの処理
export const logError = (message: string, error?: Error) => {
  const logMessage = `[${new Date().toISOString()}] ERROR: ${message}\n${error ? error.stack : ""}\n\n`;
  console.error(logMessage);
};

// インフォメーションログ（任意）
export const logInfo = (message: string) => {
  const logMessage = `[${new Date().toISOString()}] INFO: ${message}\n`;
  console.log(logMessage);
};
