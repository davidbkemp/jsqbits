describe('QState', function() {
    var complex = function(real, imaginary) {
        return new jsqbits.Complex(real, imaginary);
    };

    var qstate = jsqbits.QState.fromBits;

    beforeEach(function() {
        this.addMatchers(jsqbits.JasmineMatchers);
    });

    describe('#toString', function() {
       it('will round off long decimals', function() {
           var x = qstate('|000>').hadamard(2);
           expect(x.toString()).toEqual('0.7071 |000> + 0.7071 |100>');
        });
       it('will nicely display negated states as subtraction', function() {
           var x = qstate('|100>').hadamard(2);
           expect(x.toString()).toEqual('0.7071 |000> - 0.7071 |100>');
        });
    });

    describe('#hadamard', function() {
        it("applies the hadamard operation", function() {
            var x = qstate('|000>').hadamard(2);
            expect(x.amplitude('|000>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(x.amplitude('|001>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|010>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|011>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|100>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(x.amplitude('|101>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|110>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|111>')).toBe(jsqbits.Complex.ZERO);
        });
    });

    describe('#hadamard', function() {
        it("is it's own inverse", function() {
            var x = qstate('|000>').hadamard(2).hadamard(2);
            expect(x.amplitude('|000>')).toBeApprox(complex(1, 0));
            expect(x.amplitude('|001>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|010>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|011>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|100>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|101>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|110>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|111>')).toBe(jsqbits.Complex.ZERO);
        });
    });

    describe('#rotateX', function() {
        it("rotates about the X axis", function() {
            var x = qstate('|00>').rotateX(1, Math.PI/4);
            expect(x.amplitude('|00>')).toBeApprox(complex(Math.cos(Math.PI/8), 0));
            expect(x.amplitude('|01>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|10>')).toBeApprox(complex(0, -Math.sin(Math.PI/8)));
            expect(x.amplitude('|11>')).toBe(jsqbits.Complex.ZERO);
        });
        it("can be applied multiple times", function() {
            var x = qstate('|00>').rotateX(1, Math.PI/4).rotateX(1, Math.PI/4).rotateX(1, Math.PI/4);
            expect(x.amplitude('|00>')).toBeApprox(complex(Math.cos(3*Math.PI/8), 0));
            expect(x.amplitude('|01>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|10>')).toBeApprox(complex(0, -Math.sin(3*Math.PI/8)));
            expect(x.amplitude('|11>')).toBe(jsqbits.Complex.ZERO);
        });
    });

    describe('#rotateY', function() {
        it("rotates about the Y axis", function() {
            var x = qstate('|00>').rotateY(1, Math.PI/4);
            expect(x.amplitude('|00>')).toBeApprox(complex(Math.cos(Math.PI/8), 0));
            expect(x.amplitude('|01>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|10>')).toBeApprox(complex(Math.sin(Math.PI/8), 0));
            expect(x.amplitude('|11>')).toBe(jsqbits.Complex.ZERO);
        });
        it("can be applied multiple times", function() {
            var x = qstate('|00>').rotateY(1, Math.PI/4).rotateY(1, Math.PI/4).rotateY(1, Math.PI/4);
            expect(x.amplitude('|00>')).toBeApprox(complex(Math.cos(3*Math.PI/8), 0));
            expect(x.amplitude('|01>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|10>')).toBeApprox(complex(Math.sin(3*Math.PI/8), 0));
            expect(x.amplitude('|11>')).toBe(jsqbits.Complex.ZERO);
        });
    });

    describe('#rotateZ', function() {
        it("rotates about the Z axis (|0>)", function() {
            var x = qstate('|0>').rotateZ(0, Math.PI/4);
            expect(x.amplitude('|0>')).toBeApprox(complex(Math.cos(Math.PI/8), -Math.sin(Math.PI/8)));
            expect(x.amplitude('|1>')).toBe(jsqbits.Complex.ZERO);
        });
        it("rotates about the Z axis (|1>)", function() {
            var x = qstate('|1>').rotateZ(0, Math.PI/4);
            expect(x.amplitude('|0>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|1>')).toBeApprox(complex(Math.cos(Math.PI/8), Math.sin(Math.PI/8)));
        });
        it("can be applied multiple times", function() {
            var x = qstate('|0>').rotateZ(0, Math.PI/4).rotateZ(0, Math.PI/4).rotateZ(0, Math.PI/4);
            expect(x.amplitude('|0>')).toBeApprox(complex(Math.cos(3*Math.PI/8), -Math.sin(3*Math.PI/8)));
            expect(x.amplitude('|1>')).toBe(jsqbits.Complex.ZERO);
        });
    });

    describe('#cnot', function() {
        it("flips does nothing when the control bit is zero", function() {
            var x = qstate('|000>').cnot(2, 0);
            expect(x).toEqual(qstate('|000>'));
        });
        it("flips the target amplitude from zero to one when the control bit is one", function() {
            var x = qstate('|100>').cnot(2, 0);
            expect(x).toEqual(qstate('|101>'));
        });
        it("flips the target amplitude from one to zero when the control bit is one", function() {
            var x = qstate('|101>').cnot(2, 0);
            expect(x).toEqual(qstate('|100>'));
        });
    });

    describe('Simple combination of hadamard and cnot', function() {
        it("results in a phase kick back", function() {
            var x = qstate('|01>').hadamard(0).hadamard(1).cnot(1, 0).hadamard(0).hadamard(1);
            expect(x.amplitude('|00>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|01>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|10>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|11>')).toBeApprox(complex(1,0));
        });
    });
});
