# rev-pi-nodered-bridge

Access Revolution Pi DIO using nodered and IO-name.  
Require nodejs v11. This node does not support node v12 yet due it's dependencie FFI cannot be compiled with node v12. 

## DioRead

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

## DioWrite

- IO Port : <code>string</code> IO port name.  
- Set default : <code>bool</code> Enable IO default value.  
- Value : <code>int</code> Default value.  

## DioReset

- On deploy : <code>bool</code> Reset IO on deploy and node-red startup.  

## Examples

<pre>
[{"id":"b9d81bab.d6a7d8","type":"inject","z":"7a44f39f.07b78c","name":"","topic":"","payload":"0","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":330,"y":140,"wires":[["b91ef2d2.578e4"]]},{"id":"b3ceac21.f236b8","type":"inject","z":"7a44f39f.07b78c","name":"","topic":"","payload":"1","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":330,"y":180,"wires":[["b91ef2d2.578e4"]]},{"id":"5029a0d1.27f1d","type":"inject","z":"7a44f39f.07b78c","name":"","topic":"","payload":"4","payloadType":"num","repeat":"","crontab":"","once":false,"onceDelay":0.1,"x":330,"y":220,"wires":[["b91ef2d2.578e4"]]},{"id":"b91ef2d2.578e4","type":"dio-write","z":"7a44f39f.07b78c","name":"","ioPort":"RevPiLED","enableDefault":true,"defaultValue":0,"x":510,"y":180,"wires":[]},{"id":"b260da1d.202368","type":"dio-read","z":"7a44f39f.07b78c","name":"","ioPort":"RevPiLED","updateRate":50,"ignoreFirst":false,"enableCounter":false,"autoPolling":true,"pollingSpeed":"500","enableEdgeMode":true,"enableDebounce":true,"risingEdgeDelay":"100","fallingEdgeDelay":"100","x":330,"y":320,"wires":[["bd4c1e55.f2ba1"]]},{"id":"bd4c1e55.f2ba1","type":"debug","z":"7a44f39f.07b78c","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"false","x":500,"y":320,"wires":[]}]
</pre>