/*
(The MIT License)

Copyright (c) 2014 TJ Holowaychuk <tj@vision-media.ca>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software
and associated documentation files (the 'Software'), to deal in the Software without restriction,
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Taken from
// https://github.com/visionmedia/debug/blob/285dfe10a5c06d4a86176b54bef2d7591eedaf40/src/node.js#L23
// and
// https://github.com/visionmedia/debug/blob/285dfe10a5c06d4a86176b54bef2d7591eedaf40/src/common.js#L46

export let colors = [ 6, 2, 3, 4, 5, 1 ];   // named terminal colors
try {
  var supportsColor = require('supports-color');
  if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
    // 8-bit color codes
    colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // `supports-color` is optional, just use named colors if it's not available
}

export function choose(name: string) {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash  = ((hash << 5) - hash) + name.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return colors[Math.abs(hash) % colors.length];
};

