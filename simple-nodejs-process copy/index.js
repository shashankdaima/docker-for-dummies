// Extract the major version number from process.version
const nodeVersion = process.version; //versions looklike 22.2.0
const majorVersion = parseInt(nodeVersion.split('.')[0].replace('v', ''), 10);

// Check the version and perform the required action
if (majorVersion >= 21) {
    console.log('helloworld');
} else {
    throw new Error('Node.js version must be 21 or higher');
}
