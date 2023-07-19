
# involar2pvoutput

This is a Nodejs server for sending the output to PVoutput.org, the original Sedas website went offline. The replacement application is crap. So i decided to start this project and release it for other Egate users.

## Getting Started

you have to overrule your DNS server with a line for changing the entry for "involar.net" and "involar.com", potentially "data.involar.com" and "data.involar.net". Point this to the ip of the system wich is running this software.

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


## Example setup
Here's an example of how to get this working when your router doesn't support changing specific DNS entries, in which case you can use a raspberry pi for both your node server and your DNS.

1. Buy a raspberry pi, which is a tiny computer you can use as a server. They're pretty cheap and you can pretty much just install it and forget it. Get one with an ethernet port or a wifi antenna.
2. Install [Raspberry PI OS](https://www.raspberrypi.com/software/) or similar. You can do that directly on your computer using the Raspberry Pi Imager and your raspberry pi's SD card. Check the box for SSH access.
3. Go in your router, and figure out how to add a static IP for the raspberry pi for it's local IP (so that it doesn't change later on).
4. Using powershell or similar, connect (via SSH) to your Raspberry PI. The credentials are set during installation. The command is something like `ssh your-username@your-raspberry-IP`
5. Install [PIHOLE](https://pi-hole.net/), which is actually a network-wide ad-blocker but that can also acts as DNS.
6. Configure pihole to redirect `involar.net`, `involar.com`, `data.involar.net` and `data.involar.com` (the exact address varies depending on hardware) to your local IP. This is done under the section 'DNS Records'.
7. Involar2pvoutput is created using node, so we need that installed on the raspberry pi using the command ´sudo apt install nodejs´. This also comes with NPM, which is used to install some dependencies for involar2pvoutput (listed above).
8. Install involar2pvoutput using the clone command `git clone https://github.com/m4rtinvdbij/involar2pvoutput.git`
9. Open the configuration file using an editor, e.g. nano: `nano involar2pvoutput/config.js` and input your pvoutput.org API key and system id, which are found on pvoutput.org under settings. You can configure as you like here.
10. Run the server as a background task, putting the output into 'nohup.out': `nohup sudo node involar2pvoutput/server.js &`. You can view the output later by doing `nano nohup.out`.
