
/**
 * Special case of the "Period Finding" problem.
 * For any function where f(x) = f(x + r) such that r is a factor of 1024, this algorithm will find r.
 */

function findPeriod(f) {
    var numOutBits = 10;
    var numInBits = numOutBits;
    var outBits = {from: 0, to: numOutBits - 1};
    var inputBits = {from: numOutBits, to: numOutBits + numInBits - 1};
    var gcd = 0;
//        Do this multiple times as will get multiples of the desired result.
    for (var i = 0; i < 8; i ++) {
        var qstate = new jsqbits.QState(numInBits + numOutBits).hadamard(inputBits);
        qstate = qstate.applyFunction(inputBits, outBits, f);
//        We do not need to measure the outBits, but it does speed up the simulation.
        qstate = qstate.measure(outBits).newState;
        var result = qstate.qft(inputBits).measure(inputBits).result;
        gcd = jsqbitsmath.gcd(gcd, result);
    }
    return Math.pow(2, numInBits)/gcd;
}

function promptAndFindPeriod() {
    var input = prompt("Please enter a function where f(x) = f(x+r) for some r that is a factor of 1024", "function(x) {return x % 4;}");
    var f;
    eval("f = " + input);
    var period = findPeriod(f);
    return period;
}
var period = promptAndFindPeriod();
"The period of your function r = " + period;
