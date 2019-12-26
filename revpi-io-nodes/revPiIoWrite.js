module.exports = function(RED)
{
    function revPiIoWrite(config) 
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
            writeValue = parseInt(defaultValue);
            if(!isNaN(writeValue))
            {
                res = parseInt(dio.writeDIO(ioPort,writeValue));
                if(res >= 0)
                    node.status({ fill: "blue", shape: writeValue>0?"dot":"ring", text: defaultValue });
                else
                {
                    node.status({ fill: "red", shape: "dot", text: "IO Error" });
                    node.error("IO Error : Cannot write value : " + defaultValue);
                }
            }
            else
            {
                node.status({ fill: "yellow", shape: "dot", text: "Invalid value" });
                node.warn("Invalid default value : " + defaultValue);
            }
        }

        node.on('input', function(msg)
        {
            writeValue = parseInt(msg.payload);
            if(!isNaN(writeValue))
            {
                res = parseInt(dio.writeDIO(ioPort,writeValue));
                if(res >= 0)
                    node.status({ fill: "green", shape: writeValue>0?"dot":"ring", text: msg.payload });
                else
                {
                    node.status({ fill: "red", shape: "dot", text: "IO Error" });
                    node.error("IO Error : Cannot write value : " + defaultValue);
                }
            }
            else
            {
                node.status({ fill: "yellow", shape: "dot", text: "Invalid value" });
                node.warn("Invalid value : " + msg.payload);
            }
        });

        node.on('close',function()
        {
            node.status({});
        });
    }
    RED.nodes.registerType("rev-pi-io-write", revPiIoWrite);
}