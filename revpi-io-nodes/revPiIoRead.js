module.exports = function(RED)
{
    function revPiIoRead(config) 
    {
        RED.nodes.createNode(this,config);
        var node = this;
        // libs
        var ffi = require('ffi');
        var dio = ffi.Library( __dirname + '/revPiIoBridge.so', {
            "readDIO": ['int', ['string']]
        });
        // load config
        var ioPort = config.ioPort;
        var updateRate = config.updateRate;
        var skipInitVal = config.skipInitVal;
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
        var firstRead = true;

        node.status({ fill: "blue", shape:"dot", text: "Ready" });

        function polling()
        {
            // Only send ouput if ioRead success
            if(ioState >= 0)
            {
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
                    node.status({ fill: "red", shape:"dot", text: "IO Error" });
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

                if(enableDebounce)
                {
                    debounceTime = (res>0)?risingEdgeDelay:fallingEdgeDelay;
                    triggerTime = new Date().getTime() - lastChanged;
                    if(triggerTime > debounceTime)
                    {
                        if(ioState!=res)
                        {
                            if(!firstRead)
                                (res>0)?upCounter++:downCounter++;
                            ioState = res;
                            node.log("IO " + ioPort + " state changed : " + ioState + " (" + triggerTime + "ms)");
                            node.status({ fill: "green", shape: ioState>0?"dot":"ring", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });

                            //test
                            if(pollingMode=="edge" && !(skipInitVal && firstRead))
                            {
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
                            if(firstRead)
                                firstRead = !firstRead;
                        }
                    }
                }
                else
                {
                    if(ioState!=res)
                    {
                        if(!firstRead)
                            (res>0)?upCounter++:downCounter++;
                        ioState = res;
                        node.log("IO state changed : " + ioState + " (" + (new Date().getTime() - lastChanged) + "ms)");
                        node.status({ fill: "green", shape: ioState>0?"dot":"ring", text: enableCounter? "" + ioState + " [" + upCounter + "/" + downCounter + "]":ioState });

                        //test
                        if(pollingMode=="edge" && !(skipInitVal && firstRead))
                        {
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
                        if(firstRead)
                            firstRead = !firstRead;
                    }
                }
            }
        }

        //only start polling if the test read successed
        if(pollingMode=="interval")
            node.pollLoop = setInterval(polling, intervalPollingSpeed);

        // iopool always runiing in background
        node.ioPollLoop = setInterval(ioPolling, updateRate);
 
        node.on('input', function(msg)
        {
            if(ioState >= 0)
            {
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
            clearInterval(node.ioPollLoop);
            upCounter = 0;
            downCounter = 0;
            lastRead = -1;
            lastChanged = 0;
            ioState = -1;
        });
    }
    RED.nodes.registerType("rev-pi-io-read", revPiIoRead);
}
