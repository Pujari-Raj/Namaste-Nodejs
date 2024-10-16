
// require (./path)
// All the code of the module is wrapped inside a funtion (IIFE)

// IIFE (Immediately Invoked Funtion Execution)

(function (module, require) {
    
    // require(path);
    // piece of js code

    // return module.exports = {}
}) (module.exports);

/**
 * In this folder we have a file app.js it imports the files from the calculate folder 
 * (inde.js , subtract.js, sum.js) inside the app.js file
 * that means the code of the each & every file is wrapped inside the IIFE and it 
 * is available to export that code
 */

(function (exports, require, module, __filename, __dirname) {
    // ALL THE CODE OF OUR MODULE
})