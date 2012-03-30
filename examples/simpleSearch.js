/*
 * A simple search algorithm.
 * Given an oracle that returns true for only one number between zero and three,
 * the simple search function can determine which it is with only a single invocation.
 */

var createOracle = function(match) { return function(x) {return x == match ? 1 : 0} };

var simpleSearch = function(f) {
    var inputBits = {from: 1, to: 2};
    return jsqbits('|001>')
            .hadamard(ALL)
            .applyFunction(inputBits, 0, f)
            .hadamard(inputBits)
            .z(inputBits)
            .controlledZ(2, 1)
            .hadamard(inputBits)
            .measure(inputBits)
            .result;
};

//var oracle = createOracle(0);
//var oracle = createOracle(1);
//var oracle = createOracle(2);
var oracle = createOracle(3);

simpleSearch(oracle)