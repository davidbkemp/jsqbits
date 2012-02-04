jsqbits.JasmineMatchers = jsqbits.JasmineMatchers || {};

jsqbits.JasmineMatchers.toBeApprox = function(expected) {
    return  Math.abs(this.actual.real - expected.real) < 0.0001 &&
                Math.abs(this.actual.imaginary - expected.imaginary) < 0.0001
}
