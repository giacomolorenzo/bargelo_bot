$(document).ready(function(){
    $.ajax({
        url: "http://localhost:3000/orders", //url to api.php
        contentType: false,
        processData: false,
        type: 'GET',
        success: function (result) {
          var jsonArray = JSON.parse(result);
          jsonArray.forEach(element => {
            $(".container").append("<div class='form-row'>"+
            "<div class='form-group col mt-6'>"+
             "<input type='text' id='name' name='name' value='"+element.user+"' readonly  class='form-control shadow p-1  bg-white rounded'>"+
            "</div>"+
            "<div class='form-group col mt-6'>"+
             "<input type='text' id='telefono' name='telefono' value='"+element.phone+"' readonly  class='form-control shadow p-1  bg-white rounded'>"+
            "</div>"+
            
            "<div class='form-group col mt-6'>"+
             "<input type='text' id='ordine' name='ordine' value='"+element.message+"' readonly class='form-control shadow p-1  bg-white rounded'>"+
            "</div>"+
            
            "<div class='form-group col mt-6'>"+
             "<select name='stato' class='form-control shadow p-1  bg-white rounded'>"+
               " <option selected>Aperto</option>"+
               " <option>Gestito</option>"+
                "<option>Chiuso</option>"+
                "<option>Pagato</option>"+
            " </select>"+
            "</div>"+
            
            "<div class='form-group col mt-6'>"+
            " <input type='text' id='prezzo' name='prezzo' value='"+element.prezzo+"'  class='form-control shadow p-1  bg-white rounded'>"+
            "</div>"+
            "</div>")



          });

        }
      });


})