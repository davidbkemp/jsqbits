new function($) {
    var totalErrors = 0;

//    Find code samples and compare the actual output with the stated output.
    $(function() {
        $('*[data-sampleref]').each(function() {
            try {
                var id = $(this).attr('data-sampleref');
                var jscode = $('#' + id).text();
                var result = eval(jscode).toString();
                var expected = $(this).text();
                if (expected.trim() !== result.trim()) throw "no match";
            } catch (e) {
                $(this).addClass('error');
                totalErrors++;
            }
        });

        $('#topWarningMessage').hide();
        if (totalErrors > 0) {
            $('#topErrorMessage').show();
        }

        var indexItems = [];
        var indexMap = [];
        $('ul.index li, h2.index').map(function() {
            var indexItem = $(this).text().split('(')[0];
            indexItems.push(indexItem);
            indexMap[indexItem] = $(this).closest('section').find('h2').attr('id');
        });
        indexItems.sort();
        for (var i in indexItems) {
            var indexItem = indexItems[i];
            var element = $('<a>').attr('href', '#' + indexMap[indexItem]).text(indexItem + ' ');
            $('#tableOfContents').append(element);
        }
    });
}(jQuery);  