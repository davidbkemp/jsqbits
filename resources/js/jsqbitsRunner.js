var ALL = jsqbits.ALL;

$(function() {

    $('#run').click(function() {
        clearConsole();
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
        if (result) {
            $('#result').text(result);
        }
    });

    function clearConsole() {
        $('#result').text('');
        $('#console').html('');
    }

    function clear() {
       $('#code').val('');
       clearConsole();
    }

    $('#clear').click(function() {
        clear();
        $('#example').attr('value', 'none');
    });

    $('#example').change(function(event) {
        var selectedExample = $(this).attr('value');
        if (selectedExample === 'none') return;

        $.get("examples/" + selectedExample + ".js.example", function(data) {
            clear();
            $('#code').val(data);
          })
          .error(function() { alert("Sorry. Something went wrong."); });
    });
});


function log(str) {
    $("#console").append($("<div>").text(str));
}

function promptForFunction(message, example) {
    var input = prompt(message, example);
    var f;
    eval("f = " + input);
    return f;
}
