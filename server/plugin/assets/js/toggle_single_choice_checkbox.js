;(function($) {

  $(document).on('click', 'div[data-name="single_choice"] input[type="checkbox"]', function() {
    $(this).closest('div[data-name="single_choice"]').find('input[type="checkbox"]').not( $(this) ).prop('checked', false)
  });

})(jQuery);