
# involar2pvoutput

This is a Nodejs server for sending the output to PVoutput.org, the original Sedas website went offline. The replacement application is crap. So i decided to start this project and release it for other Egate users.

## Getting Started

you have to overrule your DNS server with a line for changing the entry for "involar.net". Point this to the ip of the system wich is running this software.

### Prerequisites

A router which can overrule a DNS record
A server capable of running NodeJS
NPM modules Moment and Request

### Installing

Install Nodejs
npm install moment
npm install request
run node server.js

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanx to Ad Boerma for helping me out with decoding the Egate messages and calculate the correct values
