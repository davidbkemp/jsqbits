new function($) {
    var totalErrors = 0;

    $(function(){
        $('*[data-sampleref]').each(function() {
            var id = $(this).attr('data-sampleref');
            var jscode = $('#'+id).text();
            var result = eval(jscode).toString();
            var expected = $(this).text();
            if (expected.trim() !== result.trim()) {
                $(this).addClass('error');
                totalErrors++;
            }
        });

        if(totalErrors > 0) {
            $('#topErrorMessage').show();
        }
    });
}(jQuery);