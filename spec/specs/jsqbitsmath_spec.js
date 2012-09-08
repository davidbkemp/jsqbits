describe("jsqbitsmath", function() {
    beforeEach(function() {
        this.addMatchers(jsqbits.JasmineMatchers);
    });

    describe("#nullSpace", function() {
        it("should solve Ax=0 (single solution)", function() {
            var a = [
                parseInt('001', 2),
                parseInt('111', 2),
                parseInt('110', 2),
                parseInt('000', 2)
            ];
            var results = jsqbitsmath.findNullSpaceMod2(a, 3);
            expect(results).toEqual([parseInt('110', 2)]);
        });

        it("should solve Ax=0 (three bits in solution)", function() {
            var a = [
                parseInt('101', 2),
                parseInt('011', 2),
            ];
            var results = jsqbitsmath.findNullSpaceMod2(a, 3);
            expect(results).toEqual([parseInt('111', 2)]);
        });

        it("should solve Ax=0 (many solutions)", function() {
//            Should reduce to
//            0101101
//            0000011
            var a = [
                parseInt('0101110', 2),
                parseInt('0101101', 2)
            ];
            var results = jsqbitsmath.findNullSpaceMod2(a, 7);
            expect(results.sort()).toEqual([
                parseInt('1000000', 2),
                parseInt('0010000', 2),
                parseInt('0101000', 2),
                parseInt('0100100', 2),
                parseInt('0100011', 2),
            ].sort());
        });
    });

    describe("continuedFraction", function() {
        it("should compute the continued fraction of 1/3", function() {
            var results = jsqbitsmath.continuedFraction(1/3, 0.0001);
            expect(results.numerator).toEqual(1);
            expect(results.denominator).toEqual(3);
            expect(results.quotients).toEqual([0,3]);
        });

        it("should compute the continued fraction of 11/13", function() {
            var results = jsqbitsmath.continuedFraction(11/13, 0.0001);
            expect(results.numerator).toEqual(11);
            expect(results.denominator).toEqual(13);
            expect(results.quotients).toEqual([0,1,5,2]);
        });

        it("should stop when the desired accuracy is reached", function() {
            var results = jsqbitsmath.continuedFraction(Math.PI, 0.000001);
            expect(results.numerator).toEqual(355);
            expect(results.denominator).toEqual(113);
            expect(results.quotients).toEqual([3,7,15,1]);
        });

        it("should work for negative numbers", function() {
            var results = jsqbitsmath.continuedFraction(-Math.PI, 0.000001);
            expect(results.numerator).toEqual(-355);
            expect(results.denominator).toEqual(113);
            expect(results.quotients).toEqual([-3,-7,-15,-1]);
        });
    });

});