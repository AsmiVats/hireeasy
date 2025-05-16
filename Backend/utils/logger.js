import chalk from 'chalk';

// Define log types with their colors
const logTypes = {
  info: chalk.blue,
  success: chalk.green,
  warning: chalk.yellow,
  error: chalk.red,
  request: chalk.cyan,
  response: chalk.magenta,
  auth: chalk.hex('#FFA500'), // Orange for auth related logs
  api: chalk.hex('#1E90FF'), // DodgerBlue for API related logs
  db: chalk.hex('#8A2BE2'), // BlueViolet for database related logs
  search: chalk.hex('#4ce22b')//
};

// Format the timestamp
const timestamp = () => {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
};

// Create the logger
const logger = {
  /**
   * Log general information
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  info: (message, data) => {
    console.log(
      `${chalk.gray(timestamp())} ${logTypes.info('INFO')} ${message}`,
      data ? data : ''
    );
  },

  /**
   * Log success messages
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  success: (message, data) => {
    console.log(
      `${chalk.gray(timestamp())} ${logTypes.success('SUCCESS')} ${message}`,
      data ? data : ''
    );
  },

  /**
   * Log warning messages
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  warning: (message, data) => {
    console.log(
      `${chalk.gray(timestamp())} ${logTypes.warning('WARNING')} ${message}`,
      data ? data : ''
    );
  },

  /**
   * Log error messages
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  error: (message, data) => {
    console.log(
      `${chalk.gray(timestamp())} ${logTypes.error('ERROR')} ${message}`,
      data ? data : ''
    );
  },

  /**
   * Log HTTP requests
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {string} ip - Client IP address
   */
  request: (method, url, ip) => {
    console.log(
      `${chalk.gray(timestamp())} ${logTypes.request('REQUEST')} ${chalk.bold(method)} ${url} ${chalk.gray(`from ${ip}`)}`
    );
  },

  /**
   * Log HTTP responses
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {number} status - HTTP status code
   * @param {number} duration - Request duration in ms
   */
  response: (method, url, status, duration) => {
    let statusColor;
    if (status >= 500) {
      statusColor = chalk.red(status);
    } else if (status >= 400) {
      statusColor = chalk.yellow(status);
    } else if (status >= 300) {
      statusColor = chalk.cyan(status);
    } else if (status >= 200) {
      statusColor = chalk.green(status);
    } else {
      statusColor = chalk.white(status);
    }

    console.log(
      `${chalk.gray(timestamp())} ${logTypes.response('RESPONSE')} ${chalk.bold(method)} ${url} ${statusColor} ${chalk.gray(`${duration}ms`)}`
    );
  },

  /**
   * Log authentication related messages
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  auth: (message, data) => {
    console.log(
      `${chalk.gray(timestamp())} ${logTypes.auth('AUTH')} ${message}`,
      data ? data : ''
    );
  },

  /**
   * Log API related messages
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  api: (message, data) => {
    console.log(
      `${chalk.gray(timestamp())} ${logTypes.api('API')} ${message}`,
      data ? data : ''
    );
  },

  /**
   * Log database related messages
   * @param {string} message - The message to log
   * @param {any} data - Optional data to log
   */
  db: (message, data) => {
    console.log(
      `${chalk.gray(timestamp())} ${logTypes.db('DB')} ${message}`,
      data ? data : ''
    );
  },

  search: (message, data) => { 
    console.log(`${chalk.gray(timestamp())} ${logTypes.db('search')} ${message}`,
      data ? data : '')
  }
};

export default logger; 