
$(document).ready(function(){

    var formData = {
        firstname : "nara",
        lastname :  "simah"
    };
    $.ajax({

        type : "POST",
        contentType : "application/json",
        url: "http://localhost:3000/",
        data : JSON.stringify(formData),
        dataType : 'json',


        success: function (response) {

            if(response.success){

                console.log("true");

            }else{

                console.log("false");

            }

        },

        error: function (error) {

            console.log("error");

        }

    });

});
