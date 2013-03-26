requirejs.config({
  baseUrl: 'js'
});

requirejs(['jquery', 'https://connect.facebook.net/en_US/all.js'], function($) {
  $(function () {
    var csrf_token = '<%= '+ $('input[name="_csrf"]').val() +' %>';
    $("body").bind("ajaxSend", function(elm, xhr, s){
      if (s.type == "POST") {
     xhr.setRequestHeader('X-CSRF-Token', csrf_token);
      }
    });

    FB.init({ 
      appId: '501528346569865', 
      cookie: true, 
      xfbml: true, 
      status: true
    });
    
    FB.getLoginStatus(function (res) {
      if (res.authResponse) {
        $.ajax({
          type: 'POST',
          url: 'token',
          data: {token: res.authResponse.accessToken}
        });
      } else {
        console.log('fuck off');
      }
    });
    
    var getResults = function(req) {
      $.ajax({
        type: 'POST',
        url: 'search',
        data: {search : req},
        success: function(d) {
          if(d.data.length !== 0) {
            $('#res').html('');
          } else {
            $('#res').html('<p>Pas de musique désolé :/</p>');
          }
          $.each(d.data, function(i, m) {
            if(m.name !== undefined)
              $('#res').append('<article><img src="'+m.picture+'" /><a href="'+m.link+'" title="'+m.name+'">'+m.name+'</a></br />');
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
});
