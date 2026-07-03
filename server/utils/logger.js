// Professional Logging Utility for Express backend
const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs.txt');

function log(level, message, meta = '') {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
  const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`;
  
  // Console logging
  console.log(logLine.trim());

  // File logging (non-blocking file write)
  fs.appendFile(logFilePath, logLine, (err) => {
    if (err) {
      console.error('Failed to write log to file:', err);
    }
  });
}

module.exports = {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta)
};
