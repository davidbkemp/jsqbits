/*
 * Deutsch's Algorithm.
 * Determine the value of f(0) + f(1) mod 2 with a single invocation of f (where f is a single bit function)
 */

var deutsch = function(f) {
   return jsqbits('|01>').hadamard(jsqbits.ALL).applyFunction(1, 0, f).hadamard(jsqbits.ALL).measure(1).result;
};

//var f = function(x) {return 1;};
//var f = function(x) {return 0;};
//var f = function(x) {return x;};
var f = function(x) {return (x + 1) % 2;};

deutsch(f)
