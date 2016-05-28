import * as fs from 'fs';

import { Opts } from './interfaces';
import presets from './presets';

/**
 * Validate a commit message according to preset
 * @param  {string} message The commit message
 * @param  {object} options
 * @return {boolean} Whether or not the message was valid
 */
const validateMessage = function(message: string, options: Opts = {}): boolean {
  if (!message) {
    return false;
  }

  message = message.trim();

  options = (<any>Object).assign({
    preset: 'angular'
  }, options);

  const preset = presets[options.preset];

  if (!preset) {
    throw new Error(`Preset '${options.preset}' does not exist. A preset must be provided`);
  }

  const {validate, ignorePattern} = preset;

  if (ignorePattern && ignorePattern.test(message)) {
    if (process.env.SILENT === 'true' || !process.env.SILENT) {
      console.warn('Commit message validation ignored.');
    }

    return true;
  }

  return validate(message);
};

/**
 * @private
 * Convert a buffer to a string
 * @param  {Buffer} buffer
 * @return {string}
 */
const getMessageFromBuffer = function(buffer: Buffer): string {
  return buffer.toString();
};

/**
 * Validate a commit message from a file - e.g., for a pre-commit hook
 * @param {string} file The file to be read in
 * @param {object} options
 * @return {boolean}
 */
const validateMessageFromFile = function(file: string, options: Opts = {}) {
  const buffer = fs.readFileSync(file);
  const message = getMessageFromBuffer(buffer);

  return validateMessage(message, options);
};

export {
  validateMessage,
  validateMessageFromFile
};
