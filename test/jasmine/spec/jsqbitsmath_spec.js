describe("jsqbitsmath", function() {
    beforeEach(function() {
        this.addMatchers(jsqbits.JasmineMatchers);
    });

    describe("#nullSpace", function() {
        it("should solve Ax=0", function() {
            var a = [
                parseInt('001', 2),
                parseInt('111', 2),
                parseInt('110', 2),
                parseInt('000', 2)
            ];
            var results = jsqbitsmath.findNullSpaceMod2(a, 3);
            expect(results).toEqual([parseInt('110', 2)]);
        });
    });

});