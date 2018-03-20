$(function() {
  $('.modal').modal();
  $('#scrape-headlines').on('click', function(event) {
    event.preventDefault();
    $('#loading').modal('open');
    $.ajax({url: '/scrape', method: 'GET'})
        .done(function(response) {
          $('#success #message').text(JSON.parse(response).message);
          $('#success').modal('open');
          $('#loading').modal('close');
        })
        .fail(function() {
          $('#loading').modal('close');
          $('#error').modal('open');
        });
  });
});