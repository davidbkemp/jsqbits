var jsquantum;
jsquantum = jsquantum || {};

new function() {

    jsquantum.Complex = function(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    };

    jsquantum.Complex.prototype.add = function(other) {
        return new jsquantum.Complex(this.real + other.real, this.imaginary + other.imaginary);
    };

    jsquantum.Complex.prototype.multiply = function(other) {
        return new jsquantum.Complex(this.real * other.real - this.imaginary * other.imaginary,
                    this.real * other.imaginary + this.imaginary * other.real);
    };

    jsquantum.Complex.prototype.toString = function() {
        if (this.imaginary == 0) return "" + this.real;
        if (this.real == 0) return "" + this.imaginary + 'i';
        var sign = (this.imaginary < 0) ? "" : "+";
        return this.real + sign + this.imaginary + "i";
    };

    jsquantum.Complex.prototype.format = function(options) {
        var realValue = this.real;
        var imaginaryValue = this.imaginary;
        if (options && options.decimalPlaces != null) {
            var roundingMagnitude = Math.pow(10, options.decimalPlaces);
            realValue = Math.round(realValue * roundingMagnitude) /roundingMagnitude;
            imaginaryValue = Math.round(imaginaryValue * roundingMagnitude) /roundingMagnitude;
        }
        var objectToFormat = new jsquantum.Complex(realValue, imaginaryValue);
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

    jsquantum.Complex.prototype.negate = function() {
        return new jsquantum.Complex(-this.real, -this.imaginary);
    }

    jsquantum.Complex.prototype.magnitude = function() {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    }

    jsquantum.Complex.prototype.subtract = function(other) {
        return new jsquantum.Complex(this.real - other.real, this.imaginary - other.imaginary);
    }

    jsquantum.Complex.ZERO = new jsquantum.Complex(0,0);


    var Complex = jsquantum.Complex;
    var complex = function(real, imaginary) {
        return new Complex(real, imaginary);
    };
    var squareRootOfOneHalf = complex(1/Math.sqrt(2),0);

    var parseBitString = function(bitString) {
        // Strip optional 'ket' characters to support |0101>
        bitString = bitString.replace(/^\|/,'').replace(/>$/,'');
        return {value: parseInt(bitString, 2), length: bitString.length};
    };

    var sparseAssign = function(array, index, value) {
        // Try to avoid assigning values and try to make zero exactly zero.
        if (value.magnitude() > 0.0000001) {
            array[index] = value;
        }
    }

    jsquantum.QState = function(numBits, amplitudes) {
        this.numBits = numBits;
        this.amplitudes = amplitudes;
    };

    jsquantum.QState.fromBits = function(bitString) {
        var parsedBitString = parseBitString(bitString);
        var amplitudes = [];
        amplitudes[parsedBitString.value] = complex(1,0);
        return new jsquantum.QState(parsedBitString.length, amplitudes);
    }

    jsquantum.QState.prototype.amplitude = function(index) {
        var numericIndex = (typeof index == 'string') ? parseBitString(index).value : index;
        return this.amplitudes[numericIndex] || Complex.ZERO;
    };

    jsquantum.QState.prototype.singleQbitOperation = function(bit, qbitFunction) {
        var newAmplitudes = [];
        var statesThatCanBeSkipped = [];
        var mask = 1 << bit;
        for(var stateString in this.amplitudes) {
            var state = parseInt(stateString);
            if (statesThatCanBeSkipped[state]) continue;
            statesThatCanBeSkipped[state^mask] = true;
            var indexOf1 = state | mask;
            var indexOf0 = indexOf1 - mask;
            var result = qbitFunction(this.amplitude(indexOf0), this.amplitude(indexOf1));
            sparseAssign(newAmplitudes, indexOf0, result.amplitudeOf0);
            sparseAssign(newAmplitudes, indexOf1, result.amplitudeOf1);
        }
        return new jsquantum.QState(this.numBits, newAmplitudes);
    };

    jsquantum.QState.prototype.hadamard = function(bit) {
        return this.singleQbitOperation(bit, function(amplitudeOf0, amplitudeOf1){
            var newAmplitudeOf0 = amplitudeOf0.add(amplitudeOf1).multiply(squareRootOfOneHalf);
            var newAmplitudeOf1 = amplitudeOf0.subtract(amplitudeOf1).multiply(squareRootOfOneHalf);
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsquantum.QState.prototype.rotateX = function(bit, angle) {
        return this.singleQbitOperation(bit, function(amplitudeOf0, amplitudeOf1){
            var halfAngle = angle / 2;
            var cos = complex(Math.cos(halfAngle), 0);
            var negative_i_sin = complex(0, -Math.sin(halfAngle));
            var newAmplitudeOf0 = amplitudeOf0.multiply(cos).add(amplitudeOf1.multiply(negative_i_sin));
            var newAmplitudeOf1 = amplitudeOf0.multiply(negative_i_sin).add(amplitudeOf1.multiply(cos));
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsquantum.QState.prototype.rotateY = function(bit, angle) {
        return this.singleQbitOperation(bit, function(amplitudeOf0, amplitudeOf1){
            var halfAngle = angle / 2;
            var cos = complex(Math.cos(halfAngle), 0);
            var sin = complex(Math.sin(halfAngle), 0);
            var newAmplitudeOf0 = amplitudeOf0.multiply(cos).add(amplitudeOf1.multiply(sin.negate()));
            var newAmplitudeOf1 = amplitudeOf0.multiply(sin).add(amplitudeOf1.multiply(cos));
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsquantum.QState.prototype.rotateZ = function(bit, angle) {
        return this.singleQbitOperation(bit, function(amplitudeOf0, amplitudeOf1){
            var halfAngle = angle / 2;
            var cos = complex(Math.cos(halfAngle), 0);
            var i_sin = complex(0, Math.sin(halfAngle));
            var newAmplitudeOf0 = amplitudeOf0.multiply(cos.subtract(i_sin));
            var newAmplitudeOf1 = amplitudeOf1.multiply(cos.add(i_sin));
            return {amplitudeOf0: newAmplitudeOf0, amplitudeOf1: newAmplitudeOf1};
        });
    };

    jsquantum.QState.prototype.cnot = function(controlBit, targetBit) {
        var newAmplitudes = [];
        var statesThatCanBeSkipped = [];
        var controlBitMask = 1 << controlBit;
        var targetBitMask = 1 << targetBit;
        for(var stateString in this.amplitudes) {
            var state = parseInt(stateString);
            if (statesThatCanBeSkipped[state]) continue;
            statesThatCanBeSkipped[state^targetBitMask] = true;
            var indexOf1 = state | targetBitMask;
            var indexOf0 = indexOf1 - targetBitMask;
            if (state & controlBitMask) {
                sparseAssign(newAmplitudes, indexOf0, this.amplitude(indexOf1));
                sparseAssign(newAmplitudes, indexOf1, this.amplitude(indexOf0));
            } else {
                sparseAssign(newAmplitudes, indexOf0, this.amplitude(indexOf0));
                sparseAssign(newAmplitudes, indexOf1, this.amplitude(indexOf1));
            }
        }
        return new jsquantum.QState(this.numBits, newAmplitudes);
    };

    jsquantum.QState.prototype.toString = function() {
        var padState = function(state, numBits) {
            var paddingLength = numBits - state.length;
            for (i = 0; i < paddingLength; i++) {
                state = '0' + state;
            }
            return state;
        };

        var result = '';
        var formatFlags = {decimalPlaces: 4};
        for(var stateString in this.amplitudes) {
            if (result !== '') formatFlags.spacedSign = true;
            var state = padState(parseInt(stateString).toString(2), this.numBits);
            result = result + this.amplitudes[stateString].format(formatFlags) + " |" + state + ">"
        }
        return result;
    }
}();