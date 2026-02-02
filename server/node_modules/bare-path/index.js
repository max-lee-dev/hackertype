const os = require('bare-os')
const posix = require('./lib/posix')
const win32 = require('./lib/win32')

module.exports = os.platform() === 'win32' ? win32 : posix
