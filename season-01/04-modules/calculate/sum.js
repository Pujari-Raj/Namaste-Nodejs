console.log("sum module!!");

/**
 * the variable declared inside the module is by default protected , in order to access it we have to
 * export it and use it inside another
 */

function calculateSum(a, b) {
    const sum = a+b;

    console.log(sum);
}

module.exports = {
    calculateSum,
}