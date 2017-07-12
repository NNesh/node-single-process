(function () {
  const net = require('net');
  const process = require('process');
  const os = require('os');
  const path = require('path');
  const fs = require('fs');


  function createServer(socket, callbackData) {
    net.createServer((connection) => {
      connection.on('data', (data) => {
        callbackData(data);
      });
    }).listen(socket);
  }

  function clearConnection(path) {
    if (process.platform === 'win32') return;

    try {
      fs.accessSync(path, fs.constants.F_OK);
      fs.unlinkSync(path);
    }
    catch (error) {}
  }

  /*
    This function start local server using UNIX domain socket (IPC). There are follow arguments:
      socketName - name of socket which needs create,
      getSendingData() - callback function which should return string data,
      callbackData(data) - callback function which will receive buffer data
  */
  var startSingleProcess = function (socketName, getSendingData, callbackData) {
    if ((typeof socketName !== 'string') || (typeof getSendingData !== 'function') || (typeof callbackData !== 'function')) throw 'Error';

    let socket = (process.platform === 'win32') ? ('\\\\.\\pipe\\' + socketName) : path.join(os.tmpdir(), socketName);

    let connection = net.createConnection({ path: socket }, () => {
      connection.write(getSendingData());
    }).on('error', (error) => {
      clearConnection(socket);
      createServer(socket, callbackData);
    });
  }

  module.exports = {
    startSingleProcess: startSingleProcess
  }
}).call(this);
