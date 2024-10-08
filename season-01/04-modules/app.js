// require("./xyz.js"); // importing another module

// const {calculate, test} = require("./sum.js")

// import {calculate} from './xyz.js'

const {calculateSubtract, calculateSum} = require("./calculate/index")

var name = "Namaste Bharat";

var a = 10;
var b = 30;

// console.log(name);
// console.log(a+b);

 
calculateSum(20, 30)
calculateSubtract(90, 30)
