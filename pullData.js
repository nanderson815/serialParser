
var SerialPort = require('serialport');

var port = new SerialPort('COM3', {
    autoOpen: false
});

const ENQ = new Promise(function(resolve, reject){
    port.write(Buffer.from("05", "hex"), function (err) {
        if (err) {
            return console.log('Error on write: ', err.message)
        }
        resolve(true)
    })
});

port.open(function (err) {
    if (err) {
        return console.log('Error opening port: ', err.message)
    }

    port.on('data', function (data) {
        let string = data.toString('utf8');
        console.log(string)
    });

    ENQ.then(function(val){
        if(val){
            port.write(Buffer.from("45", "hex"), (err) => {
                return console.log("Error: ", err);
            });
        }
    });
});



port.on('error', function (err) {
    console.log('Error: ', err.message)
})
