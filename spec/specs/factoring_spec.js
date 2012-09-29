describe("Shor's algorithm", function() {
    it("should factor 35", function() {

        function computeOrder(a, n, numOutBits) {
            var numInBits = 2 * numOutBits;
            var inputRange = Math.pow(2,numInBits);
            var outputRange = Math.pow(2,numOutBits);
            var accuracyRequiredForContinuedFraction = 1/(2 * outputRange * outputRange);
            var outBits = {from: 0, to: numOutBits - 1};
            var inputBits = {from: numOutBits, to: numOutBits + numInBits - 1};
            var attempts = 0;
            var successes = 0;
            var bestSoFar = 1;
            var f = function(x) { return jsqbitsmath.powerMod(a, x, n); }
            var f0 = f(0);

            function continueFindingPeriod() {
                if (successes === numOutBits || attempts === 2 * numOutBits) {
                    return "failed";
                }
                var qstate = new jsqbits.QState(numInBits + numOutBits).hadamard(inputBits);
                qstate = qstate.applyFunction(inputBits, outBits, f);
                // We do not need to measure the outBits, but it does speed up the simulation.
                qstate = qstate.measure(outBits).newState;
                var result = qstate.qft(inputBits).measure(inputBits).result;
                var continuedFraction = jsqbitsmath.continuedFraction(result/inputRange, accuracyRequiredForContinuedFraction);
                var candidate = continuedFraction.denominator;
                // Reduce the chances of getting the wrong answer by ignoring obviously wrong results!
                if (candidate <= outputRange && candidate > 1) {
                    if(f(candidate) === f0) {
                        return candidate;
                    }
                    var lcm = jsqbitsmath.lcm(candidate, bestSoFar)
                    if (lcm <= outputRange) {
                        successes++;
                        bestSoFar = lcm;
                        if (f(bestSoFar) === f0) {
                            return bestSoFar;
                        }
                    }
                }
                attempts++;
                return continueFindingPeriod();
            }

            return continueFindingPeriod();
        }

        function factor(n) {

            var attempt = 0;
            var numOutBits = Math.ceil(Math.log(n)/Math.log(2));

            function attemptFactor() {
                if (attempt++ === 8) {
                    return "failed";
                }
                var a = 2 + Math.floor(Math.random() * (n - 2));
                var d = jsqbitsmath.gcd(a, n);
                if(d > 1) {
                    return d;
                }

                var r = computeOrder(a, n, numOutBits);
                if (r !== "failed" && r % 2 === 0) {
                    var x = jsqbitsmath.powerMod(a, r/2, n) - 1;
                    var d = jsqbitsmath.gcd(x, n);
                    if(d > 1) {
                        if (n % d === 0) {
                            return d;
                        }
                    }
                }
                return attemptFactor();
            }

            if (n % 2 === 0) {
                return 2;
            }

            return attemptFactor();
        }

       expect(35 % factor(35)).toBe(0);

    });
});
