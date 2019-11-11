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
        var pollingSpeed = Number(config.pollingSpeed);
        var enableEdgeMode = config.enableEdgeMode;
        var enableDebounce = config.enableDebounce;
        var risingEdgeDelay = Number(config.risingEdgeDelay);
        var fallingEdgeDelay = Number(config.fallingEdgeDelay);

        var lastRead = -1;
        var busy = false;
        var lastRead = parseInt(dio.readDIO(ioPort));
        //var delayTime;

        //the result of first attemp to read io, show error if failed
        if(lastRead<0)
        {
            node.status({ fill: "red", shape:(autoPolling)?"ring":"dot", text: "IO Error" });
        }
        else
        {
            if(!ignoreFirst)
            {
                node.status({ fill: "green", shape:(autoPolling)?"ring":"dot", text: lastRead });
                msg = {};
                msg.payload = lastRead;
                node.send(msg);
            }
        }

        function readDIO(edge)
        {
            res = parseInt(dio.readDIO(ioPort));
            if(res<0)
            {
                node.status({ fill: "red", shape:(autoPolling)?"ring":"dot", text: "IO Error" });
            }
            else
            {
                if(edge)
                {
                    if(res!=lastRead)
                    {
                        lastRead = res;
                        node.status({ fill: "green", shape:(autoPolling)?"ring":"dot", text: res });
                        msg = {};
                        msg.payload = res;
                        node.send(msg);
                    }
                }
                else
                {
                    lastRead = res;
                    node.status({ fill: "green", shape:(autoPolling)?"ring":"dot", text: res });
                    msg = {};
                    msg.payload = res;
                    node.send(msg);
                }
            }
        }

        function polling()
        {
            msg = {};
            res = parseInt(dio.readDIO(ioPort));
            if(res < 0)
            {
                node.status({ fill: "red", shape: "ring", text: "IO Error" });
                //also stop the loop . This may cause the poll STOP WORKING with just one IO Error
                //clearInterval(node.pollLoop);
            }
            else
            {
                if(enableEdgeMode)
                {
                    if( lastRead != res)
                    {
                        if(enableDebounce)
                        {
                            if(!busy)
                            {
                                delayTime = (res>0)?risingEdgeDelay:fallingEdgeDelay;
                                if( lastRead != res)
                                {
                                    busy = true;
                                    setTimeout(function(){
                                        readDIO(enableEdgeMode);
                                        busy = false;
                                    }, delayTime);
                                }
                            }
                        }
                        else
                        {
                            lastRead = res;
                            msg.payload = res;
                            node.send(msg);
                        }
                    }
                }
                else
                {
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
            readDIO(false);
        });
        
        node.on('close',function()
        {
            if(autoPolling)
                clearInterval(node.pollLoop);
            busy = false;
        });
    }
    RED.nodes.registerType("dio-read", dioRead);
}
