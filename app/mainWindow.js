const electron = require('electron');
const ipc = electron.ipcRenderer;
let itemsList = [];
let searchResults;

$(document).ready(function () {

    // Below is the name of the textfield that will be autocomplete
    $('#search-name').autocomplete({
        // This shows the min length of charcters that must be typed before the autocomplete looks for a match.
        minLength: 2,
        source: function (request, response) {

            ipc.send("search-query", $('#search-name').val());

            // taking search query results from main
            ipc.on("search-results", function (event, arg) {

                searchResults = arg;
                console.table(arg);

                response($.map(searchResults, function (value) {
                    return {
                        label: value.productName,
                        value: value.productCode
                    }
                }));
            });

        },
        focus: function (event, ui) {
            console.log(ui.item.label);
            $('#search-name').val(ui.item.label);
            return false;
        },
        // Once a value in the drop down list is selected, do the following:
        select: function (event, ui) {
            itemsList.push(ui.item.value);

            $('#empty-cart').css('display', 'none');

            // finding selected object from list of search result objects
            var selectedObj = $.grep(searchResults, function (selectedObj) {
                return selectedObj.productCode === ui.item.value;
            })[0];

            $('#tableBody').append("<tr>\n" +
                "                            <th scope=\"row\"><i class=\"fas fa-times-circle cancle-item-icon\" id='"+selectedObj.productCode+"'></i></th>\n" +
                "                            <td>"+selectedObj.productName+"</td>\n" +
                "                            <td>&#8377;"+selectedObj.productPrice+"</td>\n" +
                "                            <td>1</td>\n" +
                "                            <td>"+selectedObj.productDiscount+"%</td>\n" +
                "                            <td>&#8377;"+selectedObj.productPrice+"</td>\n" +
                "                        </tr>")

            $('#search-name').val('');
            return false;
        }
    });
});