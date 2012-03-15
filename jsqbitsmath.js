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

        /**
         * Try to make row pivotRowIndex / column colIndex a pivot
         * swapping rows if necessary.
         */
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

        /**
         * Reduce 'a' to reduced row echelon form,
         * and keep track of which columns are pivot columns in pivotColumnIndexes.
         */
        var makeReducedRowEchelonForm = function(a, width, pivotColumnIndexes) {
            var pivotRowIndex = 0;
            for (var pivotColIndex = width - 1; pivotColIndex >= 0; pivotColIndex--) {
                attemptToMakePivot(a, pivotColIndex, pivotRowIndex);
                var colBitMask = 1 << pivotColIndex;
                if (colBitMask & a[pivotRowIndex]) {
                    pivotColumnIndexes[pivotRowIndex] = pivotColIndex;
                    zeroOutAboveAndBelow(a, pivotColIndex, pivotRowIndex);
                    pivotRowIndex++;
                }
            }
        };

        /**
         * Zero out the values above and below the pivot (using mod 2 arithmetic).
         */
        var zeroOutAboveAndBelow = function(a, pivotColIndex, pivotRowIndex) {
            var pivotRow = a[pivotRowIndex];
            var colBitMask = 1 << pivotColIndex;
            for (var rowIndex = 0; rowIndex < a.length; rowIndex++) {
                if (rowIndex != pivotRowIndex && (colBitMask & a[rowIndex])) {
                    a[rowIndex] = a[rowIndex] ^ pivotRow;
                }
            }
        };

        /**
         * Add to results, special solutions corresponding to the specified non-pivot column colIndex.
         */
        var specialSolutionForColumn = function(a, pivotColumnIndexes, colIndex, pivotNumber) {
            var columnMask = 1 << colIndex;
            var specialSolution = columnMask;
            for (var rowIndex = 0; rowIndex < pivotNumber; rowIndex++) {
                if (a[rowIndex] & columnMask) {
                    specialSolution += 1 << pivotColumnIndexes[rowIndex];
                }
            }
            return specialSolution;
        }

        /**
         * Find the special solutions to the mod-2 equation Ax=0 for matrix a.
         */
        var specialSolutions = function(a, width, pivotColumnIndexes) {
            var results = [];
            var pivotNumber = 0;
            var nextPivotColumnIndex = pivotColumnIndexes[pivotNumber];
            for (var colIndex = width - 1; colIndex >= 0; colIndex--) {
                if (colIndex == nextPivotColumnIndex) {
                    pivotNumber++;
                    nextPivotColumnIndex = pivotColumnIndexes[pivotNumber];
                } else {
                    results.push(specialSolutionForColumn(a, pivotColumnIndexes, colIndex, pivotNumber));
                }
            }
            return results;
        };

        return function(a, width) {
            a = cloneArray(a);
            var pivotColumnIndexes = [];
            makeReducedRowEchelonForm(a, width, pivotColumnIndexes);
            return specialSolutions(a, width, pivotColumnIndexes);
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
