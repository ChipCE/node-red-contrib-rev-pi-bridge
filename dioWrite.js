module.exports = function(RED)
{
    function dioWrite(config) 
    {
    
        RED.nodes.createNode(this,config);
        var node = this;
        var ioPort = config.ioPort;
        var enableDefault = config.enableDefault;
        var defaultValue = config.defaultValue;
        
        var ffi = require('ffi');
        var dio = ffi.Library( __dirname + '/dioBridge.so', {
            "writeDIO": ['int', ['string', 'uint32']],
        });

        //default
        if(enableDefault)
        {
            //maybe put dome delay here
            res = parseInt(dio.writeDIO(ioPort,parseInt(defaultValue)));
            if(res >= 0)
                node.status({ fill: "green", shape: "dot", text: defaultValue });
            else
                node.status({ fill: "red", shape: "dot", text: "IO Error" });
        }

        node.on('input', function(msg)
        {
            if(Number.isInteger(msg.payload))
            {
                res = parseInt(dio.writeDIO(ioPort,parseInt(msg.payload)));
                if(res >= 0)
                    node.status({ fill: "green", shape: "dot", text: msg.payload });
                else
                    node.status({ fill: "red", shape: "dot", text: "IO Error" });
            }
            else
            {
                node.status({ fill: "yellow", shape: "dot", text: "Invalid value" });
            }
        });

        node.on('close',function()
        {
            node.status({});
        });
    }
    RED.nodes.registerType("dio-write", dioWrite);
}