const electron = require('electron');
const ipc = electron.ipcRenderer;
var searchresults;
var selectedProductId;
var itemsList = [];
$(document).ready(function () {
    var lengh;

    // send data to main when typed more than 2 letters
    $('#search-name').on('keyup', function () {
        lengh = $('#search-name').val().length;
        if (lengh > 2) {
            ipc.send("search-query", $('#search-name').val());
        }
    });

    // taking search query results from main
    ipc.on("search-results", function (event, arg) {

        searchresults = arg;
        console.table(arg);

    });

    // Below is the name of the textfield that will be autocomplete
    $('#search-name').autocomplete({
        // This shows the min length of charcters that must be typed before the autocomplete looks for a match.
        minLength: 2,
        source: function (request, response) {
            response($.map(searchresults, function (value, key) {
                return {
                    label: value.productName,
                    value: value.productCode
                }
            }));

        },
          focus: function(event, ui) {
              console.log(ui.item.label);
              $('#search-name').text(ui.item.label);
              return false;
          },
        // Once a value in the drop down list is selected, do the following:
        select: function (event, ui) {

            selectedProductId = ui.item.value;

            console.log(selectedProductId);
            itemsList.push(selectedProductId);
            $('#search-name').val('');
            /*  // place the person.given_name value into the textfield called 'select_origin'...
              $('#search-name').val(ui.item.label);
              // and place the person.id into the hidden textfield called 'link_origin_id'.
              $('#search-id').val(ui.item.value);*/
            return false;
        }
    });
});
