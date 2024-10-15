console.log('something from xyz.js');
console.log("sum module!!");

/**
 * the variable declared inside the module is by default protected , in order to access it we have to
 * export it and use it inside another module
 */
var test ="namaste"

export function calculate(a, b) {
    const sum = a+b;

    console.log(sum);
}
