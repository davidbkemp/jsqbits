var ALL = jsqbits.ALL;
$(function() {

    $('#run').click(function() {
        $('#result').fadeOut(function() {
            $('#result').text('');
            var result;
            try {
                result = eval($('#code').get(0).value);
                if ((typeof result === 'object') && result.toString) {
                    result = result.toString();
                } else if (typeof result === 'number') {
                    result = '' + result;
                }
            } catch (e) {
                result = e.message ? e.message : e;
            }
            if (result === null) {
                result = 'null';
            } else if (result === undefined) {
                result = 'undefined';
            }
            $('#result').text(result);
            $('#result').fadeIn();
        });
    });

    $('#clear').click(function() {
        $('#code').val('');
        $('#result').text('');
    });
});
