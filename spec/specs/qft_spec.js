describe('QState.qft (Quantum Fourier Transform)', function() {
    var complex = jsqbits.complex;
    var real = jsqbits.real;

    beforeEach(function() {
        this.addMatchers(jsqbits.JasmineMatchers);
    });

    it('Should be a Hadamard when applied to one bit', function() {
        var initialState = jsqbits("|0>").add(jsqbits("|1>")).normalize();
        var newState = initialState.qft([0]);
        expect(newState.toString()).toEqual("|0>");
    });

    it('Should be a Hadamard when applied to all zeros', function() {
        var initialState = jsqbits("|00>");
        var newState = initialState.qft([0,1]);
        expect(newState.toString()).toEqual("0.5 |00> + 0.5 |01> + 0.5 |10> + 0.5 |11>");
    });

    it('Should find the period of a simple periodic state', function() {
        var initialState = jsqbits("|000>").add(jsqbits("|100>")).normalize();
        var newState = initialState.qft([0,1,2]);
        expect(newState.toString()).toEqual("0.5 |000> + 0.5 |010> + 0.5 |100> + 0.5 |110>");
    });

    it('Should find the period of a simple periodic state offset by 1', function() {
        var initialState = jsqbits("|001>").add(jsqbits("|101>")).normalize();
        var newState = initialState.qft([0,1,2]);
        expect(newState.toString()).toEqual("0.5 |000> + 0.5i |010> - 0.5 |100> - 0.5i |110>");
    });

});