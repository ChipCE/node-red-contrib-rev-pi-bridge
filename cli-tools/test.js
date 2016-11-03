var dio = require('./dioLib');

var sum = 0;
var lap = 1000;
var start = Date.now();
for(i=0;i<lap;i++)
{
    
    dio.readDIO("CoreLed");
}
console.log("avg = " + (Date.now() - start)/lap + "ms");