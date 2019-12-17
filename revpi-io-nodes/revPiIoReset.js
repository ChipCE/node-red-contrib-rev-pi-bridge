module.exports = function(RED)
{
	
    function revPiIoReset(config) 
    {
        RED.nodes.createNode(this,config);
        var node = this;
        var autoReset = config.autoReset;
        
        //load lib
        var ffi = require('ffi');
        var dio = ffi.Library( __dirname + '/dioBridge.so', {
            "resetDIO": ['int', []]
        });

        if(autoReset)
        {
            res = parseInt(dio.resetDIO());
            if(res >= 0)
                node.status({ fill: "green", shape: "dot", text: "Init:Success" });
            else
                node.status({ fill: "red", shape: "dot", text: "Init:Failed" });
        }
        else
        {
            node.status({ fill: "green", shape: "dot", text: "Ready" });
        }

        
        node.on('input', function(msg)
        {
            res = parseInt(dio.resetDIO());
            if(res >= 0)
                node.status({ fill: "green", shape: "dot", text: "Success" });
            else
                node.status({ fill: "red", shape: "dot", text: "Failed" });
        });

        node.on('close',function()
        {
            if(autoReset)
            {
                res = parseInt(dio.resetDIO());
                if(res >= 0)
                    node.status({ fill: "green", shape: "dot", text: "Init:Success" });
                else
                    node.status({ fill: "red", shape: "dot", text: "Init:Failed" });
            }
            else
            {
                node.status({ fill: "green", shape: "dot", text: "Ready" });
            }
        });
    }
    RED.nodes.registerType("rev-pi-io-reset", revPiIoReset);
}