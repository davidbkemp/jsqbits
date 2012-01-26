
describe('Complex', function() {
    var complex = function(real, imaginary) {
        return new jsqbits.Complex(real, imaginary);
    };

    var w;
    var x;
    var y;
    beforeEach(function() {
        w = complex(-4, 3);
        x = complex(1, 3);
        y = complex(10, 30);
        this.addMatchers(jsqbits.JasmineMatchers);
    });

    describe('#add', function() {
        it("adds complex numbers", function() {
            var z = x.add(y);
            expect(z.real).toEqual(11);
            expect(z.imaginary).toEqual(33);
        });
    });

    describe('#multiply', function() {
        it("multiplies complex numbers", function() {
            var z = x.multiply(y);
            expect(z.real).toEqual(10 - 90);
            expect(z.imaginary).toEqual(60);
        });
    });

    describe('#negate', function() {
        it("negates complex numbers", function() {
            var z = x.negate();
            expect(z.real).toEqual(-1);
            expect(z.imaginary).toEqual(-3);
        });
    });

    describe('#magnitude', function() {
        it('returns the magnitude', function() {
            expect(w.magnitude()).toEqual(5);
        });
    });

    describe('#subtract', function() {
        it('subtracts its argument from itself', function(){
            expect(y.subtract(w)).toEqual(complex(14, 27));
        });
    });

    describe('#format', function() {
        it('should use toString when no options', function() {
            expect(complex(-1.23, 3.4).format()).toEqual('-1.23+3.4i');
        });

        it('should round off decimal places when requested', function() {
            expect(complex(-1.235959, 3.423523).format({decimalPlaces: 3})).toEqual('-1.236+3.424i');
        });

        it ('should prefix with spaced sign when requested (positive real)', function() {
            expect(complex(1.235959, -3.423523).format({decimalPlaces: 3, spacedSign: true})).toEqual(' + 1.236-3.424i');
        });
        it ('should prefix with spaced sign when requested (negative real)', function() {
            expect(complex(-1.235959, 3.423523).format({decimalPlaces: 3, spacedSign: true})).toEqual(' - 1.236-3.424i');
        });
        it ('should prefix with spaced sign when requested (zero real, positive imaginary)', function() {
            expect(complex(0, 3.423523).format({decimalPlaces: 3, spacedSign: true})).toEqual(' + 3.424i');
        });
        it ('should prefix with spaced sign when requested (zero real, negative imaginary)', function() {
            expect(complex(0, -3.423523).format({decimalPlaces: 3, spacedSign: true})).toEqual(' - 3.424i');
        });
    });
});

