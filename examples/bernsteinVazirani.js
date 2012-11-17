/*
 * Bernstein-Vazirani Algorithm:
 * Given f: f(x) = x.u, determine u.
 */

/*jshint eqnull:true, eqeqeq:true, forin:true, immed:true, latedef:true, newcap:true, noarg:true, nonew:true, regexp:true, undef:true, unused:true, strict:true, trailing:true */
/*global require:true, console:true, exports:true, __dirname:true */


(function () {
    "use strict";

    var jsqbits = require(__dirname + '/../lib/index').jsqbits;

    exports.bernsteinVazirani = function (f, numbits) {
        //  Create a |-> state as the target qubit.
        var targetQubit = jsqbits("|0>").subtract(jsqbits("|1>")).normalize();
        var inputQubits = new jsqbits.QState(numbits);
        var initialState = inputQubits.tensorProduct(targetQubit);

        var inputBits = {from: 1, to: numbits};
        var targetBit = 0;
        return initialState
            .hadamard(inputBits)
            .applyFunction(inputBits, targetBit, f)
            .hadamard(inputBits)
            .measure(inputBits)
            .asBitString();
    };

    exports.createHiddenStringFunction = function(hiddenString) {
        var hiddenStringAsNumber = parseInt(hiddenString, 2);
        return function(x) {
            var product = x & hiddenStringAsNumber;
            var result = 0;
            while (product > 0) {
                if (product % 2 === 1) result++;
                product = product >> 1;
            }
            return result;
        };
    };

    var f = exports.createHiddenStringFunction("01101");
    console.log("Hidden string is: " + exports.bernsteinVazirani(f, 5));

})();
