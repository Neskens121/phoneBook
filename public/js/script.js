(function($) {
  console.log('s');
  // Search function for search input
  $.fn.liveSearch = function(list, exclude) {
    var input = $('input'),
        regexp = {
          provider: /provider:([a-zA-Z0-9\.\-\_]+)/i,
          email: /\@([a-zA-z0-9\-\_\.]+)/i
        },
        elements = list.children().not(exclude),
        filter = function() {

          var term = input.val().toLowerCase();
          
          elements.show().filter(function() {
            var text = $(this).text().toLowerCase(),
                open = term.replace(regexp.provider, '').trim(),
                found = term.match(regexp.provider);
            
            console.log(term);
            console.log(text);
            
            if (found) {
              console.log('found');
              if (text.indexOf('@' + found[1]) != -1 && !open) {
                return false;
              } else {
                if (open && text.indexOf('@' + found[1]) != -1) return text.replace(regexp.email, '').toLowerCase().indexOf(open) == -1;
              }
            } else {console.log('not found');}
            return text.replace(regexp.email, '').toLowerCase().indexOf(term) == -1;
          }).hide();
        };

    input.on('keyup select', filter);
    console.log(this);
    return this;
  };
  $('#search').liveSearch($('.list'));

  //$('#search').liveSearch($('.list'), ':last-child');

})(jQuery);