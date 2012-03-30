/*
 * Super Dense Coding.
 * If Alice and Bob share a pair of entangled qubits, then Alice can encode two classical bits into her one entangled qubit,
 * send it to Bob, and Bob can decode it with the help of his entangled qubit
 */

var superDense = function(input) {
    var state = jsqbits('|00>').hadamard(0).cnot(0, 1);

//            Alice prepares her qbit
    var alice = 1;
    if (input.charAt(0) === '1') {
        state = state.z(alice);
    }
    if (input.charAt(1) === '1') {
        state = state.x(alice);
    }

//            Alice sends her qbit to Bob
    var bob = 0;
    state = state.cnot(alice, bob).hadamard(alice);
    return state.measure(ALL).asBitString();
};

//superDense('00');
//superDense('01');
//superDense('10');
superDense('11');