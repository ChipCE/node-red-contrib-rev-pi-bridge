module.exports = function(RED)
{
	
    function dioRead(config) 
    {
        RED.nodes.createNode(this,config);
        var node = this;
        //libs
        var ffi = require('ffi');
        var dio = ffi.Library( __dirname + '/dioBridge.so', {
            "readDIO": ['int', ['string']]
        });
        //load config
        var ioPort = config.ioPort;
        var ignoreFirst = config.ignoreFirst;
        var autoPolling = config.autoPolling;
        var pollingSpeed = config.pollingSpeed;
        var lastRead = -1;
        lastRead = parseInt(dio.readDIO(ioPort));

        if(lastRead<0)
        {
            node.status({ fill: "red", shape: "dot", text: "IO Error" });
        }
        else
        {
            if(!ignoreFirst)
            {
                node.status({ fill: "green", shape: "dot", text: lastRead });
                msg = {};
                msg.payload = lastRead;
                node.send(msg);
            }
        }

        function readDIO()
        {
            res = parseInt(dio.readDIO(ioPort));
            if(res<0)
            {
                node.status({ fill: "red", shape: "dot", text: "IO Error" });
            }
            else
            {
                node.lastRead = res;
                node.status({ fill: "green", shape: "dot", text: res });
                msg = {};
                msg.payload = res;
                node.send(msg);
            }
        }

        function polling()
        {
            res = parseInt(dio.readDIO(ioPort));
            if(res<0)
            {
                node.status({ fill: "red", shape: "dot", text: "IO Error" });
                //also stop the loop . This may cause the poll STOP WORKING with just one IO Error
                clearInterval(node.pollLoop);
            }
            else
            {
                if( node.lastRead != res)
                {
                    node.lastRead = res;
                    node.status({ fill: "green", shape: "dot", text: res });
                    msg = {};
                    msg.payload = res;
                    node.send(msg);
                }
            }
        }
        
        //only start polling if the test read successed
        if(autoPolling && (lastRead>=0))
            node.pollLoop = setInterval(polling, pollingSpeed);
        

        
        node.on('input', function(msg)
        {
            readDIO(true);
        });
        
        node.on('close',function()
        {
            if(autoPolling)
                clearInterval(node.pollLoop);
        });
    }
    RED.nodes.registerType("dio-read", dioRead);
}