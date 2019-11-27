module.exports = function(RED)
{
	
    function revPiIoRead(config) 
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
        var updateRate = config.updateRate;
        var ignoreFirst = config.ignoreFirst;
        var autoPolling = config.autoPolling;
        var pollingSpeed = Number(config.pollingSpeed);
        var enableEdgeMode = config.enableEdgeMode;
        var enableDebounce = config.enableDebounce;
        var risingEdgeDelay = Number(config.risingEdgeDelay);
        var fallingEdgeDelay = Number(config.fallingEdgeDelay);
        var enableCounter = config.enableCounter;

        var upCounter = 0;
        var downCounter = 0;
        var lastRead = -1;
        var lastChanged = 0;
        var ioState = -1;
        var lastSend = -1;
        //new Date().getTime()

        lastRead = parseInt(dio.readDIO(ioPort));
        if(lastRead<0)
        {
            node.status({ fill: "red", shape:(autoPolling)?"ring":"dot", text: "IO Error" });
        }
        else
        {
            ioState = lastRead;
            lastSend = ioState;
            if(!ignoreFirst)
            {
                node.status({ fill: "blue", shape:(autoPolling)?"ring":"dot", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
                msg = {};
                msg.payload = ioState;
                node.send(msg);
            }
            else
            {
                node.status({ fill: "blue", shape:(autoPolling)?"ring":"dot", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
            }
        }

        function polling()
        {
            msg = {};
            // Only send ouput if ioRead success
            if(ioState >= 0)
            {
                if(enableEdgeMode)
                {
                    if(lastSend != ioState)
                    {
                        lastSend = ioState;
                        node.status({ fill: "green", shape: "ring", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
                        
                        msg.payload = ioState;
                        if(enableCounter)
                        {
                            msg.upCounter = upCounter;
                            msg.downCounter = downCounter;
                        }
                        node.send(msg);
                    }
                }
                else
                {
                    node.status({ fill: "green", shape: "ring", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
                    msg.payload = ioState;
                    if(enableCounter)
                    {
                        msg.upCounter = upCounter;
                        msg.downCounter = downCounter;
                    }
                    node.send(msg);
                }
            }
        }

        function ioPolling()
        {
            msg = {};
            res = parseInt(dio.readDIO(ioPort));
            if(res < 0)
            {
                node.status({ fill: "red", shape:(autoPolling)?"ring":"dot", text: "IO Error" });
                //node.warn("io error");
                ioState = -1;
                lastSend = -1;
            }
            else
            {
                if(lastRead != res)
                {
                    lastRead = res;
                    lastChanged = new Date().getTime();
                    node.log("IO read : " + res);
                }

                // cond for rising and falling edge
                if(enableDebounce)
                {
                    debounceTime = (res>0)?risingEdgeDelay:fallingEdgeDelay;
                    triggerTime = new Date().getTime() - lastChanged;
                    if(triggerTime > debounceTime)
                    {
                        if(ioState!=res)
                        {
                            (res>0)?upCounter++:downCounter++;
                            ioState = res;
                            node.log("IO " + ioPort +" state changed : " + ioState + " (" + triggerTime + "ms)");
                        }
                    }
                }
                else
                {
                    if(ioState!=res)
                    {
                        (res>0)?upCounter++:downCounter++;
                        ioState = res;
                        node.log("IO state changed : " + ioState + " (" + (new Date().getTime() - lastChanged) + "ms)");
                    }
                }
            }
        }
        
        //only start polling if the test read successed
        if(autoPolling && (lastRead>=0))
            node.pollLoop = setInterval(polling, pollingSpeed);

        // iopool always runiing in background
        if(lastRead>=0)
            node.ioPollLop = setInterval(ioPolling, updateRate);
        
 
        node.on('input', function(msg)
        {
            if(ioState >= 0)
            {
                node.status({ fill: "green", shape: "dot", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
                msg.payload = ioState;
                if(enableCounter)
                {
                    msg.upCounter = upCounter;
                    msg.downCounter = downCounter;
                }
                node.send(msg);
            }
        });
        
        node.on('close',function()
        {
            if(autoPolling)
                clearInterval(node.pollLoop);
            clearInterval(node.ioPollLop);
            upCounter = 0;
            downCounter = 0;
            lastRead = -1;
            lastChanged = 0;
            ioState = -1;
            lastSend = -1;
        });
    }
    RED.nodes.registerType("rev-pi-io-read", revPiIoRead);
}
