var config = {};
config.local = {};
config.PvOutput = {};
config.Involar = {};

config.local.logging = true;
config.local.ip = ''; // set this to your ip

config.PvOutput.Key = ''; // api key
config.PvOutput.Sid = ''; // your system id of the whole collection solar panels
config.PvOutput.MicroInverterMode = true; // optional, post individual inverter stats to PVoutput
config.PvOutput.MicroInverterMapping = {
	"0000":"",
	"0000":"",
	"0000":"",
	"0000":"",
	"0000":"",
	"0000":"",
	"0000":""
}; // array of last 4 digits of the serial, mapped to a pvoutput system id

config.Involar.Relay = false; // also send to the involar server
config.Involar.Server = '62.28.182.144';


module.exports = config;