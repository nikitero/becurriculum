const fs = require('fs');

const logError = (error) => {
    fs.appendFile('error.log', error, () => {
        console.log('Error log');
    })
}

module.exports = logError; 