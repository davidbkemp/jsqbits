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

    describe('#x', function() {
        it("applies the Pauli x operator to (|0>)", function() {
            var x = qstate('|0>').x(0);
            expect(x.amplitude('|0>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|1>')).toEqual(complex(1, 0));
        });
        it("applies the Pauli x operator to (|1>)", function() {
            var x = qstate('|1>').x(0);
            expect(x.amplitude('|0>')).toEqual(complex(1, 0));
            expect(x.amplitude('|1>')).toBe(jsqbits.Complex.ZERO);
        });
    });

    describe('#controlledX', function(){
        it("does nothing when the control bit is zero (one target)", function() {
            var x = qstate('|001>').controlledX(2, 0);
            expect(x).toEqual(qstate('|001>'));
        });
        it("does nothing when the control bit is zero (multiple targets)", function() {
            var targetBits = {from: 0, to: 1};
            var x = qstate('|001>').controlledX(2, targetBits);
            expect(x).toEqual(qstate('|001>'));
        });
        it("flips the target bit when the control bit is one", function() {
            var x = qstate('|100>').controlledX(2, 0);
           expect(x.amplitude('|101>')).toBeApprox(complex(1,0));
        });
        it("flips the target bit when the control bit specifier is null", function() {
            var x = qstate('|100>').controlledX(null, 2);
            expect(x.amplitude('|000>')).toBeApprox(complex(1,0));
        });
        it("flips the target bits when the control bit is one", function() {
            var targetBits = {from: 0, to: 1};
            var x = qstate('|101>').controlledX(2, targetBits);
            expect(x.amplitude('|110>')).toBeApprox(complex(1,0));
        });
    });

    describe('#z', function() {
        it("applies the Pauli z operator to (|0>)", function() {
            var x = qstate('|0>').z(0);
            expect(x.amplitude('|0>')).toEqual(complex(1, 0));
            expect(x.amplitude('|1>')).toBe(jsqbits.Complex.ZERO);
        });
        it("applies the Pauli z operator to (|1>)", function() {
            var x = qstate('|1>').z(0);
            expect(x.amplitude('|0>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|1>')).toEqual(complex(-1, 0));
        });
    });

    describe('#controlledZ', function(){
        it("does nothing when the control bit is zero (one target)", function() {
            var x = qstate('|001>').controlledZ(2, 0);
            expect(x).toEqual(qstate('|001>'));
        });
        it("does nothing when the control bit is zero (multiple targets)", function() {
            var targetBits = {from: 0, to: 1};
            var x = qstate('|001>').controlledZ(2, targetBits);
            expect(x).toEqual(qstate('|001>'));
        });
        it("does nothing when the target bit is 0", function() {
            var x = qstate('|100>').controlledZ(2, 0);
            expect(x).toEqual(qstate('|100>'));
        });
        it("does nothing when the control bit specifier is null and the target bit is 0", function() {
            var x = qstate('|100>').controlledZ(null, 0);
            expect(x).toEqual(qstate('|100>'));
        });
        it("flips the phase when both the control and target bits are one", function() {
            var x = qstate('|101>').controlledZ(2, 0);
            expect(x.amplitude('|101>')).toBeApprox(complex(-1,0));
        });
        it("flips the phase when the control bit specifier is null and the target bit is one", function() {
            var x = qstate('|100>').controlledZ(null, 2);
            expect(x.amplitude('|100>')).toBeApprox(complex(-1,0));
        });
        it("flips the phase when an odd number of the target bits are 1 when the control bit is one", function() {
            var targetBits = {from: 0, to: 1};
            var x = qstate('|101>').controlledZ(2, targetBits);
            expect(x.amplitude('|101>')).toBeApprox(complex(-1,0));
        });

        it("does nothing when an even number of the target bits are 1 when the control bit is one", function() {
            var targetBits = {from: 0, to: 1};
            var x = qstate('|111>').controlledZ(2, targetBits);
            expect(x.amplitude('|111>')).toBeApprox(complex(1,0));
        });

    });

    describe('#y', function() {
        it("applies the Pauli y operator to (|0>)", function() {
            var x = qstate('|0>').y(0);
            expect(x.amplitude('|0>')).toEqual(jsqbits.Complex.ZERO);
            expect(x.amplitude('|1>')).toEqual(complex(0, 1));
        });
        it("applies the Pauli y operator to (|1>)", function() {
            var x = qstate('|1>').y(0);
            expect(x.amplitude('|0>')).toEqual(complex(0, -1));
            expect(x.amplitude('|1>')).toEqual(jsqbits.Complex.ZERO);
        });
    });

    describe('#controlledY', function(){
        it("does nothing when the control bit is zero", function() {
            var x = qstate('|001>').controlledY(2, 0);
            expect(x).toEqual(qstate('|001>'));
        });
        it("applies the Pauli y operator when the control bit is one",  function() {
            var x = qstate('|101>').controlledY(2, 0);
            expect(x.amplitude('|100>')).toEqual(complex(0, -1));
            expect(x.amplitude('|101>')).toEqual(jsqbits.Complex.ZERO);
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

    describe('#controlledHadamard', function() {
        it("does nothing when the control bit is zero", function() {
            var x = qstate('|001>').controlledHadamard(2, 0);
            expect(x).toEqual(qstate('|001>'));
        });
        it("applies the Hadamard operator when the control bit is one", function() {
            var x = qstate('|101>').controlledHadamard(2, 0);
            expect(x.amplitude('|100>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(x.amplitude('|101>')).toBeApprox(complex(-1 / Math.sqrt(2), 0));
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

    describe('#controlledXRotation', function() {
        it("does nothing when the control bit is zero", function() {
            var x = qstate('|001>').controlledXRotation(2, 0, Math.PI/4);
            expect(x).toEqual(qstate('|001>'));
        });
        it("rotates around the x axis when the control bit is one", function() {
            var x = qstate('|100>').controlledXRotation(2, 0, Math.PI/4);
            expect(x.amplitude('|100>')).toBeApprox(complex(Math.cos(Math.PI/8), 0));
            expect(x.amplitude('|101>')).toBeApprox(complex(0, -Math.sin(Math.PI/8)));
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

    describe('#controlledYRotation', function() {
        it("does nothing when the control bit is zero", function() {
            var x = qstate('|001>').controlledYRotation(2, 0, Math.PI/4);
            expect(x).toEqual(qstate('|001>'));
        });
        it("rotates around the y axis when the control bit is one", function() {
            var x = qstate('|100>').controlledYRotation(2, 0, Math.PI/4);
            expect(x.amplitude('|100>')).toBeApprox(complex(Math.cos(Math.PI/8), 0));
            expect(x.amplitude('|101>')).toBeApprox(complex(Math.sin(Math.PI/8), 0));
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

    describe('#controlledZRotation', function() {
        it("does nothing when the control bit is zero", function() {
            var x = qstate('|001>').controlledZRotation(2, 0, Math.PI/4);
            expect(x).toEqual(qstate('|001>'));
        });
        it("rotates around the z axis when the control bit is one", function() {
            var x = qstate('|100>').controlledZRotation(2, 0, Math.PI/4);
            expect(x.amplitude('|100>')).toBeApprox(complex(Math.cos(Math.PI/8), -Math.sin(Math.PI/8)));
            expect(x.amplitude('|101>')).toBe(jsqbits.Complex.ZERO);
        });
    });

    describe('#not', function() {
        it("is an alias for x()", function() {
            expect(jsqbits.QState.prototype.not).toBe(jsqbits.QState.prototype.x);
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
        it ("should project onto the specified bits", function() {
            var bitRange = {from:1, to:2};
            var x = qstate('|1000>').hadamard(2).hadamard(0).projectOnto(bitRange);
            expect(x.numBits).toBe(2);
            expect(x.amplitude('|00>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(x.amplitude('|01>')).toBe(jsqbits.Complex.ZERO);
            expect(x.amplitude('|10>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(x.amplitude('|11>')).toBe(jsqbits.Complex.ZERO);
        });
    });

    describe('#measure', function(){
        var bitRange = {from:1, to:2};
        var stateToMeasure;
        beforeEach(function() {
//            0.5 |1000> + 0.5 |1001> + 0.5 |1100> + 0.5 |1101>
            stateToMeasure = qstate('|1000>').hadamard(2).hadamard(0);
        });

        it ("should return the new states for outcome of 00 (random returns 0)", function() {
            stateToMeasure.random = function() {return 0};
            var result = stateToMeasure.measure(bitRange);
            var newState = result.newState;
            expect(newState.numBits).toBe(4);
            expect(result.measurement).toBe(0);
            expect(newState.amplitude('|1000>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(newState.amplitude('|1001>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(newState.amplitude('|1100>')).toBe(jsqbits.Complex.ZERO);
            expect(newState.amplitude('|1101>')).toBe(jsqbits.Complex.ZERO);
        });

        it ("should return the new states for outcome of 00 (random returns 0.49)", function() {
            stateToMeasure.random = function() {return 0.49};
            var result = stateToMeasure.measure(bitRange);
            var newState = result.newState;
            expect(newState.numBits).toBe(4);
            expect(result.measurement).toBe(0);
            expect(newState.amplitude('|1000>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(newState.amplitude('|1001>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(newState.amplitude('|1100>')).toBe(jsqbits.Complex.ZERO);
            expect(newState.amplitude('|1101>')).toBe(jsqbits.Complex.ZERO);
        });

        it ("should return the new states for outcome of 10 (random returns 0.51)", function() {
            stateToMeasure.random = function() {return 0.51};
            var result = stateToMeasure.measure(bitRange);
            var newState = result.newState;
            expect(newState.numBits).toBe(4);
            expect(result.measurement).toBe(2);
            expect(newState.amplitude('|1000>')).toBe(jsqbits.Complex.ZERO);
            expect(newState.amplitude('|1001>')).toBe(jsqbits.Complex.ZERO);
            expect(newState.amplitude('|1100>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(newState.amplitude('|1101>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
        });

        it ("should return the new states for outcome of 10 (random returns 1.0)", function() {
            stateToMeasure.random = function() {return 1.0};
            var result = stateToMeasure.measure(bitRange);
            var newState = result.newState;
            expect(newState.numBits).toBe(4);
            expect(result.measurement).toBe(2);
            expect(newState.amplitude('|1000>')).toBe(jsqbits.Complex.ZERO);
            expect(newState.amplitude('|1001>')).toBe(jsqbits.Complex.ZERO);
            expect(newState.amplitude('|1100>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(newState.amplitude('|1101>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
        });

        it ("Can measure bit zero", function() {
            stateToMeasure.random = function() {return 1.0};
            var result = stateToMeasure.measure(0);
            var newState = result.newState;
            expect(newState.numBits).toBe(4);
            expect(result.measurement).toBe(1);
            expect(newState.amplitude('|1000>')).toBe(jsqbits.Complex.ZERO);
            expect(newState.amplitude('|1001>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
            expect(newState.amplitude('|1100>')).toBe(jsqbits.Complex.ZERO);
            expect(newState.amplitude('|1101>')).toBeApprox(complex(1 / Math.sqrt(2), 0));
        });

        it ("Can measure all bits", function() {
            stateToMeasure.random = function() {return 0.49};
            var result = stateToMeasure.measure(jsqbits.ALL);
            var newState = result.newState;
            expect(newState.numBits).toBe(4);
            expect(result.measurement).toBe(parseInt('1001', 2));
            expect(newState.amplitude('|1000>')).toBe(jsqbits.Complex.ZERO);
            expect(newState.amplitude('|1001>')).toBeApprox(complex(1, 0));
            expect(newState.amplitude('|1100>')).toBe(jsqbits.Complex.ZERO);
            expect(newState.amplitude('|1101>')).toBe(jsqbits.Complex.ZERO);
        });

        it ("actually calls Math.random", function() {
            var result = stateToMeasure.measure(3);
            var newState = result.newState;
            expect(newState.numBits).toBe(4);
            expect(result.measurement).toBe(1);
            expect(newState.amplitude('|1000>')).toBeApprox(complex(0.5, 0));
            expect(newState.amplitude('|1001>')).toBeApprox(complex(0.5, 0));
            expect(newState.amplitude('|1100>')).toBeApprox(complex(0.5, 0));
            expect(newState.amplitude('|1101>')).toBeApprox(complex(0.5, 0));
        });

    });
});
