/**
 *    Copyright 2012 David Kemp

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */

function jsqbits(bitString) {
    return jsqbits.QState.fromBits(bitString)
};

new function() {

    jsqbits.Complex = function(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    };

    jsqbits.Complex.prototype.add = function(other) {
        if (typeof other == 'number') {
            return new jsqbits.Complex(this.real + other, this.imaginary);
        }
        return new jsqbits.Complex(this.real + other.real, this.imaginary + other.imaginary);
    };

    jsqbits.Complex.prototype.multiply = function(other) {
        if (typeof other == 'number') {
            return new jsqbits.Complex(this.real * other, this.imaginary * other);
        }
        return new jsqbits.Complex(this.real * other.real - this.imaginary * other.imaginary,
                    this.real * other.imaginary + this.imaginary * other.real);
    };

    jsqbits.Complex.prototype.toString = function() {
        if (this.imaginary == 0) return "" + this.real;
        if (this.real == 0) return "" + this.imaginary + 'i';
        var sign = (this.imaginary < 0) ? "" : "+";
        return this.real + sign + this.imaginary + "i";
    };

    jsqbits.Complex.prototype.format = function(options) {
        var realValue = this.real;
        var imaginaryValue = this.imaginary;
        if (options && options.decimalPlaces != null) {
            var roundingMagnitude = Math.pow(10, options.decimalPlaces);
            realValue = Math.round(realValue * roundingMagnitude) /roundingMagnitude;
            imaginaryValue = Math.round(imaginaryValue * roundingMagnitude) /roundingMagnitude;
        }
        var objectToFormat = new jsqbits.Complex(realValue, imaginaryValue);
        var prefix = '';
        if (options && options.spacedSign) {
            if (objectToFormat.real > 0) {
                prefix = ' + ';
            } else if (objectToFormat.real < 0) {
                prefix = ' - ';
                objectToFormat = objectToFormat.negate();
            } else if (objectToFormat.imaginary >= 0) {
                prefix = ' + ';
            } else {
                prefix = ' - ';
                objectToFormat = objectToFormat.negate();
            }
        }
        return prefix + (objectToFormat.toString());
    }

    jsqbits.Complex.prototype.negate = function() {
        return new jsqbits.Complex(-this.real, -this.imaginary);
    }

    jsqbits.Complex.prototype.magnitude = function() {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }

    jsqbits.Complex.prototype.subtract = function(other) {
        if (typeof other == 'number') {
            return new jsqbits.Complex(this.real - other, this.imaginary);
        }
        return new jsqbits.Complex(this.real - other.real, this.imaginary - other.imaginary);
    }

    jsqbits.Complex.ZERO = new jsqbits.Complex(0,0);

    jsqbits.ALL = 'ALL';

    jsqbits.QState = function(numBits, amplitudes) {
        this.numBits = numBits;
        this.amplitudes = amplitudes;
    };

    jsqbits.QState.fromBits = function(bitString) {
        var parsedBitString = parseBitString(bitString);
        var amplitudes = [];
        amplitudes[parsedBitString.value] = complex(1,0);
        return new jsqbits.QState(parsedBitString.length, amplitudes);
    }

    jsqbits.QState.prototype.amplitude = function(index) {
        var numericIndex = (typeof index == 'string') ? parseBitString(index).value : index;
        return this.amplitudes[numericIndex] || Complex.ZERO;
    };

    jsqbits.QState.prototype.controlledHadamard = function(controlBit, targetBits, angle) {
        return this.controlledApplicatinOfqBitOperator(controlBit, targetBits, function(amplitudeOf0, amplitudeOf1){
            var newAmplitudeOf0 = amplitudeOf0.add(amplitudeOf1).multiply(squareRootOfOneHalf);
            var newAmplitudeOf1 = amplitudeOf0.subtract(amplitudeOf1).multiply(squareRootOfOneHalf);
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsqbits.QState.prototype.hadamard = function(targetBits) {
        return this.controlledHadamard(null, targetBits);
    };

    jsqbits.QState.prototype.controlledXRotation = function(controlBit, targetBits, angle) {
        return this.controlledApplicatinOfqBitOperator(controlBit, targetBits, function(amplitudeOf0, amplitudeOf1){
            var halfAngle = angle / 2;
            var cos = complex(Math.cos(halfAngle), 0);
            var negative_i_sin = complex(0, -Math.sin(halfAngle));
            var newAmplitudeOf0 = amplitudeOf0.multiply(cos).add(amplitudeOf1.multiply(negative_i_sin));
            var newAmplitudeOf1 = amplitudeOf0.multiply(negative_i_sin).add(amplitudeOf1.multiply(cos));
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsqbits.QState.prototype.rotateX = function(targetBits, angle) {
        return this.controlledXRotation(null, targetBits, angle);
    }

    jsqbits.QState.prototype.controlledYRotation = function(controlBit, targetBits, angle) {
        return this.controlledApplicatinOfqBitOperator(controlBit, targetBits, function(amplitudeOf0, amplitudeOf1){
            var halfAngle = angle / 2;
            var cos = complex(Math.cos(halfAngle), 0);
            var sin = complex(Math.sin(halfAngle), 0);
            var newAmplitudeOf0 = amplitudeOf0.multiply(cos).add(amplitudeOf1.multiply(sin.negate()));
            var newAmplitudeOf1 = amplitudeOf0.multiply(sin).add(amplitudeOf1.multiply(cos));
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsqbits.QState.prototype.rotateY = function(targetBits, angle) {
        return this.controlledYRotation(null, targetBits, angle);
    }

    jsqbits.QState.prototype.controlledZRotation = function(controlBit, targetBits, angle) {
        return this.controlledApplicatinOfqBitOperator(controlBit, targetBits, function(amplitudeOf0, amplitudeOf1){
            var halfAngle = angle / 2;
            var cos = complex(Math.cos(halfAngle), 0);
            var i_sin = complex(0, Math.sin(halfAngle));
            var newAmplitudeOf0 = amplitudeOf0.multiply(cos.subtract(i_sin));
            var newAmplitudeOf1 = amplitudeOf1.multiply(cos.add(i_sin));
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsqbits.QState.prototype.rotateZ = function(targetBits, angle) {
        return this.controlledZRotation(null, targetBits, angle);
    }

    jsqbits.QState.prototype.controlledX = function(controlBit, targetBits) {
        return this.controlledApplicatinOfqBitOperator(controlBit, targetBits, function(amplitudeOf0, amplitudeOf1){
            return {amplitudeOf0: amplitudeOf1, amplitudeOf1: amplitudeOf0};
        });
    }

    jsqbits.QState.prototype.cnot = jsqbits.QState.prototype.controlledX;

    jsqbits.QState.prototype.x = function(targetBits) {
        return this.controlledX(null, targetBits);
    };

    jsqbits.QState.prototype.not = jsqbits.QState.prototype.x;

    jsqbits.QState.prototype.controlledY = function(controlBit, targetBits) {
        return this.controlledApplicatinOfqBitOperator(controlBit, targetBits,  function(amplitudeOf0, amplitudeOf1){
            return {amplitudeOf0: amplitudeOf1.multiply(complex(0, -1)), amplitudeOf1: amplitudeOf0.multiply(complex(0, 1))};
        });
    };

    jsqbits.QState.prototype.y = function(targetBits) {
        return this.controlledY(null, targetBits);
    };

    jsqbits.QState.prototype.controlledZ = function(controlBit, targetBits) {
        return this.controlledApplicatinOfqBitOperator(controlBit, targetBits, function(amplitudeOf0, amplitudeOf1){
            return {amplitudeOf0: amplitudeOf0, amplitudeOf1: amplitudeOf1.negate()};
        });
    };

    jsqbits.QState.prototype.z = function(targetBits) {
        return this.controlledZ(null, targetBits);
    };

    jsqbits.QState.prototype.controlledApplicatinOfqBitOperator = function(controlBit, targetBits, qbitFunction) {
        var bitRange = convertBitQualifierToBitRange(targetBits, this.numBits);
        var result = this;
        for (var bit = bitRange.from; bit <= bitRange.to; bit++) {
            result = applyToOneBit(controlBit, bit, qbitFunction, result);
        }
        return result;
    };

    jsqbits.QState.prototype.applyFunction = function(bits, targetBit, functionToApply) {
        var bitRange = convertBitQualifierToBitRange(bits, this.numBits);
        var newAmplitudes = [];
        var statesThatCanBeSkipped = [];
        var highBitMask = (1 << (bitRange.to+1)) - 1;
        var targetBitMask = 1 << targetBit;

        for(var stateString in this.amplitudes) {
            var state = parseInt(stateString);
            if (statesThatCanBeSkipped[state]) continue;
            statesThatCanBeSkipped[state^targetBitMask] = true;
            var indexOf1 = state | targetBitMask;
            var indexOf0 = indexOf1 - targetBitMask;
            var input = (state & highBitMask) >> bitRange.from;
            if (functionToApply(input) == 1) {
                sparseAssign(newAmplitudes, indexOf0, this.amplitude(indexOf1));
                sparseAssign(newAmplitudes, indexOf1, this.amplitude(indexOf0));
            } else {
                sparseAssign(newAmplitudes, indexOf0, this.amplitude(indexOf0));
                sparseAssign(newAmplitudes, indexOf1, this.amplitude(indexOf1));
            }
        }
        return new jsqbits.QState(this.numBits, newAmplitudes);
    };

    jsqbits.QState.prototype.projectOnto = function(bits) {
        var bitRange = convertBitQualifierToBitRange(bits, this.numBits);
        var highBitMask = (1 << (bitRange.to+1)) - 1;

        var newAmplitudes = [];
        for(var stateString in this.amplitudes) {
            var state = parseInt(stateString);
            var newState = (state & highBitMask) >> bitRange.from;
            var currentValueOfNewState = newAmplitudes[newState] || Complex.ZERO;
            sparseAssign(newAmplitudes, newState, currentValueOfNewState.add(this.amplitudes[state]));
        }

        normalize(newAmplitudes);
        return new jsqbits.QState(bitRange.to - bitRange.from + 1, newAmplitudes);
    };

    jsqbits.QState.prototype.random = Math.random;

    jsqbits.QState.prototype.measure = function(bits) {
        var bitRange = convertBitQualifierToBitRange(bits, this.numBits);
        var randomNumber = this.random();
        var randomStateString;
        var accumulativeSquareAmplitudeMagnitude = 0;
        for (var stateString in this.amplitudes) {
            var magnitude = this.amplitudes[stateString].magnitude();
            accumulativeSquareAmplitudeMagnitude += magnitude * magnitude;
            randomStateString = stateString;
            if (accumulativeSquareAmplitudeMagnitude > randomNumber) {
                break;
            }
        }
        var randomState = parseInt(randomStateString);

        var highBitMask = (1 << (bitRange.to+1)) - 1;
        var measurementOutcome = (randomState & highBitMask) >> bitRange.from;

        var newAmplitudes = [];
        for(var stateString in this.amplitudes) {
            var state = parseInt(stateString);
            var comparisonState = (state & highBitMask) >> bitRange.from;
            if (comparisonState == measurementOutcome) {
                newAmplitudes[state] = this.amplitudes[state];
            }
        }

        normalize(newAmplitudes);
        return {measurement: measurementOutcome, newState: new jsqbits.QState(this.numBits, newAmplitudes)};
    };

    jsqbits.QState.prototype.toString = function() {
        var result = '';
        var formatFlags = {decimalPlaces: 4};
        for(var stateString in this.amplitudes) {
            if (result !== '') formatFlags.spacedSign = true;
            var state = padState(parseInt(stateString).toString(2), this.numBits);
            result = result + this.amplitudes[stateString].format(formatFlags) + " |" + state + ">"
        }
        return result;
    }

    var Complex = jsqbits.Complex;

    var complex = function(real, imaginary) {
        return new Complex(real, imaginary);
    };

    var squareRootOfOneHalf = complex(1/Math.sqrt(2),0);

    var parseBitString = function(bitString) {
        // Strip optional 'ket' characters to support |0101>
        bitString = bitString.replace(/^\|/,'').replace(/>$/,'');
        return {value: parseInt(bitString, 2), length: bitString.length};
    };

    var normalize = function(amplitudes) {
        var sumOfMagnitudeSqaures = 0;
        for(var state in amplitudes) {
            var magnitude = amplitudes[state].magnitude();
            sumOfMagnitudeSqaures += magnitude * magnitude;
        }
        var scale = 1 / Math.sqrt(sumOfMagnitudeSqaures);
        for(var state in amplitudes) {
            amplitudes[state] = amplitudes[state].multiply(scale);
        }
    };

    var sparseAssign = function(array, index, value) {
        // Try to avoid assigning values and try to make zero exactly zero.
        if (value.magnitude() > 0.0000001) {
            array[index] = value;
        }
    }

    var convertBitQualifierToBitRange = function(bits, numBits) {
        if (bits == null) {
            throw "bit qualification must be supplied";
        } else if (bits == jsqbits.ALL) {
            return {from: 0, to: numBits - 1};
        } else if (bits.from != null && bits.to != null) {
            if (bits.from > bits.to) {
                throw "bit range must have 'from' being less than or equal to 'to'"
            }
            return bits
        } else if (typeof bits == 'number') {
            return {from: bits, to: bits};
        } else {
            throw "bit qualification must be either: a number, jsqbits.ALL, or {from: n, to: m}";
        }
    };

    var padState = function(state, numBits) {
        var paddingLength = numBits - state.length;
        for (i = 0; i < paddingLength; i++) {
            state = '0' + state;
        }
        return state;
    };

    var applyToOneBit = function(controlBit, targetBit, qbitFunction, qState) {
        var newAmplitudes = [];
        var statesThatCanBeSkipped = [];
        var targetBitMask = 1 << targetBit;
        var controlBitMask = controlBit == null ? 0 : 1 << controlBit;

        for (var stateString in qState.amplitudes) {
            var state = parseInt(stateString);
            if (statesThatCanBeSkipped[state]) continue;
            statesThatCanBeSkipped[state ^ targetBitMask] = true;
            var indexOf1 = state | targetBitMask;
            var indexOf0 = indexOf1 - targetBitMask;
            if (controlBit == null || (state & controlBitMask)) {
                var result = qbitFunction(qState.amplitude(indexOf0), qState.amplitude(indexOf1));
                sparseAssign(newAmplitudes, indexOf0, result.amplitudeOf0);
                sparseAssign(newAmplitudes, indexOf1, result.amplitudeOf1);
            } else {
                sparseAssign(newAmplitudes, indexOf0, qState.amplitude(indexOf0));
                sparseAssign(newAmplitudes, indexOf1, qState.amplitude(indexOf1));
            }
        }
        return new jsqbits.QState(qState.numBits, newAmplitudes);
    };

}();