
/**
 * General case of the "Period Finding" problem.
 * For any function where f(x) = f(x + r), this algorithm will find r.
 */

var numOutBits = 6;
var numInBits = 2 * numOutBits;
var inputRange = Math.pow(2,numInBits);
var outputRange = Math.pow(2,numOutBits);

function singleGoAtFindPeriod(f) {
    var accuracyRequiredForContinuedFraction = 1/(2 * outputRange * outputRange);
    var outBits = {from: 0, to: numOutBits - 1};
    var inputBits = {from: numOutBits, to: numOutBits + numInBits - 1};
    var lcm = 1;
//        Do this multiple times as we will get multiples of the desired result.
    for (var i = 0; i < 8; i ++) {
        var qstate = new jsqbits.QState(numInBits + numOutBits).hadamard(inputBits);
        qstate = qstate.applyFunction(inputBits, outBits, f);
//        We do not need to measure the outBits, but it does speed up the simulation.
        qstate = qstate.measure(outBits).newState;
        var result = qstate.qft(inputBits).measure(inputBits).result;
        var continuedFraction = jsqbitsmath.continuedFraction(result/inputRange, accuracyRequiredForContinuedFraction);
        var newLcm = jsqbitsmath.lcm(continuedFraction.denominator, lcm);
//        Reduce the chances of getting the wrong answer by ignoring obviously wrong results!
        if (newLcm <= outputRange) lcm = newLcm;
    }
    return lcm;
}

function findPeriod(f) {
//    Period finding is not guaranteed, and so we need to have a few goes.. give up after 3:
    for(var i = 0; i < 3; i++) {
        var r = singleGoAtFindPeriod(f);
        if (f(0) === f(r)) {
            return r;
        }
    }
    return "Failed!";
}

function promptAndFindPeriod() {
    var input = prompt("Please enter a function where f(x) = f(x+r) for some r less than " + outputRange + " (could take a minute or so!)", "function(x) {return x % 5;}");
    var f;
    eval("f = " + input);
    var period = findPeriod(f);
    return period;
}

var period = promptAndFindPeriod();
"The period of your function r = " + period;
