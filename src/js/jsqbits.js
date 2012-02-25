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

/**
 * For documentation, and the latest version, see http://www.jsqbits.org/
 */

function jsqbits(bitString) {
    return jsqbits.QState.fromBits(bitString);
}

(function() {

    var isNull = function(x) {
        return x === null || x === undefined;
    };

    var validateArgs = function(args, minimum) {
        var maximum = 10000;
        var message = 'Must supply at least ' + minimum + ' parameters.';
        if (arguments.length > 4) throw "Internal error: too many arguments to validateArgs";
        if (arguments.length === 4) {
            maximum = arguments[2];
            message = arguments[3];
        } else if (arguments.length === 3) {
            message = arguments[2];
        }
        if (args.length < minimum || args.length > maximum) {
            throw message;
        }
    };

    var parseBitString = function(bitString) {
        // Strip optional 'ket' characters to support |0101>
        bitString = bitString.replace(/^\|/,'').replace(/>$/,'');
        return {value: parseInt(bitString, 2), length: bitString.length};
    };

    var sparseAssign = function(array, index, value) {
        // Try to avoid assigning values and try to make zero exactly zero.
        if (value.magnitude() > jsqbits.roundToZero) {
            array[index] = value;
        }
    };

    var convertBitQualifierToBitRange = function(bits, numBits) {
        if (isNull(bits)) {
            throw "bit qualification must be supplied";
        } else if (bits === jsqbits.ALL) {
            return {from: 0, to: numBits - 1};
        } else if (typeof bits === 'number') {
            return {from: bits, to: bits};
        } else if (!isNull(bits.from) && !isNull(bits.to)) {
            if (bits.from > bits.to) {
                throw "bit range must have 'from' being less than or equal to 'to'";
            }
            return bits;
        } else {
            throw "bit qualification must be either: a number, jsqbits.ALL, or {from: n, to: m}";
        }
    };

    var bitRangeAsArray = function(low, high) {
        if (low > high) {
            throw "bit range must have 'from' being less than or equal to 'to'";
        }
        var result = [];
        for (var i = low; i <= high; i++) {
            result.push(i);
        }
        return result;
    };

    var convertBitQualifierToBitArray = function(bits, numBits) {
        if (isNull(bits)) {
            throw "bit qualification must be supplied";
        }
        if (bits instanceof Array) {
            return bits;
        }
        if (typeof bits === 'number') {
            return [bits];
        }
        if (bits === jsqbits.ALL) {
            return bitRangeAsArray(0, numBits - 1);
        }
        if (!isNull(bits.from) && !isNull(bits.to)) {
            return bitRangeAsArray(bits.from, bits.to);
        }
        throw "bit qualification must be either: a number, an array or numbers, jsqbits.ALL, or {from: n, to: m}";
    };

    jsqbits.Complex = function(real, imaginary) {
        validateArgs(arguments, 2, 2, 'Must supply real and imaginary parameters to Complex()');
        this.real = function() {return real;};
        this.imaginary = function() {return imaginary;};
    };

    jsqbits.Complex.prototype.add = function(other) {
        validateArgs(arguments, 1, 1, 'Must 1 parameter to add()');
        if (typeof other === 'number') {
            return new jsqbits.Complex(this.real() + other, this.imaginary());
        }
        return new jsqbits.Complex(this.real() + other.real(), this.imaginary() + other.imaginary());
    };

    jsqbits.Complex.prototype.multiply = function(other) {
        validateArgs(arguments, 1, 1, 'Must 1 parameter to multiply()');
        if (typeof other === 'number') {
            return new jsqbits.Complex(this.real() * other, this.imaginary() * other);
        }
        return new jsqbits.Complex(this.real() * other.real() - this.imaginary() * other.imaginary(),
                    this.real() * other.imaginary() + this.imaginary() * other.real());
    };

    jsqbits.Complex.prototype.toString = function() {
        if (this.imaginary() === 0) return "" + this.real();
        var imaginaryString;
        if (this.imaginary() === 1) {
            imaginaryString = 'i';
        } else if (this.imaginary() === -1) {
            imaginaryString = '-i';
        } else {
            imaginaryString = this.imaginary() + 'i';
        }
        if (this.real() === 0) return imaginaryString;
        var sign = (this.imaginary() < 0) ? "" : "+";
        return this.real() + sign + imaginaryString;
    };

    jsqbits.Complex.prototype.format = function(options) {
        var realValue = this.real();
        var imaginaryValue = this.imaginary();
        if (options && !isNull(options.decimalPlaces)) {
            var roundingMagnitude = Math.pow(10, options.decimalPlaces);
            realValue = Math.round(realValue * roundingMagnitude) /roundingMagnitude;
            imaginaryValue = Math.round(imaginaryValue * roundingMagnitude) /roundingMagnitude;
        }
        var objectToFormat = new jsqbits.Complex(realValue, imaginaryValue);
        var prefix = '';
        if (options && options.spacedSign) {
            if (objectToFormat.real() > 0) {
                prefix = ' + ';
            } else if (objectToFormat.real() < 0) {
                prefix = ' - ';
                objectToFormat = objectToFormat.negate();
            } else if (objectToFormat.imaginary() >= 0) {
                prefix = ' + ';
            } else {
                prefix = ' - ';
                objectToFormat = objectToFormat.negate();
            }
        }
        return prefix + (objectToFormat.toString());
    };

    jsqbits.Complex.prototype.negate = function() {
        return new jsqbits.Complex(-this.real(), -this.imaginary());
    };

    jsqbits.Complex.prototype.magnitude = function() {
        return Math.sqrt(this.real() * this.real() + this.imaginary() * this.imaginary());
    };

    jsqbits.Complex.prototype.subtract = function(other) {
        validateArgs(arguments, 1, 1, 'Must 1 parameter to subtract()');
        if (typeof other === 'number') {
            return new jsqbits.Complex(this.real() - other, this.imaginary());
        }
        return new jsqbits.Complex(this.real() - other.real(), this.imaginary() - other.imaginary());
    };

    jsqbits.Complex.prototype.eql = function(other) {
        if (!(other instanceof jsqbits.Complex)) return false;
        return this.real() === other.real() && this.imaginary() === other.imaginary();
    };

    jsqbits.Complex.ZERO = new jsqbits.Complex(0,0);
    jsqbits.ZERO = jsqbits.Complex.ZERO;

    jsqbits.complex = function(real, imaginary) {
        return new Complex(real, imaginary);
    };

    var Complex = jsqbits.Complex;
    var complex = jsqbits.complex;
   
    jsqbits.ALL = 'ALL';

    // Amplitudes with magnitudes smaller than jsqbits.roundToZero this are rounded off to zero.
    jsqbits.roundToZero = 0.0000001;

    jsqbits.Measurement = function(result, newState) {
        this.result = result;
        this.newState = newState;
    };

    jsqbits.Measurement.prototype.toString = function() {
        return "{result: " + this.result + ", newState: " + this.newState + "}";
    };

    jsqbits.QState = function(numBits, amplitudes) {
        validateArgs(arguments, 2, 2, 'Must 2 parameters to QState()');
        this.numBits = numBits;
        this.amplitudes = amplitudes;
    };

    jsqbits.QState.fromBits = function(bitString) {
        validateArgs(arguments, 1, 1, 'Must supply a bit string');
        var parsedBitString = parseBitString(bitString);
        var amplitudes = {};
        amplitudes[parsedBitString.value] = complex(1,0);
        return new jsqbits.QState(parsedBitString.length, amplitudes);
    };

    jsqbits.QState.prototype.amplitude = function(basisState) {
        validateArgs(arguments, 1, 1, 'Must supply an index to amplitude()');
        var numericIndex = (typeof basisState === 'string') ? parseBitString(basisState).value : basisState;
        return this.amplitudes[numericIndex] || Complex.ZERO;
    };

    jsqbits.QState.prototype.controlledHadamard = (function() {
        var squareRootOfOneHalf = complex(1 / Math.sqrt(2), 0);
        return function(controlBits, targetBits) {
            validateArgs(arguments, 2, 2, 'Must supply control and target bits to controlledHadamard()');
            return this.controlledApplicatinOfqBitOperator(controlBits, targetBits, function(amplitudeOf0, amplitudeOf1) {
                var newAmplitudeOf0 = amplitudeOf0.add(amplitudeOf1).multiply(squareRootOfOneHalf);
                var newAmplitudeOf1 = amplitudeOf0.subtract(amplitudeOf1).multiply(squareRootOfOneHalf);
                return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
            });
        };
    })();

    jsqbits.QState.prototype.hadamard = function(targetBits) {
        validateArgs(arguments, 1, 1, 'Must supply target bits to hadamard() as either a single index or a range.');
        return this.controlledHadamard(null, targetBits);
    };

    jsqbits.QState.prototype.controlledXRotation = function(controlBits, targetBits, angle) {
        validateArgs(arguments, 3, 3, 'Must supply control bits, target bits, and an angle, to controlledXRotation()');
        return this.controlledApplicatinOfqBitOperator(controlBits, targetBits, function(amplitudeOf0, amplitudeOf1){
            var halfAngle = angle / 2;
            var cos = complex(Math.cos(halfAngle), 0);
            var negative_i_sin = complex(0, -Math.sin(halfAngle));
            var newAmplitudeOf0 = amplitudeOf0.multiply(cos).add(amplitudeOf1.multiply(negative_i_sin));
            var newAmplitudeOf1 = amplitudeOf0.multiply(negative_i_sin).add(amplitudeOf1.multiply(cos));
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsqbits.QState.prototype.rotateX = function(targetBits, angle) {
        validateArgs(arguments, 2, 2, 'Must supply target bits and angle to rotateX.');
        return this.controlledXRotation(null, targetBits, angle);
    };

    jsqbits.QState.prototype.controlledYRotation = function(controlBits, targetBits, angle) {
        validateArgs(arguments, 3, 3, 'Must supply control bits, target bits, and an angle, to controlledYRotation()');
        return this.controlledApplicatinOfqBitOperator(controlBits, targetBits, function(amplitudeOf0, amplitudeOf1){
            var halfAngle = angle / 2;
            var cos = complex(Math.cos(halfAngle), 0);
            var sin = complex(Math.sin(halfAngle), 0);
            var newAmplitudeOf0 = amplitudeOf0.multiply(cos).add(amplitudeOf1.multiply(sin.negate()));
            var newAmplitudeOf1 = amplitudeOf0.multiply(sin).add(amplitudeOf1.multiply(cos));
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsqbits.QState.prototype.rotateY = function(targetBits, angle) {
        validateArgs(arguments, 2, 2, 'Must supply target bits and angle to rotateY.');
        return this.controlledYRotation(null, targetBits, angle);
    };

    jsqbits.QState.prototype.controlledZRotation = function(controlBits, targetBits, angle) {
        validateArgs(arguments, 3, 3, 'Must supply control bits, target bits, and an angle, to controlledZRotation()');
        return this.controlledApplicatinOfqBitOperator(controlBits, targetBits, function(amplitudeOf0, amplitudeOf1){
            var halfAngle = angle / 2;
            var cos = complex(Math.cos(halfAngle), 0);
            var i_sin = complex(0, Math.sin(halfAngle));
            var newAmplitudeOf0 = amplitudeOf0.multiply(cos.subtract(i_sin));
            var newAmplitudeOf1 = amplitudeOf1.multiply(cos.add(i_sin));
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsqbits.QState.prototype.rotateZ = function(targetBits, angle) {
        validateArgs(arguments, 2, 2, 'Must supply target bits and angle to rotateZ.');
        return this.controlledZRotation(null, targetBits, angle);
    };

    jsqbits.QState.prototype.controlledX = function(controlBits, targetBits) {
        validateArgs(arguments, 2, 2, 'Must supply control and target bits to cnot() / controlledX().');
        return this.controlledApplicatinOfqBitOperator(controlBits, targetBits, function(amplitudeOf0, amplitudeOf1){
            return {amplitudeOf0: amplitudeOf1, amplitudeOf1: amplitudeOf0};
        });
    };

    jsqbits.QState.prototype.cnot = jsqbits.QState.prototype.controlledX;

    jsqbits.QState.prototype.x = function(targetBits) {
        validateArgs(arguments, 1, 1, 'Must supply target bits to x() / not().');
        return this.controlledX(null, targetBits);
    };

    jsqbits.QState.prototype.not = jsqbits.QState.prototype.x;
    jsqbits.QState.prototype.X = jsqbits.QState.prototype.x;

    jsqbits.QState.prototype.controlledY = function(controlBits, targetBits) {
        validateArgs(arguments, 2, 2, 'Must supply control and target bits to controlledY().');
        return this.controlledApplicatinOfqBitOperator(controlBits, targetBits,  function(amplitudeOf0, amplitudeOf1){
            return {amplitudeOf0: amplitudeOf1.multiply(complex(0, -1)), amplitudeOf1: amplitudeOf0.multiply(complex(0, 1))};
        });
    };

    jsqbits.QState.prototype.y = function(targetBits) {
        validateArgs(arguments, 1, 1, 'Must supply target bits to y().');
        return this.controlledY(null, targetBits);
    };

    jsqbits.QState.prototype.Y = jsqbits.QState.prototype.y;

    jsqbits.QState.prototype.controlledZ = function(controlBits, targetBits) {
        validateArgs(arguments, 2, 2, 'Must supply control and target bits to controlledZ().');
        return this.controlledApplicatinOfqBitOperator(controlBits, targetBits, function(amplitudeOf0, amplitudeOf1){
            return {amplitudeOf0: amplitudeOf0, amplitudeOf1: amplitudeOf1.negate()};
        });
    };

    jsqbits.QState.prototype.z = function(targetBits) {
        validateArgs(arguments, 1, 1, 'Must supply target bits to z().');
        return this.controlledZ(null, targetBits);
    };

    jsqbits.QState.prototype.Z = jsqbits.QState.prototype.z;

    /**
     * Toffoli takes one or more control bits (conventionally two) and one target bit.
     */
    jsqbits.QState.prototype.toffoli = function(/* controlBit, controlBit, ..., targetBit */) {
        validateArgs(arguments, 2, 'At least one control bit and a target bit must be supplied to calls to toffoli()');
        var targetBit = arguments[arguments.length - 1];
        var controlBits = [];
        for (var i = 0; i < arguments.length - 1; i++) {
            controlBits.push(arguments[i]);
        }
        return this.controlledX(controlBits, targetBit);
    };

    jsqbits.QState.prototype.controlledApplicatinOfqBitOperator = (function() {

        var validateTargetBitRangesDontOverlap = function(controlBits, targetBits) {
            if ((controlBits.to >= targetBits.from) && (targetBits.to >= controlBits.from)) {
                throw "control and target bits must not be the same nor overlap";
            }
        };

        // TODO: Needs refactoring!
        var applyToOneBit = function(controlBits, targetBit, qbitFunction, qState) {
            var newAmplitudes = {};
            var statesThatCanBeSkipped = {};
            var targetBitMask = 1 << targetBit;
            var controlBitMask = null;
            if (controlBits) {
                controlBitMask = 0;
                for (var i = 0; i < controlBits.length; i++) {
                    controlBitMask += (1 << controlBits[i]);
                }
            }

            for (var stateString in qState.amplitudes) {
                if (qState.amplitudes.hasOwnProperty(stateString)) {
                    var state = parseInt(stateString, 10);
                    if (statesThatCanBeSkipped[state]) continue;
                    statesThatCanBeSkipped[state ^ targetBitMask] = true;
                    var indexOf1 = state | targetBitMask;
                    var indexOf0 = indexOf1 - targetBitMask;
                    if (isNull(controlBits) || ((state & controlBitMask) === controlBitMask)) {
                        var result = qbitFunction(qState.amplitude(indexOf0), qState.amplitude(indexOf1));
                        sparseAssign(newAmplitudes, indexOf0, result.amplitudeOf0);
                        sparseAssign(newAmplitudes, indexOf1, result.amplitudeOf1);
                    } else {
                        sparseAssign(newAmplitudes, indexOf0, qState.amplitude(indexOf0));
                        sparseAssign(newAmplitudes, indexOf1, qState.amplitude(indexOf1));
                    }
                }
            }
            return new jsqbits.QState(qState.numBits, newAmplitudes);
        };

        return function(controlBits, targetBits, qbitFunction) {
            validateArgs(arguments, 3, 3, 'Must supply control bits, target bits, and qbitFunction to controlledApplicatinOfqBitOperator().');
            var targetBitArray = convertBitQualifierToBitArray(targetBits, this.numBits);
            var controlBitArray = null;
            if (!isNull(controlBits)) {
                controlBitArray = convertBitQualifierToBitArray(controlBits, this.numBits);
                validateTargetBitRangesDontOverlap(controlBitArray, targetBitArray);
            }
            var result = this;
            for (var i = 0; i < targetBitArray.length; i++) {
                var targetBit = targetBitArray[i];
                result = applyToOneBit(controlBitArray, targetBit, qbitFunction, result);
            }
            return result;
        };
    })();

    // TODO: This needs some serious refactoring!!
    jsqbits.QState.prototype.applyFunction = (function() {

        var validateBitRangesAreDistinct = function(controlBits, targetBits) {
            // TODO: Find out if it would sometimes be faster to put one of the bit collections into a hash-set first.
            // Also consider allowing validation to be disabled.
            for (var i = 0; i < controlBits.length; i++) {
                var controlBit = controlBits[i];
                for (var j = 0; j < targetBits.length; i++) {
                    if (controlBit === targetBits[j]) {
                        throw "control and target bits must not be the same nor overlap";
                    }
                }
            }
        };

        return function(inputBits, targetBits, functionToApply) {
            validateArgs(arguments, 3, 3, 'Must supply control bits, target bits, and functionToApply to applyFunction().');
            var inputBitRange = convertBitQualifierToBitRange(inputBits, this.numBits);
            var targetBitRange = convertBitQualifierToBitRange(targetBits, this.numBits);
            validateBitRangesAreDistinct(inputBitRange, targetBitRange);
            var newAmplitudes = {};
            var statesThatCanBeSkipped = {};
            var highBitMask = (1 << (inputBitRange.to + 1)) - 1;
            var targetBitMask = ((1 << (1 + targetBitRange.to - targetBitRange.from)) - 1) << targetBitRange.from;

            for (var stateString in this.amplitudes) {
                if (this.amplitudes.hasOwnProperty(stateString)) {
                    var state = parseInt(stateString, 10);
                    if (statesThatCanBeSkipped[state]) continue;
                    var input = (state & highBitMask) >> inputBitRange.from;
                    var result = (functionToApply(input) << targetBitRange.from) & targetBitMask;
                    var resultingState = state ^ result;
                    if (resultingState === state) {
                        sparseAssign(newAmplitudes, state, this.amplitude(state));
                    } else {
                        statesThatCanBeSkipped[resultingState] = true;
                        sparseAssign(newAmplitudes, state, this.amplitude(resultingState));
                        sparseAssign(newAmplitudes, resultingState, this.amplitude(state));
                    }
                }
            }
            return new jsqbits.QState(this.numBits, newAmplitudes);
        };
    })();

    jsqbits.QState.prototype.random = Math.random;

    // TODO: Refactor this method!
    jsqbits.QState.prototype.measure = (function(bits) {

        var normalize = function(amplitudes) {
            var sumOfMagnitudeSqaures = 0;
            var state;
            for (state in amplitudes) {
                if (amplitudes.hasOwnProperty(state)) {
                    var magnitude = amplitudes[state].magnitude();
                    sumOfMagnitudeSqaures += magnitude * magnitude;
                }
            }
            var scale = 1 / Math.sqrt(sumOfMagnitudeSqaures);
            for (state in amplitudes) {
                if (amplitudes.hasOwnProperty(state)) {
                    amplitudes[state] = amplitudes[state].multiply(scale);
                }
            }
        };

        return function(bits) {
            validateArgs(arguments, 1, 1, 'Must supply bits to be measured to measure().');
            var bitRange = convertBitQualifierToBitRange(bits, this.numBits);
            var randomNumber = this.random();
            var randomStateString;
            var stateString;
            var accumulativeSquareAmplitudeMagnitude = 0;
            for (stateString in this.amplitudes) {
                if (this.amplitudes.hasOwnProperty(stateString)) {
                    var magnitude = this.amplitudes[stateString].magnitude();
                    accumulativeSquareAmplitudeMagnitude += magnitude * magnitude;
                    randomStateString = stateString;
                    if (accumulativeSquareAmplitudeMagnitude > randomNumber) {
                        break;
                    }
                }
            }
            var randomState = parseInt(randomStateString, 10);

            var highBitMask = (1 << (bitRange.to + 1)) - 1;
            var measurementOutcome = (randomState & highBitMask) >> bitRange.from;

            var newAmplitudes = {};
            for (stateString in this.amplitudes) {
                if (this.amplitudes.hasOwnProperty(stateString)) {
                    var state = parseInt(stateString, 10);
                    var comparisonState = (state & highBitMask) >> bitRange.from;
                    if (comparisonState === measurementOutcome) {
                        newAmplitudes[state] = this.amplitudes[state];
                    }
                }
            }

            normalize(newAmplitudes);
            return new jsqbits.Measurement(measurementOutcome, new jsqbits.QState(this.numBits, newAmplitudes));
        };
    })();

    jsqbits.QState.prototype.sortedNonZeroStates = (function() {
        var compareNuumbers = function(a, b)
        {
            return a - b;
        };

        return function() {
            var nonZeroStates, stateString;
            nonZeroStates = [];
            for (stateString in this.amplitudes) {
                if (this.amplitudes.hasOwnProperty(stateString)) {
                    nonZeroStates.push(stateString);
                }
            }
            nonZeroStates.sort(compareNuumbers);
            return nonZeroStates;
        };
    })();

    jsqbits.QState.prototype.eql = function(other) {
        var stateString;
        if (!other) return false;
        if (!(other instanceof jsqbits.QState)) return false;
        if (this.numBits !== other.numBits) return false;
        for (stateString in this.amplitudes) {
            if (this.amplitudes.hasOwnProperty(stateString) &&
                !this.amplitudes[stateString].eql(other.amplitudes[stateString])) return false;
        }
        for (stateString in other.amplitudes) {
            if (other.amplitudes.hasOwnProperty(stateString) &&
                !this.amplitudes[stateString].eql(other.amplitudes[stateString])) return false;
        }
        return true;
    };

    jsqbits.QState.prototype.toString = (function() {
        var padState = function(state, numBits) {
            var paddingLength = numBits - state.length;
            for (var i = 0; i < paddingLength; i++) {
                state = '0' + state;
            }
            return state;
        };
        
        var formatAmplitude = function(qstate, stateString, formatFlags) {
            var amplitude = qstate.amplitudes[stateString].format(formatFlags);
            return amplitude === '1' ? '' : amplitude + " ";
        };

        return function() {
            var stateString, result, formatFlags, nonZeroStates, state, i;
            result = '';
            formatFlags = {decimalPlaces: 4};
            nonZeroStates = this.sortedNonZeroStates();
            for (i = 0; i < nonZeroStates.length; i++) {
                if (result !== '') formatFlags.spacedSign = true;
                stateString = nonZeroStates[i];
                state = padState(parseInt(stateString, 10).toString(2), this.numBits);
                result = result + formatAmplitude(this, stateString, formatFlags) + "|" + state + ">";
            }
            return result;
        };
    })();
})();