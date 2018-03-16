$(function() {
  $('.modal').modal();
  $('#scrape-headlines').on('click', function(event) {
    event.preventDefault();
    $.ajax({url: '/scrape', method: 'GET'})
        .done(function(response) {
          $('#success #message').text(JSON.parse(response).message);
          $('#success').modal('open');
        })
        .fail(function() {
          $('#error').modal('open');
        });
  });
});