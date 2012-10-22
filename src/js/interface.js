/*
 * interface.js
 * Code for interacting with the HTML interface.
 */

$(function() {

    // Set up input fields
    
    $('#inputSwarmSize').val(BS.settings.swarmSize);
    $('#inputSeparation').val(BS.settings.separation);
    $('#inputAlignment').val(BS.settings.alignment);
    $('#inputCommunitySize').val(BS.settings.community);
    $('#inputCohesion').val(BS.settings.cohesion);
    $('#inputVisibility').val(BS.settings.visibility);

    $('#inputSwarmSize').change(function() {
        var val;
        if (val = parseInt($(this).val())) {
            BS.settings.swarmSize = val;
        }
    });

    $('#inputSeparation').change(function() {
        var val;
        if (val = parseFloat($(this).val())) {
            BS.settings.separation = val;
        }
    });

    $('#inputAlignment').change(function() {
        var val;
        if (val = parseFloat($(this).val())) {
            BS.settings.alignment = val;
        }
    });

    $('#inputCommunitySize').change(function() {
        var val;
        if (val = parseInt($(this).val())) {
            BS.settings.community = val;
        }
    });

    $('#inputCohesion').change(function() {
        var val;
        if (val = parseFloat($(this).val())) {
            BS.settings.cohesion = val;
        }
    });

    $('#inputVisibility').change(function() {
        var val;
        if (val = parseFloat($(this).val())) {
            BS.settings.visibility = val;
        }
    });

    $('#buttonStart').click(function() {
        var $button = $(this);

        if ($button.text() === 'Start') {
            $('#inputSwarmSize').change();
            $('#inputSeparation').change();
            $('#inputAlignment').change();
            $('#inputCommunitySize').change();
            $('#inputCohesion').change();
            $('#inputVisibility').change();

            $('body').data('display', BS.start());

            $button.text('Stop');
        } else {
            $('body').data('display').running = false;
            $button.text('Start');
        }
    });

});
