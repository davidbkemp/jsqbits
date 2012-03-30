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

// The state of the qubit to be transmitted consists of the amplitude of |0> and the amplitude of |1> as follows:
var stateToBeTransmitted0 = jsqbits.complex(0.5, 0.5);
var stateToBeTransmitted1 = jsqbits.complex(0, Math.sqrt(0.5));

// The quantum computer is initialized as a three qubit system with bits 0 and 1 being the qbits shared by Alice and Bob
// and bit 2 being the qubit to be transmitted.
var initialAmplitudes = [];
initialAmplitudes[0] = stateToBeTransmitted0;
initialAmplitudes[4] = stateToBeTransmitted1;
var initialState = new jsqbits.QState(3, initialAmplitudes);
// Need to put bits 0 and 1 into an Bell State:
initialState = initialState.hadamard(1).cnot(1,0);

// Now apply the Teleportation algorithm
var finalState = applyTeleportation(initialState);

// By this stage, only bit zero has not been measured and it should have the same state the original state to be transmitted.
var receivedAmplitudeFor0 = null;
var receivedAmplitudeFor1 = null;
finalState.each(function(stateWithAmplitude) {
    if (stateWithAmplitude.asNumber() % 2 == 0) {
        if (receivedAmplitudeFor0 != null) throw "Should only have one state with bit 0 being 0";
        receivedAmplitudeFor0 = stateWithAmplitude.amplitude;
    } else {
        if (receivedAmplitudeFor1 != null) throw "Should only have one state with bit 0 being 1";
        receivedAmplitudeFor1 = stateWithAmplitude.amplitude;
    }
});

receivedAmplitudeFor0.format({decimalPlaces: 4}) + ' |0> + ' + receivedAmplitudeFor1.format({decimalPlaces: 4}) + ' |1> '