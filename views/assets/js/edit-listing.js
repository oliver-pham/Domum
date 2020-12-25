(function ($) {

    $("#photo-form").submit(function (event) {
        if ($slides.length > 0) {
            return true;
        }

        event.preventDefault();
		return false;
    });

    // Edit the title

    // Edit the location

    // Edit the description

    // Edit the price

})(jQuery);