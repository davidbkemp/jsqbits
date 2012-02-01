describe('Simple Quantum Algorithms', function() {
    var complex = function(real, imaginary) {
        return new jsqbits.Complex(real, imaginary);
    };

    var qstate = jsqbits.QState.fromBits;
    var ALL = jsqbits.ALL;

    beforeEach(function() {
        this.addMatchers(jsqbits.JasmineMatchers);
    });

    describe("Super dense coding", function() {

        var superDense = function(input) {
            var state = qstate('|00>').hadamard(0).cnot(0,1);

//            Alice prepares her qbit
            var alice = 1;
            if (input[0] === '1') {
                state = state.z(alice);
            }
            if (input[1] === '1') {
                state = state.x(alice);
            }

//            Alice sends her qbit to Bob
            var bob = 0;
            state = state.cnot(alice, bob).hadamard(alice);
            var result = state.measure(ALL).measurement.toString(2);
            return result.length == 1 ? '0' + result : result;
        };

        it ("should transmit 00", function() {
            expect(superDense('00')).toBe('00');
        });

        it ("should transmit 01", function() {
            expect(superDense('01')).toBe('01');
        });

        it ("should transmit 10", function() {
            expect(superDense('10')).toBe('10');
        });

        it ("should transmit 11", function() {
            expect(superDense('11')).toBe('11');
        });
    });

    describe("Simple search", function(){
        var createOracle = function(match) { return function(x) {return x == match ? 1 : 0} };

        var simpleSearch = function(f) {
            var inputBits = {from: 1, to: 2};
            return qstate('|001>')
                    .hadamard(ALL)
                    .applyFunction(inputBits, 0, f)
                    .hadamard(inputBits)
                    .z(inputBits)
                    .controlledZ(2, 1)
                    .hadamard(inputBits)
                    .measure(inputBits)
                    .measurement;
        };

        it ("should find f00", function() {
            expect(simpleSearch(createOracle(0))).toBe(0);
        });

        it ("should find f01", function() {
            expect(simpleSearch(createOracle(1))).toBe(1);
        });

        it ("should find f10", function() {
            expect(simpleSearch(createOracle(2))).toBe(2);
        });

        it ("should find f11", function() {
            expect(simpleSearch(createOracle(3))).toBe(3);
        });
    });

    describe("Quantum Teleportation", function(){

        var applyTeleportation = function(state) {
            var alicesResult = state.cnot(2, 1).hadamard(2).measure({from: 1, to: 2});
            var resultingState = alicesResult.newState;
            if (alicesResult.measurement & 1) {
                resultingState = resultingState.x(0);
            }
            if (alicesResult.measurement & 2) {
                resultingState = resultingState.z(0);
            }
            return resultingState;
        };

        it ("should support transmition of quantum state from Alice to Bob", function(){
            var initialState = qstate("|000>").hadamard(1).cnot(1,0).rotateX(2, Math.PI/3).rotateZ(2, Math.PI/5);
            var stateToBeTransmitted = initialState.projectOnto(2);
            var stateToBeTransmitted0 = stateToBeTransmitted.amplitude('|0>');
            var stateToBeTransmitted1 = stateToBeTransmitted.amplitude('|1>');
            var finalState = applyTeleportation(initialState);
            var receivedState = finalState.projectOnto(0);
            expect(receivedState.amplitude('0')).toBeApprox(stateToBeTransmitted0);
            expect(receivedState.amplitude('1')).toBeApprox(stateToBeTransmitted1);
        });
    });

    describe("Deutsch's algorithm", function() {

        var deutsch = function(f) {
           return qstate('|01>').hadamard(jsqbits.ALL).applyFunction(1, 0, f).hadamard(jsqbits.ALL).measure(1).measurement;
        };

        it("should compute 0 for fixed function returning 1", function() {
            var f = function(x) {return 1;};
            expect(deutsch(f)).toBe(0);
        });
        it("should compute 0 for fixed function returning 0", function() {
            var f = function(x) {return 0;};
            expect(deutsch(f)).toBe(0);
        });
        it("should compute 1 for identity function", function() {
            var f = function(x) {return x;};
            expect(deutsch(f)).toBe(1);
        });
        it("should compute 1 for not function", function() {
            var f = function(x) {return (x + 1) % 2;};
            expect(deutsch(f)).toBe(1);
        });
    });

    describe("Deutsch-Jozsa algorithm", function() {
        var deutschJozsa = function(f) {
            var inputBits = {from: 1, to: 3};
            var result = qstate('|0001>')
                    .hadamard(ALL)
                    .applyFunction(inputBits, 0, f)
                    .hadamard(inputBits)
                    .projectOnto(inputBits);
            var magnitudeOfZeroState = result.amplitude("|00>").magnitude();
            return Math.abs(1 - magnitudeOfZeroState) < 0.00001;
        };

        var shuffle = function(a) {
            for (var i = 0; i < a.length; i++) {
                var j = Math.floor(Math.random() * a.length);
                var x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
        };

        var createBalancedFunction = function() {
            // Return 0 for exactly half the possible inputs and 1 for the rest.
            var nums = [0,1,2,3,4,5,6,7];
            shuffle(nums);
            return function(x) { return nums[x] < 4 ? 0 : 1 };
        };

        it("should return true if function always returns zero", function() {
            expect(deutschJozsa(function(x) { return 0; })).toBe(true);
        });

        it("should return true if function always returns one", function() {
            expect(deutschJozsa(function(x) { return 1; })).toBe(true);
        });

        it("should return false if function is balanced", function() {
            expect(deutschJozsa(createBalancedFunction())).toBe(false);
        });
    });
});