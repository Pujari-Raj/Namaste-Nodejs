/**
 * the variable declared inside the module is by default protected , in order to access it we have 
 * to export it and use it inside another
 */

function calculateSubtract(a, b) {
    const sub = a-b;

    console.log(sub)
}

module.exports = {
    calculateSubtract,
}