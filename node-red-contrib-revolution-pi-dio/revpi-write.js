module.exports = function(RED){
	var revpi = require('./revPiDIO.js');
	function revPiWrite(config) {
	RED.nodes.createNode(this,config);
	this.offset=config.offset;
	this.bit=config.bit;
	this.value=config.value;
	var node = this;
	node.on('input', function(msg){
	if(Number.isInteger(msg.payload)){
	this.value=msg.payload;}
	msg.payload = parseInt(revpi.write(parseInt(node.offset),parseInt(node.bit),node.value));
	node.send(msg);
	});
}
RED.nodes.registerType("revpi-write", revPiWrite);
}


