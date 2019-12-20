module.exports = function(RED)
{
	
    function revPiIoRead(config) 
    {
        RED.nodes.createNode(this,config);
        var node = this;
        // libs
        var ffi = require('ffi');
        var dio = ffi.Library( __dirname + '/dioBridge.so', {
            "readDIO": ['int', ['string']]
        });
        // load config
        var ioPort = config.ioPort;
        var updateRate = config.updateRate;
        var ignoreFirst = config.ignoreFirst;
        var pollingMode = config.pollingMode;
        var intervalPollingSpeed = Number(config.intervalPollingSpeed);
        var enableDebounce = config.enableDebounce;
        var risingEdgeDelay = Number(config.risingEdgeDelay);
        var fallingEdgeDelay = Number(config.fallingEdgeDelay);
        var enableCounter = config.enableCounter;

        // data
        var upCounter = 0;
        var downCounter = 0;
        var lastRead = -1;
        var lastChanged = 0;
        var ioState = -1;
        var ioError = false;

        // args
        var indicatorShape;
        (pollingMode=="none")?indicatorShape="dot":indicatorShape="ring";

        lastRead = parseInt(dio.readDIO(ioPort));
        if(lastRead<0)
        {
            node.status({ fill: "red", shape:"dot", text: "IO Error" });
            node.error(ioPort + " IO error");
            ioError = true;
            ioState = -1;
        }
        else
        {
            ioState = lastRead;
            if(!ignoreFirst)
            {
                node.status({ fill: "blue", shape:indicatorShape, text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
                msg = {};
                msg.payload = ioState;
                msg.ioPort = ioPort;
                if(enableCounter)
                {
                    msg.upCounter = upCounter;
                    msg.downCounter = downCounter;
                }
                node.send(msg);
            }
            else
            {
                node.status({ fill: "blue", shape:indicatorShape, text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
            }
        }

        function polling()
        {
            // Only send ouput if ioRead success
            if(ioState >= 0)
            {
                node.status({ fill: "green", shape: "ring", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
                msg = {};
                msg.payload = ioState;
                msg.ioPort = ioPort;
                if(enableCounter)
                {
                    msg.upCounter = upCounter;
                    msg.downCounter = downCounter;
                }
                node.send(msg);
            }
        }

        function ioPolling()
        {
            res = parseInt(dio.readDIO(ioPort));
            if(res < 0)
            {
                // only execute once after error occured
                if (!ioError)
                {
                    node.status({ fill: "red", shape:indicatorShape, text: "IO Error" });
                    node.error("io error");
                    ioError = true;
                    ioState = -1;
                }
            }
            else
            {
                ioError = false;

                if(lastRead != res)
                {
                    lastRead = res;
                    lastChanged = new Date().getTime();
                    node.debug("IO read : " + res);
                }

                // count     for rising and falling edge
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

                            //test
                            if(pollingMode=="edge")
                            {
                                node.status({ fill: "green", shape: "ring", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
                                msg = {};
                                msg.payload = ioState;
                                msg.ioPort = ioPort;
                                if(enableCounter)
                                {
                                    msg.upCounter = upCounter;
                                    msg.downCounter = downCounter;
                                }
                                node.send(msg);
                            }
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

                        //test
                        if(pollingMode=="edge")
                        {
                            node.status({ fill: "green", shape: "ring", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
                            msg = {};
                            msg.payload = ioState;
                            msg.ioPort = ioPort;
                            if(enableCounter)
                            {
                                msg.upCounter = upCounter;
                                msg.downCounter = downCounter;
                            }
                            node.send(msg);
                        }
                    }
                }
            }
        }
        
        
        //only start polling if the test read successed
        if(pollingMode=="interval" && (lastRead>=0))
            node.pollLoop = setInterval(polling, intervalPollingSpeed);

        // iopool always runiing in background
        if(lastRead>=0)
            node.ioPollLop = setInterval(ioPolling, updateRate);
        
 
        node.on('input', function(msg)
        {
            if(ioState >= 0)
            {
                node.status({ fill: "green", shape: "dot", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });
                //msg = {};
                msg.payload = ioState;
                msg.ioPort = ioPort;
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
            if(pollingMode=="interval")
                clearInterval(node.pollLoop);
            clearInterval(node.ioPollLop);
            upCounter = 0;
            downCounter = 0;
            lastRead = -1;
            lastChanged = 0;
            ioState = -1;
        });
    }
    RED.nodes.registerType("rev-pi-io-read", revPiIoRead);
}
