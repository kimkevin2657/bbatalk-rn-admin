const { createLogger, format, transports } = require("winston");
const DailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tsFormat = () => (new Date()).toLocaleTimeString();

//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
let logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss"
    }),
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      )
    }),
    new DailyRotateFile({
      filename: `${logDir}/server-%DATE%.log`,
      format: format.combine(
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
      datePattern: 'YYMMDD',
      prepend: true
    })
  ]
});

module.exports = logger
