module.exports = function(RED)
{
	var revpi = require('./revPiDIO.js');
	function RevPiDIO(config) {
	RED.nodes.createNode(this,config);
	this.offset=config.offset;
	this.bit=config.bit;
	var node = this;
	node.on('input', function(msg){
	msg.payload = parseInt(revpi.read(parseInt(node.offset),parseInt(node.bit)));
	node.send(msg);
	});
}
RED.nodes.registerType("revpi-read", RevPiDIO);
}


