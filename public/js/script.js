(function($) {
  console.log('s');
  // Search function for search input
  $.fn.liveSearch = function(list, exclude) {
    var input = $('input'),
        regexp = {
          provider: /[a-zA-Z0-9\.\-\_]+/i,
          email: /\@([a-zA-z0-9\-\_\.]+)/i,
          phoneNumber: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/i
        },
        elements = list.children().not(exclude),
        filter = function() {
          var term = input.val().toLowerCase().trim();
          
            
          elements.show().filter(function() {
            var text = $(this).text().toLowerCase().trim(),
                open = term.replace(regexp.provider, '').trim(),
                found = term.match(regexp.provider);
            textArr = text.split('\n');
            text = textArr[0];
            console.log(text.replace(regexp.phoneNumber, '').toLowerCase());
                //found = regexp.provider.test(term);            

            //console.log(term);
            console.log(text);
            console.log(textArr);
            
            console.log(found);

            if (found) {
              console.log('found');
              if (text.indexOf('@' + found[1]) != -1 && !open) {
                return false;
              } else {
                if (open && text.indexOf('@' + found[1]) != -1) return text.replace(regexp.email, '').toLowerCase().indexOf(open) == -1;
              }
            } else {console.log('not found');}
            console.log(text.replace(regexp.provider, ''));
            console.log(text.replace(regexp.provider, '').toLowerCase().indexOf(term));
            return text.replace(regexp.provider, '').toLowerCase().indexOf(term) == -1;
            //return text.replace(regexp.email, '').toLowerCase().indexOf(term) == -1;
          }).hide();
          $('ul > :visible').length == 0 ? $('#nocontacts').show() :  $('#nocontacts').hide();
        };
    input.on('keyup select', filter);
    //console.log(this);
    return this;
  };
  //$('#search').liveSearch($('.list'));

  $('#search').liveSearch($('.list'), ':last-child');

})(jQuery);