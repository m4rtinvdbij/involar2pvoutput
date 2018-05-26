var net = require('net');
var fs = require('fs');
const moment = require('moment');
let m = moment();
var request = require('request');

/////////////////////////////////////////
// settings

var LocalLogging = true;
var LocalIP = '';

var PvOutputKey = ''; // api key
var PvOutputSid = ''; // your system id of the whole collection solar panels
var PvOutputMicroInverterMode = true; // optional, post individual inverter stats to PVoutput
var PvOutpputMicroInverterMapping = {
	'':''
};

var InvolarRelay = false; // does not work at the moment, pleae do not use
var InvolarServer = '62.28.182.144';

/////////////////////////////////////////
// you dont want to change this
var LocalPorts = ['1020', '9800']; // local ports to listen on
var AvgWhArr = [];
var AvgWh = '0';

var server = net.createServer(function(socket) {

	socket.setKeepAlive(true);
	var serverprop = socket.address();



	var id = socket.remoteAddress + ':' + socket.remotePort;
	console.log('Server '+ serverprop.port +': A new connection was made from the Egate:', id);

	socket.on('data', function(data){
		console.log('Server '+ serverprop.port +': incoming data');
		//textChunk = data.toString('utf8');

		if(InvolarRelay) {

			var client = new net.Socket();
			client.connect(1020, InvolarServer, function() {
				console.log('Involar: Connected to server');
				client.write(data);
				console.log('Involar: data sent');
				//client.destroy();
				//console.log('Involar: Connection closed');
			});

			client.on('data', function(data) {
				console.log('Involar: Received: ' + data);

				if(LocalLogging) {

		  			fs.appendFile('involarresponse.txt', new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam'}) +"	"+data.toString('hex') + ' / ' + data +"\r\n", function (err) {
		    			if (err) 
		        			return console.log(err);
					});

				}

				//socket.write(data);
				//client.destroy(); // kill client after server's response
			});

			client.on('close', function() {
				console.log('Involar: Connection closed');
			});

		}


		if(data.length>32) {

       		//console.log('received data length :' + data.length ); 
        	console.log('Micro Inverter detailed stats line'); 

        	var s = data.toString('hex');
			var a = [];

			do { a.push(s.substring(0, 64)) } 
			while( (s = s.substring(64, s.length)) != "" );

			a.forEach(function(item, index, array) {

				var linecheck = item.substr(0,4);
				var serial = item.substr(60,4);
				var today = item.substr(36,4);
				var inttoday = (parseInt(today, 16)/8194.968553459119)*1000;

				if(linecheck=='ffff') {
					console.log(serial +':'+ inttoday);
					if(serial>0 && inttoday) {

						var sid = PvOutpputMicroInverterMapping[serial];

						if(sid) {

							request('https://pvoutput.org/service/r2/addstatus.jsp?sid='+ sid +'&key='+ PvOutputKey +'&v1='+ inttoday 
							+'&t='+ moment().format('HH:mm')
							+'&d='+ moment().format('YYYYMMDD'), function (error, response, body) {
							  console.log('Micro inverter PV Output for serial ('+ serial +')', body); 
							});

						} else {

							console.log('No mapping set for serial: '+ serial +', please set one up in variable: PvOutpputMicroInverterMapping');
						}

					}
				}
			});


  			fs.appendFile('log'+ serverprop.port +'-big.txt', new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam'}) +"	"+data.toString('hex') +"\r\n\r\n", function (err) {
    			if (err) 
        			return console.log(err);
			});

  		} else {

       		//console.log('received data length :' + data.length ); 

       		var hex = data.toString('hex');
       		var hexMsgType = hex.substr(4, 2); 

       		if(hexMsgType=='e7') {

       			socket.write(Buffer.from('ffffa77000000000000000000000000000000000000000000000000000000000', 'hex'));

       			var hexKwh = hex.substr(48, 4); 
       			var intKwh = parseInt(hexKwh, 16)/4;
        		console.log(hex + ' / '+ intKwh); 

				var valueToPush = { };
				valueToPush["stamp"] = moment().unix();
				valueToPush["watt"] = intKwh;

				AvgWhArr.push(valueToPush);

				AvgWhArr.forEach(function(item, index, array) {

					now = moment().unix();
					diff = now-item.stamp;
					console.log(index +' '+ diff);
					if(diff>2 * 60) {
						AvgWhArr.splice(index, 1);
					} 			  	
				  	
				});

				console.log(AvgWhArr);

				AvgWh = 0;
				AvgWhcount = 0;
				AvgWhArr.forEach(function(item, index, array) {
					AvgWh = AvgWh+item.watt;
					AvgWhcount++;
				});

				console.log(AvgWh +'/'+AvgWhcount);

				if(AvgWh>0) {
					var NewWh = AvgWh/AvgWhcount;
				} else {
					var NewWh = 0;
				}
				console.log(NewWh);

				request('https://pvoutput.org/service/r2/addstatus.jsp?sid='+ PvOutputSid 
				+'&key='+ PvOutputKey 
				+'&v2='+ NewWh 
				+'&t='+ moment().format('HH:mm')
				+'&d='+ moment().format('YYYYMMDD'), function (error, response, body) {
				  //console.log('error:', error); // Print the error if one occurred
				  //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
				  console.log('PV Output:', body);
				});

			} else if(hexMsgType=='e1') {
				// e1 is only serial number of the Egate

			} else if(hexMsgType=='e9') {
				// e1 is only serial number of the Egate

			} else {

				console.log('Unimplemented message type'); 
				console.log(hex); 

			}

  			fs.appendFile('log'+ serverprop.port +'-small.txt', new Date().toLocaleString('en-US', { timeZone: 'Europe/Amsterdam'}) +"	"+data.toString('hex') +' Watt: '+ intKwh +"\r\n", function (err) {
    			if (err) 
        			return console.log(err);
			});

  		}

	});

	socket.on('close', function(data){
		console.log('Server '+ serverprop.port +': Connection closed with Egate');
	});


});

LocalPorts.forEach(function(item, index, array) {

	console.log('Starting server on port '+ item);
	server.listen(item, LocalIP);

});

