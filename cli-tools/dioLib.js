var ffi = require('ffi');
//var ref = require('ref');
var int = ref.types.int;

var dioBridgeLib = null;

dioBridgeLib = './dioBridge.so';


var dioLib = ffi.Library(dioBridgeLib, {
    "writeDIO": ['int', ['string', 'uint32']],
    "readDIO": ['int', ['string']],
    "resetDIO": ['int', ['void']]
});

//dioLib.readDIO("CoreLed");
//dioLib.writeDIO("CoreLed",3);
//dioLib.readDIO("CoreLed");

module.exports = dioLib;
