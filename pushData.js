var SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length');
var parseString = require('xml2js').parseString;


var port = new SerialPort('COM3', {
    autoOpen: false
});

port.open(function (err) {
    if (err) {
        return console.log('Error opening port: ', err.message)
    }
});

let response;
let handShake = new Promise((res, rej) => {

    port.on('data', function (data) {
        if (data.toString() == Buffer.from("05", "hex")) {
            // console.log(data);
            port.write(Buffer.from("01", "hex"))
        } else if (data.toString() == Buffer.from("45", "hex")) {
            port.write(Buffer.from("06", "hex"))
            res(true)
        }

    });
});

handShake.then((val) => {

    if (val) {
        let buffer = '';
        port.on('data', (chunk) => {
            buffer += chunk;
            response = buffer.split(/\r?\n/);
        });
        port.write(Buffer.from("06", "hex"));
        setTimeout(() => parseXML(response), 500);
    }


});





const parseXML = (string) => {
    // console.log(string);

    let xml = string.join('').substr(1)
    parseString(xml, function (err, result) {
        console.dir(result.UploadDataDump.SessionDataArray[0]);
    });
}










port.on('error', function (err) {
    console.log('Error: ', err.message)
})
