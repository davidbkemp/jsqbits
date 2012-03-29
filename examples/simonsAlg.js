
var singleRunOfSimonsCircuit = function(f, numbits) {
    var inputBits = {from: numbits, to: 2 * numbits - 1};
    var targetBits = {from: 0, to: numbits - 1};
    var qbits = new jsqbits.QState(2 * numbits, [jsqbits.ONE])
            .hadamard(inputBits)
            .applyFunction(inputBits, targetBits, f)
            .hadamard(inputBits);
    return qbits.measure(inputBits).result;
}

//      TODO: Make this a litte easier to read!
var findPotentialSolution = function(f, numBits) {
    var nullSpace = null;
    var results = [];
    var estimatedNumberOfIndependentSolutions = 0;
    for(var count = 0; count < 10 * numBits; count++) {
        var result = singleRunOfSimonsCircuit(f, numBits);
        if (results.indexOf(result) < 0) {
            results.push(result);
            estimatedNumberOfIndependentSolutions++;
            if (estimatedNumberOfIndependentSolutions == numBits - 1) {
                nullSpace = jsqbitsmath.findNullSpaceMod2(results, numBits);
                if (nullSpace.length == 1) break;
                estimatedNumberOfIndependentSolutions = numBits - nullSpace.length;
            }
        }
    }
    if (nullSpace === null) throw "Could not find a solution";
    return nullSpace[0];
}

var simonsAlgorithm = function(f, numBits) {
    var solution = findPotentialSolution(f, numBits);
    return (f(0) === f(solution)) ? solution : 0;
 };

var testFunction000 = (function() {
    var mapping = [3, 1, 4, 5, 7, 2, 0, 6];
    return function(x) {
         return mapping[x];
     };
})();

var testFunction110 = function(x) {
    var mapping = ['101', '010', '000', '110', '000', '110', '101', '010'];
    return parseInt(mapping[x], 2);
};

var testFunction011 = function(x) {
    var mapping = ['010', '110', '110', '010', '100', '110', '110', '100'];
    return parseInt(mapping[x], 2);
};

var testFunction1010 = (function() {
    var key = parseInt('1010', 2);
    var mapping = [];
    var valuesUsed = [];
    for (var i = 0; i < 16; i ++) {
        if (mapping[i] === undefined) {
            var value;
            for(;;) {
                value = Math.floor(Math.random() * 16);
                if (valuesUsed.indexOf(value) < 0) break;
            }
            mapping[i] = value;
            mapping[i ^ key] = value;
        }
        valuesUsed.push(value);
    }
    return function(x) {
        return mapping[x];
    };
})();

[simonsAlgorithm(testFunction000, 3),
    simonsAlgorithm(testFunction011, 3).toString(2),
    simonsAlgorithm(testFunction110, 3).toString(2),
    simonsAlgorithm(testFunction1010, 4).toString(2)]



