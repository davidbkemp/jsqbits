describe('Simple Quantum Algorithms', function() {
    var complex = function(real, imaginary) {
        return new jsqbits.Complex(real, imaginary);
    };

    var qstate = jsqbits.QState.fromBits;

    beforeEach(function() {
        this.addMatchers(jsqbits.JasmineMatchers);
    });

     describe("Deutsch's algorithm", function() {
        it("should compute 0 for fixed function returning 1", function() {
            var f = function(x) {return 1;};
            var x = qstate('|01>').hadamard(jsqbits.ALL).applyFunction(1, 0, f).hadamard(jsqbits.ALL);
            expect(x.amplitude('|01>')).toBeApprox(complex(-1, 0));
        });
        it("should compute 0 for fixed function returning 0", function() {
            var f = function(x) {return 0;};
            var x = qstate('|01>').hadamard(jsqbits.ALL).applyFunction(1, 0, f).hadamard(jsqbits.ALL);
            expect(x.amplitude('|01>')).toBeApprox(complex(1, 0));
        });
        it("should compute 1 for identity function", function() {
            var f = function(x) {return x;};
            var x = qstate('|01>').hadamard(jsqbits.ALL).applyFunction(1, 0, f).hadamard(jsqbits.ALL);
            expect(x.amplitude('|11>')).toBeApprox(complex(1, 0));
        });
        it("should compute 1 for not function", function() {
            var f = function(x) {return (x + 1) % 2;};
            var x = qstate('|01>').hadamard(jsqbits.ALL).applyFunction(1, 0, f).hadamard(jsqbits.ALL);
            expect(x.amplitude('|11>')).toBeApprox(complex(-1, 0));
        });

    });
});