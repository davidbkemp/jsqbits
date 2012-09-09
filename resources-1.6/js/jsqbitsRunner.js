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

    function clear() {
       $('#code').val('');
       $('#result').text('');
    }

    $('#clear').click(function() {
        clear();
    });

    var selectedExample = 'none';

    $('#example').change(function(event) {
        var newSelection = $(this).attr('value');
        if (newSelection === 'none') {
            selectedExample = newSelection;
            return;
        }
        if ($('#code').val() !== '') {
            if (!confirm("WARNING: This action will clear your existing code.")) {
                $(this).attr('value', selectedExample);
                return;
            }
        }
        selectedExample = newSelection;
        clear();

        $.get("examples/" + newSelection + ".js.example", function(data) {
            $('#code').val(data);
          })
          .error(function() { alert("Sorry. Something went wrong."); });
    });
});
