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
            result = state.measure(ALL).measurement.toString(2);
            result = result.length == 1 ? '0' + result : result;
            return result;
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

    describe("Deutsch's algorithm", function() {

        var deutch = function(f) {
           return qstate('|01>').hadamard(jsqbits.ALL).applyFunction(1, 0, f).hadamard(jsqbits.ALL).measure(1).measurement;
        };

        it("should compute 0 for fixed function returning 1", function() {
            var f = function(x) {return 1;};
            expect(deutch(f)).toBe(0);
        });
        it("should compute 0 for fixed function returning 0", function() {
            var f = function(x) {return 0;};
            expect(deutch(f)).toBe(0);
        });
        it("should compute 1 for identity function", function() {
            var f = function(x) {return x;};
            expect(deutch(f)).toBe(1);
        });
        it("should compute 1 for not function", function() {
            var f = function(x) {return (x + 1) % 2;};
            expect(deutch(f)).toBe(1);
        });

    });
});