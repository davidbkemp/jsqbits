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

        it("accepts an ALL parameter", function() {
            var x = qstate('|00>').hadamard(jsqbits.ALL);
            expect(x.amplitude('|00>')).toBeApprox(complex(0.5, 0));
            expect(x.amplitude('|01>')).toBeApprox(complex(0.5, 0));
            expect(x.amplitude('|10>')).toBeApprox(complex(0.5, 0));
            expect(x.amplitude('|11>')).toBeApprox(complex(0.5, 0));
        });

        it("accepts a bit range", function() {
            var x = qstate('|000>').hadamard({from:1, to:2});
            expect(x.amplitude('|000>')).toBeApprox(complex(0.5, 0));
            expect(x.amplitude('|001>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|010>')).toBeApprox(complex(0.5, 0));
            expect(x.amplitude('|011>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|100>')).toBeApprox(complex(0.5, 0));
            expect(x.amplitude('|101>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|110>')).toBeApprox(complex(0.5, 0));
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
        it("is accepts an ALL parameter", function() {
            var x = qstate('|00>').rotateX(jsqbits.ALL, Math.PI/4);

            expect(x.amplitude('|00>')).toBeApprox(complex(Math.cos(Math.PI/8) * Math.cos(Math.PI/8), 0));
            expect(x.amplitude('|01>')).toBeApprox(complex(Math.cos(Math.PI/8), 0).multiply(complex(0, -Math.sin(Math.PI/8))));
            expect(x.amplitude('|10>')).toBeApprox(complex(Math.cos(Math.PI/8), 0).multiply(complex(0, -Math.sin(Math.PI/8))));
            expect(x.amplitude('|11>')).toBeApprox(complex(-Math.sin(Math.PI/8) * Math.sin(Math.PI/8), 0));
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
        it("does nothing when the control bit is zero", function() {
            var x = qstate('|000>').cnot(2, 0);
            expect(x).toEqual(qstate('|000>'));
        });
        it("flips the target bit from zero to one when the control bit is one", function() {
            var x = qstate('|100>').cnot(2, 0);
            expect(x).toEqual(qstate('|101>'));
        });
        it("flips the target bit from one to zero when the control bit is one", function() {
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
    describe('#applyFunction', function() {
        it("invokes function with states (bit range)", function() {
            var valuesFunctionCalledWith = [];
            var f = function(x) {
                valuesFunctionCalledWith.push(x);
                return 1;
            };
            var x = qstate('|1000>').hadamard(2);
            x.applyFunction({from:1, to:2}, 0, f);
            expect(valuesFunctionCalledWith).toContain(0);
            expect(valuesFunctionCalledWith).toContain(2);
        });

        it("invokes function with states (single bit)", function() {
            var valuesFunctionCalledWith = [];
            var f = function(x) {
                valuesFunctionCalledWith.push(x);
                return 1;
            };
            var x = qstate('|1000>').hadamard(2);
            x.applyFunction(2, 0, f);
            expect(valuesFunctionCalledWith).toContain(0);
            expect(valuesFunctionCalledWith).toContain(1);
        });

        it ("does nothing when the funciton returns zero", function() {
            var f = function(x) { return 0; };
            var x = qstate('|00>').applyFunction(1, 0, f);
            expect(x).toEqual(qstate('|00>'));
        });

        it ("flips the target bit from zero to one when the function returns one", function() {
            var f = function(x) { return 1; };
            var x = qstate('|00>').applyFunction(1, 0, f);
            expect(x).toEqual(qstate('|01>'));
        });

        it ("flips the target bit from one to zero when the function returns one", function() {
            var f = function(x) { return 1; };
            var x = qstate('|01>').applyFunction(1, 0, f);
            expect(x).toEqual(qstate('|00>'));
        });
    });

    describe('#projectOnto', function(){
        it ("should project onto the specified bits (normalization not required)", function() {
            var bitRange = {from:1, to:2};
            var x = qstate('|1000>').rotateX(2, Math.PI/4).rotateX(0, Math.PI/4).projectOnto(bitRange);
            expect(x.numBits).toBe(2);
            var cosPiOn8 = Math.cos(Math.PI/8);
            var sinPiOn8 = Math.sin(Math.PI/8);
            expect(x.amplitude('|00>')).toBeApprox(complex(cosPiOn8 * cosPiOn8, -cosPiOn8 * sinPiOn8));
            expect(x.amplitude('|01>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|10>')).toBeApprox(complex(-sinPiOn8 * sinPiOn8, -cosPiOn8 * sinPiOn8));
            expect(x.amplitude('|11>')).toBe(jsqbits.Complex.ZERO);
        });
        it ("should project onto the specified bits (with normalization required)", function() {
            var bitRange = {from:1, to:2};
            var x = qstate('|1000>').hadamard(2).hadamard(0).projectOnto(bitRange);
            expect(x.numBits).toBe(2);
            expect(x.amplitude('|00>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(x.amplitude('|01>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|10>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(x.amplitude('|11>')).toBe(jsqbits.Complex.ZERO);
        });
    });
});
