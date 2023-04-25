const {exec} = require('child_process');
var WebRcon = require('webrconjs')
const axios = require('axios');

const {server_ip, server_port, server_password, webhook_url} = require('./config.json');
let connected = false;
console.log(`
    server_ip: ${server_ip}
    server_port: ${server_port}
    server_password: ${server_password}
    webhook_url: ${webhook_url}
`)
const rcon = new WebRcon(server_ip, server_port);


let lastMessage = null;

rcon.on('connect', () => {
    connected = true
    console.log(`Connected to ${server_ip}:${server_port}`);
    setInterval(() => {
        try {
            rcon.run('serverinfo')
        } catch (error) {
            console.log(error)
        }
    }, 5000);

})

rcon.on('message', function(message) {
    message = JSON.parse(JSON.stringify(message));
    const data = JSON.parse(message.message)
    const uptime = data.Uptime;
    console.log(`Uptime: ${uptime}`)
    if (data.Hostname !== null) {
        if (uptime > lastMessage) {
            lastMessage = uptime;
        } else {
            axios.post(webhook_url, {
                content: `Server ${server_ip}:${server_port} is down!`
            })
            exec('./rustserver restart', (err, stdout, stderr) => {
                if (err) {
                    console.log(err);
                    return;
                } else {
                    console.log(stdout);
                }
            })
        }
    }
})
    
    


rcon.on('disconnect', () => {
    axios.post(webhook_url, {
        content: `Disconnected from ${server_ip}:${server_port}`
    })

    exec('./rustserver restart', (err, stdout, stderr) => {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log(stdout);
        }
    })
})

setInterval(() => {
    if (!connected) {
        try {
            rcon.connect(server_password)
        } catch (error) {
            console.log(error)
        }
    } else {
        return
    }
}, 1000);
