
const electron = require('electron');
const ipc = electron.ipcRenderer;
let itemsList = [];
let searchResults;
let notFountObject = [{productName: 'no result found'}];
let canceledItemCode;

$(document).ready(function () {

    // when searched with product code query goes from it
    // Below is the name of the textfield that will be autocomplete
    $('#search-name').autocomplete({
        // This shows the min length of charcters that must be typed before the autocomplete looks for a match.
        minLength: 2,
        source: function (request, response) {

            ipc.send("search-query", $('#search-name').val());

            // taking search query results from main
            ipc.on("search-name-results", function (event, arg) {

                searchResults = arg;

                if (arg.length > 0) {
                    response($.map(searchResults, function (value) {
                        return {
                            label: value.productName,
                            value: value.productCode
                        }
                    }));
                } else {
                    response($.map(notFountObject, function (value) {
                        return {
                            label: value.productName
                        }
                    }));
                }
            });

        },
        focus: function (event, ui) {
            console.log(ui.item.label);
            if (ui.item.label == "no result found") {
                return false;
            } else {
                $('#search-name').val(ui.item.label);
                return false;
            }
        },
        // Once a value in the drop down list is selected, do the following:
        select: function (event, ui) {
            if (ui.item.label == "no result found") {
                $('#search-name').val('');
            } else {

                itemsList.push(ui.item.value);

                $('#empty-cart').css('display', 'none');

                // finding selected object from list of search result objects
                var selectedObj = $.grep(searchResults, function (selectedObj) {
                    return selectedObj.productCode === ui.item.value;
                })[0];

                addItemToList(selectedObj.productName, selectedObj.productCode, selectedObj.productPrice, selectedObj.productDiscount);
                $('#search-name').val('');
                return false;
            }
        }
    });

    // when searched with product code query goes from it
    $('#search-id').keypress(function (event) {
        if ((event.keyCode ? event.keyCode : event.which) === 13) {
            ipc.send("search-product-with-code", $('#search-id').val());
        }
    });

    // when clicked to remove item from list
    $('body').on('click', '.cancel-item-icon', function () {
        canceledItemCode = $(this).attr('id');
        //remove item from items array
        itemsList= $.grep(itemsList, function(value) {
            return value != canceledItemCode;
        });
        $(this).parents("tr").remove();
        if (itemsList.length < 1){
            $('#empty-cart').css('display', 'block');
        }
    });


});

function addItemToList(name, code, price, discount) {
    if (discount === "") {
        discount = 0;
    }
    $('#tableBody').append("<tr id='table-row-"+code+"'>\n" +
        "                            <th scope=\"row\"><i class=\"fas fa-times-circle cancel-item-icon\" id='" + code + "'></i></th>\n" +
        "                            <td>" + name + "</td>\n" +
        "                            <td>&#8377;" + price + "</td>\n" +
        "                            <td>1</td>\n" +
        "                            <td>" + discount + "%</td>\n" +
        "                            <td>&#8377;" + price + "</td>\n" +
        "                        </tr>");
    return false;
}

// search-code-results
ipc.on("search-code-results", function (event, arg) {
    $('#empty-cart').css('display', 'none');
    console.table(arg[0]);
    itemsList.push(arg[0].productCode);
    addItemToList(arg[0].productName, arg[0].productCode, arg[0].productPrice, arg[0].productDiscount);
    $('#search-id').val('');

});
