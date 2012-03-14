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

        it("should solve Ax=0 (many solutions)", function() {
            var a = [
                parseInt('0101110', 2),
                parseInt('0101101', 2)
            ];
            var results = jsqbitsmath.findNullSpaceMod2(a, 7);
            expect(results.sort()).toEqual([
                parseInt('0101000', 2),
                parseInt('0100100', 2),
                parseInt('0100001', 2),
                parseInt('0000011', 2)
            ].sort());
        });
    });

});