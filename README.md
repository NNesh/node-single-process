# Node single process
This is module for starting application just once. If application has been started again, then the new process sending information to first process of application.

#### API

  Import:  
    `import { startSingleProcess } from 'node-single-process'`
  or:  
    `var { startSingleProcess } = require 'node-single-process'`

```
  startSingleProcess(socketName, getSendingData, callbackData);

  This function start local server using UNIX domain socket (IPC). There are follow arguments:
    socketName - name of socket which needs create,
    getSendingData() - callback function which should return string data,
    callbackData(data) - callback function which will receive buffer data

```
##### Example by using [Electron](https://electron.atom.io/ "Site")
```
(function () {
  'use strict'

  const { app } = require('electron');
  const process = require('process');

  console.log('Before export');
  const { startSingleProcess } = require('../lib/node-single-process');

  console.log('Before class');

  class TestApplication {
    constructor(callback) {
      this.data;

      startSingleProcess('test.sock', () => {
        let params = process.argv.splice(2, process.argv.length - 2);
        let line = '';

        params.forEach(function (param) {
          line += param;
        });

        return line;
      }, (d) => {
        callback(d);
      });
    }
  }

  console.log('After class');

  var application = null;

  app.on('ready', function () {
    console.log(process.argv);
    application = new TestApplication(function (data) {
      console.log(data.toString());
    });
  });
}).call(this);
```

### License
Copyright (c) 2017 Ruslan Mullayanov (<mullruslan@yandex.ru>)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
