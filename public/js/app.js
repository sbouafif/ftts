requirejs.config({
  baseUrl: 'js'
});

requirejs(['jquery'], function($) {
  console.log($);

  var getResults = function(req) {
    $.ajax({
      type: 'POST',
      url: 'search',
      data: {search : req},
      success: function(d) {
        if(d.data.length !== 0) $('#res').html('');
        $.each(d.data, function(i, m) {
          $('#res').append('<a href="'+m.link+'" title="'+m.name+'">'+m.name+'</a></br />');
        });
      },
      error: function(e) {
        console.log(e);
      }
    });
  };

  $('input#search').keyup(function(e) {
    if(e.keyCode == 13) {
      e.preventDefault();
    }

    getResults($(this).val());
  });
});
