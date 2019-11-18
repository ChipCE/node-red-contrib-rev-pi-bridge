# rev-pi-nodered-bridge

Access Revolution Pi IO using nodered and IO-name.  
Require nodejs v11. This node does not support node v12 yet due it's dependencie FFI cannot be compiled with node v12. 


![alt text](https://raw.githubusercontent.com/ChipTechno/node-red-contrib-rev-pi-bridge/master/img/review.png "Review")
## revPiIoRead

- IO Port : <code>string</code> IO port name.  
- Update rate : <code>int</code> IO refresh interval(ms). Due to hardware and software limit, DO NOT set this value too low. Value higher than 10ms is recommended.  
- Ignore first : <code>bool</code> Skip sending the init value.  
- Counter : <code>bool</code> Enable rising edge and falling edge counter.  
- Polling rate : <code>int</code> Pooling send interval(ms).  
- Auto Polling : <code>bool</code> Auto send output after interval(ms).  
- Polling rate : <code>int</code> Pooling send interval(ms).  
- Edge mode : <code>bool</code> Only send ouput if the IO state changed.  
- Debounce : <code>bool</code> Enable software debounce.  
- Rising Edge : <code>int</code> Debounce threshold for rising edge(ms).  
- Falling Edge : <code>int</code> Debounce threshold for falling edge(ms).  

## revPiIoWrite

- IO Port : <code>string</code> IO port name.  
- Set default : <code>bool</code> Enable IO default value.  
- Value : <code>int</code> Default value.  

## revPiIoReset

- On deploy : <code>bool</code> Reset IO on deploy and node-red startup.  

## Examples

<pre>
[{"id":"d2c240c4.561b5","type":"rev-pi-io-write","z":"8c8a3ee9.31c5e","name":"","ioPort":"RevPiLED","enableDefault":true,"defaultValue":0,"x":410,"y":160,"wires":[]},{"id":"39177075.739a98","type":"inject","z":"8c8a3ee9.31c5e","name":"","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":210,"y":160,"wires":[["d2c240c4.561b5"]]},{"id":"589ad37.da1ccac","type":"rev-pi-io-reset","z":"8c8a3ee9.31c5e","name":"","autoReset":false,"x":400,"y":40,"wires":[]},{"id":"dd70ec7f.6ba268","type":"rev-pi-io-read","z":"8c8a3ee9.31c5e","name":"","ioPort":"RevPiLED","updateRate":50,"ignoreFirst":false,"enableCounter":false,"autoPolling":true,"pollingSpeed":"100","enableEdgeMode":true,"enableDebounce":false,"risingEdgeDelay":10,"fallingEdgeDelay":10,"x":230,"y":340,"wires":[["3503d63.fcf4caa"]]},{"id":"3503d63.fcf4caa","type":"debug","z":"8c8a3ee9.31c5e","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":400,"y":340,"wires":[]},{"id":"5f07806b.a89c28","type":"inject","z":"8c8a3ee9.31c5e","name":"","topic":"","payload":"","payloadType":"date","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":220,"y":40,"wires":[["589ad37.da1ccac"]]},{"id":"30150727.f8df88","type":"inject","z":"8c8a3ee9.31c5e","name":"","topic":"","payload":"1","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":210,"y":200,"wires":[["d2c240c4.561b5"]]},{"id":"be4787ca.51863","type":"inject","z":"8c8a3ee9.31c5e","name":"","topic":"","payload":"4","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":210,"y":240,"wires":[["d2c240c4.561b5"]]}]
</pre>