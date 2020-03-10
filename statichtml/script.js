$(document).ready(function(){
    $.ajax({
        url: "//localhost:3000/orders", //url to api.php
        contentType: false,
        processData: false,
        type: 'GET',
        success: function (result) {
          
          result.forEach(element => {
            $(".container").append("<div class='form-row'>"+
            "<div class='form-group col mt-2'>"+
             "<label for='name' class='font-weight-bold'>Nome</label>"+
             "<input type='text' id='name' name='name' value='"+element+"' readonly  class='form-control shadow p-1 mb-5 bg-white rounded'>"+
            "</div>"+
            "<div class='form-group col mt-2'>"+
             "<label for='telefono' class='font-weight-bold'>Telefono</label>  "+
             "<input type='text' id='telefono' name='telefono' value='"+element+"' readonly  class='form-control shadow p-1 mb-5 bg-white rounded'>"+
            "</div>"+
            
            "<div class='form-group col mt-2'>"+
             "<label for='ordine' class='font-weight-bold'>Ordine</label>  "+
             "<input type='text' id='ordine' name='ordine' value='"+element+"' readonly class='form-control shadow p-1 mb-5 bg-white rounded'>"+
            "</div>"+
            
            "<div class='form-group col mt-2'>"+
             "<label for='stato' class='font-weight-bold'>Stato</label>  "+
             "<select name='stato' class='form-control shadow p-1 mb-5 bg-white rounded'>"+
               " <option selected>Aperto</option>"+
               " <option selected>Gestito</option>"+
                "<option selected>Chiuso</option>"+
                "<option selected>Pagato</option>"+
            " </select>"+
            "</div>"+
            
            "<div class='form-group col mt-2'>"+
             "<label for='prezzo' class='font-weight-bold'>Prezzo</label>"+  
            " <input type='text' id='prezzo' name='prezzo' value='"+element+"'  class='form-control shadow p-1 mb-5 bg-white rounded'>"+
            "</div>"+
            "</div>")



          });

        }
      });


})