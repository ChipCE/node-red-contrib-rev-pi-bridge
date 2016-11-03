module.exports = function(RED)
{
	
    function revPiIoReset(config) 
    {
        RED.nodes.createNode(this,config);
        var node = this;
        //load lib
        var ffi = require('ffi');
        var dio = ffi.Library( __dirname + '/revPiIoBridge.so', {
            "resetDIO": ['int', []]
        });

        node.status({ fill: "blue", shape: "dot", text: "Ready" });

        node.on('input', function(msg)
        {
            res = parseInt(dio.resetDIO());
            if(res >= 0)
                node.status({ fill: "green", shape: "dot", text: "Success" });
            else
            {
                node.status({ fill: "red", shape: "dot", text: "Failed" });
                node.error("IO Error : Cannot reset IO");
            }
        });

        node.on('close',function()
        {

        });
    }
    RED.nodes.registerType("rev-pi-io-reset", revPiIoReset);
}