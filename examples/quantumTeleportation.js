/*
 * The quantum teleportation algorithm
 * If Alice and Bob share a pair of entangled qubits, then Alice can transmit the state of a third qubit to Bob
 * by sending just two classical bits.
 */

var applyTeleportation = function(state) {
    var alicesMeasurement = state.cnot(2, 1).hadamard(2).measure({from: 1, to: 2});
    var resultingState = alicesMeasurement.newState;
    if (alicesMeasurement.result & 1) {
        resultingState = resultingState.x(0);
    }
    if (alicesMeasurement.result & 2) {
        resultingState = resultingState.z(0);
    }
    return resultingState;
};

// The state of the qubit to be transmitted consists of the amplitude of |0> and the amplitude of |1>
// Any two complex values can be chosen here so long as the sum of their magnitudes adds up to 1.
// For this example, we choose to transmit the state: 0.5+0.5i |0> + 0.7071i |1>
var stateToBeTransmitted0 = jsqbits.complex(0.5, 0.5);
var stateToBeTransmitted1 = jsqbits.complex(0, Math.sqrt(0.5));

// The quantum computer is initialized as a three qubit system with bits 0 and 1 being the qbits shared by Alice and Bob
// and bit 2 being the qubit to be transmitted.
var initialAmplitudes = [];
initialAmplitudes[0] = stateToBeTransmitted0;
initialAmplitudes[4] = stateToBeTransmitted1;
var initialState = new jsqbits.QState(3, initialAmplitudes);
// Need to put bits 0 and 1 into a Bell State:
initialState = initialState.hadamard(1).cnot(1,0);

// Now apply the Teleportation algorithm
var finalState = applyTeleportation(initialState);

// By this stage, only bit zero has not been measured and it should have the same state the original state to be transmitted.
// The other two bits will have random values but will be in definite states.
// ie. finalState should be
// stateToBeTransmitted0 |xx0> + stateToBeTransmitted1 |xx1>
// where the bit values of bits 1 and 2 (xx) are identical in the two states.
// If we had some way of projecting onto bit 0, we would have
// stateToBeTransmitted0 |0> + stateToBeTransmitted1 |1>

finalState