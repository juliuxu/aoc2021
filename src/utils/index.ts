/**
 * Root for your util libraries.
 *
 * You can import them in the src/template/index.ts,
 * or in the specific file.
 *
 * Note that this repo uses ES Modules, so you have to explicitly specify
 * .js extension (yes, .js not .ts - even for TypeScript files)
 * for imports that are not imported from node_modules.
 *
 * For example:
 *
 *   correct:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.js'
 *     import { myUtil } from '../utils/index.js'
 *
 *   incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib.ts'
 *     import { myUtil } from '../utils/index.ts'
 *
 *   also incorrect:
 *
 *     import _ from 'lodash'
 *     import myLib from '../utils/myLib'
 *     import { myUtil } from '../utils'
 *
 */
export const sum = (numbers: number[]) =>
  numbers.reduce((acc, x) => acc + x, 0);
export const multiply = (numbers: number[]) =>
  numbers.reduce((acc, x) => acc * x, 1);
export const max = (numbers: number[]) =>
  numbers.reduce((a, b) => Math.max(a, b));

export function memo<A, B>(f: (...args: A[]) => B): (args: A) => B {
  const d: Record<string, B> = {};
  return (...args: A[]) => {
    const key = JSON.stringify(args);
    if (!(key in d)) d[key] = f(...args);
    return d[key];
  };
}
