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

var jsqbitsmath = jsqbitsmath || {};

(function() {

    /**
     * Find the null space in modulus 2 arithmetic of a matrix of binary values
     * @param a matrix of binary values represented using an array of numbers
     * whose bit values are the entries of a matrix rowIndex.
     * @param width the width of the matrix.
     */
    jsqbitsmath.findNullSpaceMod2 = (function() {

        var attemptToMakePivot = function(a, colIndex, pivotRowIndex) {
            var colBitMask = 1 << colIndex;
            if (colBitMask & a[pivotRowIndex]) return;
            for (var rowIndex = pivotRowIndex + 1; rowIndex < a.length; rowIndex ++) {
                if (colBitMask & a[rowIndex]) {
                    var tmp = a[pivotRowIndex];
                    a[pivotRowIndex] = a[rowIndex];
                    a[rowIndex] = tmp;
                    return;
                }
            }
        };

        var makeReducedRowEchelonForm = function(a, width) {
            var pivotRowIndex = 0;
            for (var pivotColIndex = width - 1; pivotColIndex >= 0; pivotColIndex--) {
                attemptToMakePivot(a, pivotColIndex, pivotRowIndex);
                var colBitMask = 1 << pivotColIndex;
                if (colBitMask & a[pivotRowIndex]) {
                    a.pivotCols[pivotColIndex] = true;
                    a.pivotRows[pivotRowIndex] = pivotColIndex;
                    zeroOutAboveAndBelow(a, pivotColIndex, pivotRowIndex);
                    pivotRowIndex++;
                }
            }
        };

        var zeroOutAboveAndBelow = function(a, pivotColIndex, pivotRowIndex) {
            var pivotRow = a[pivotRowIndex];
            var colBitMask = 1 << pivotColIndex;
            for (var rowIndex = 0; rowIndex < a.length; rowIndex++) {
                if (rowIndex != pivotRowIndex && (colBitMask & a[rowIndex])) {
                    a[rowIndex] = a[rowIndex] ^ pivotRow;
                }
            }
        };

        var specialSolutions = function(a, width) {
            specialSolutions = [];
            var rowIndex = 0;
            for (var colIndex  = width - 1; colIndex >= 0; colIndex--) {
                if (!a.pivotCols.hasOwnProperty(colIndex)) {
                    // TODO: There are more solutions than this!!!!
                    var specialSolution = (1 << colIndex) + (1 << a.pivotRows[rowIndex]);
                    specialSolutions.push(specialSolution);
                    rowIndex++;
                }
            }
            return specialSolutions;
        };

        return function(a, width) {
            a = cloneArray(a);
            a.pivotCols = {};
            a.pivotRows = {};
            makeReducedRowEchelonForm(a, width);
            return specialSolutions(a, width);
        };
    })();

    var cloneArray = function(a) {
        var result = [];
        for (var i = 0; i < a.length; i++) {
            result[i] = a[i];
        }
        return result;
    };

})();
