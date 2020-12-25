(function ($) {
	
	// Pop-up Modal
	// TODO: Remove Modals

	/*
	var registration = {
		state: "none",
		show: () => {
			this.state = "block";
			$("#registration").animate({
				top: "50%"
			}, 500);
			$("#overlay").show();
		},
		hide: () => {
			this.state = "none";
			$("#registration").animate({
				top: "-50%"
			}, 500);
		}
	};

	var login = {
		state: "none",
		show: () => {
			this.state = "block";
			$("#login").animate({
				top: "50%"
			}, 500);
			$("#overlay").show();
		},
		hide: () => {
			this.state = "none";
			$("#login").animate({
				top: "-50%"
			}, 500);
		}
	};
	

	// Registration

	$(".registration-btn").click(function () {
		login.hide()
		registration.show()
	});

	// Login

	$(".login-btn").click(function () {
		login.show();
		registration.hide();
	});
	
	// Hide

	$("#overlay").click(function () {
		login.hide();
		registration.hide();
		$("#overlay").hide();
	});

	$(".modal-close").click(function () {
		login.hide();
		registration.hide();
		$("#overlay").hide();
	});
	*/
	
	// Nav Sidebar

	// Toggle

	$(".toggle").click(function () {
		$("#navPanel").animate({
			left: "+=275"
		}, 500, function () {
			$("#navPanel").addClass("visible");
		});
	});

	$("body").click(function () {
		if ($("#navPanel").hasClass("visible")) {
			$("#navPanel").animate({
				left: "-=275"
			}, 500, function () {
				$("#navPanel").removeClass("visible");
			});
		}
	})
	
	
	// Form

	// Add months
	var months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];

	for (var month = 0; month < months.length; month++) {
		$("#birthday-month").append('<option value=' + '\"' + month + '\">' + months[month] + '</option>');
	}

	// Add days
	for (var day = 1; day < 32; day++) {
		$("#birthday-date").append('<option value=' + '\"' + day + '\">' + day + '</option>')
	}
	
	// Add years
	for (var year = 2019; year >= 1930; year--) {
		$("#birthday-year").append('<option value=' + '\"' + year + '\">' + year + '</option>')
	}

	// Validation

	function toggleError(invalidField, errorMsg, invalid) {
		if (invalid) {
			invalidField.css("border", "1px solid red");
			errorMsg.show();
		}
		else {
			invalidField.css("border", "none");
			errorMsg.hide();
		}
	}

	function validateEmail(formType) {
		var email = $("#" + formType + "-email");
		if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email.val())) {
			toggleError(email, $("#" + formType + "-email-error"), false);
			return true;
		}
		else {
			toggleError(email, $("#" + formType + "-email-error"), true);
			return false;
		}
	}

	function validatePassword(formType) {
		var pwd = $("#" + formType + "-password");

		if (pwd.val().match(/^[A-Za-z]\w{5,15}$/)) {
			toggleError(pwd, $("#" + formType + "-password-length-error"), false);
			toggleError(pwd, $("#" + formType + "-password-character-error"), false);
			return true;
		}
		else {
			if (pwd.val().length < 6 || pwd.val().length > 15)
				toggleError(pwd, $("#" + formType + "-password-length-error"), true);
			else {
				toggleError(pwd, $("#" + formType + "-password-length-error"), false);
				toggleError(pwd, $("#" + formType + "-password-character-error"), true);
			}
			return false;
		}
	}

	$("#register-email").keyup(function () {
		validateEmail("register");
	});

	$("#register-password").keyup(function () {
		validatePassword("register");
	});

	$("#registration-form").submit(function (event) {
		if (validateEmail("register") && validatePassword("register")) {
			return true;
		}
		
		event.preventDefault();
		return false;
	});

	// Favorite

	// Toggle

	$(".favorite").click(function () {
		if ($(".fa-heart").hasClass("far")) {
			$(".fa-heart").removeClass("far");
			$(".fa-heart").addClass("fas");
		} else {
			$(".fa-heart").removeClass("fas");
			$(".fa-heart").addClass("far");
		}
	});

	// Slideshow

	// Current Slide
	var currentSlide = 1;
	// All the slides
	var $slides = $(".slide");

	function showSlide(index) {
		if (index > $slides.length)
			currentSlide = 1;
		else if (index < 1)
			currentSlide = $slides.length;
		else
			currentSlide = index;
		$slides.fadeOut();
		$(".dot").removeClass("active");
		setTimeout(function () {
			$("#slide-" + currentSlide).fadeIn(600);
		}, 500);
		$("input[name='photoSrc']").val($("#slide-" + currentSlide).attr("src"));
		$("#dot-" + currentSlide).addClass("active");
	}
	// Slides
	$.each($(".slide"), function (index) {
		$(this).attr("id", "slide-" + (index + 1))
	});

	showSlide(currentSlide);

	$.each($(".slide"), function(index) {
		$(this).attr("id", "slide-" + (index + 1));
	});
	$.each($(".dot"), function(index) {
		$(this).attr("id", "dot-" + (index + 1));
	});

	// Dots
	$(".dot").click(function () {
		var id = $(this).attr("id").split("-")[1];
		showSlide(id);
	});

	// Arrows
	$(".arrow").click(function () {
		if ($(this).attr("id") == "prev-slide")
			showSlide(currentSlide - 1);
		else
			showSlide(currentSlide + 1);
	});

	// Photo Option Switch

	$("#photo-switch").change(function () {
		if ($(this).prop("checked")) {
			$("#photo-file").hide("slow");
			$("#photo-link").show("slow");
		}
		else {
			$("#photo-link").hide("slow");
			$("#photo-file").show("slow");
		}
	});

	// Preview uploaded photos

	$("input[name='photo']").change(function () {
		$("#uploaded-photo").empty();

		for (var i = 0; i < this.files.length; i++) {
			var reader = new FileReader();
			reader.onload = function(event) {
				var img = document.createElement('img');
				img.src = event.target.result;
				img.width = 200;
				img.height = 100;
				$("#uploaded-photo").append(img);
			}
			reader.readAsDataURL(this.files[i]);
		}
	});

	// Calculate price list

	function calculateCleaningFee(accommodationFee) {
		var cleaningCost = parseFloat(accommodationFee * 14 / 100);
		if (isFinite(cleaningCost)) {
			// Remove the previous calculation
			$("#cleaning-cost").empty();
			// Display the cleaning fee
			$("#cleaning-cost").append('$<span>' + cleaningCost.toFixed(2) + '</span>');
		}

		return cleaningCost;
	}

	function calculateServiceFee(accommodationFee) {
		var serviceCost = parseFloat(accommodationFee * 20 / 100);
		if (isFinite(serviceCost)) {
			// Remove the previous calculation
			$("#service-cost").empty();
			// Display the service fee
			$("#service-cost").append('$<span>' + serviceCost.toFixed(2) + '</span>');
		}

		return serviceCost;
	}

	function calculateAccommodationCost(startDate, endDate) {
		// Retrieve the base cost
		var cost = parseFloat($("#base-cost").text());
		// Calculate the cost based on the number of selected days
		cost *= Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));
		if (isFinite(cost)) {
			// Remove previous calculation
			$("#accommodation-cost").empty();
			// Display the cost
			$("#accommodation-cost").append('$<span>' + cost.toFixed(2) + '</span>');
		}

		return cost;
	}

	function calculateTotal() {
		var accommodationCost = parseFloat($("#accommodation-cost > span").text());
		var cleaningCost = parseFloat($("#cleaning-cost > span").text());
		var serviceCost = parseFloat($("#service-cost > span").text());
		var totalCost = accommodationCost + cleaningCost + serviceCost;
		
		if (isFinite(totalCost)) {
			// Remove the previous calculation
			$("#total-cost").empty();
			// Display the total cost
			$("#total-cost").append('<h4>$' + parseFloat(totalCost).toFixed(2) + '</h4>');
		}
	}

	function displayBookingDetail(startDate, endDate) {
		var accommodationCost = calculateAccommodationCost(startDate, endDate);
		calculateCleaningFee(accommodationCost);
		calculateServiceFee(accommodationCost)
		calculateTotal();
	}

	$("input[name='checkIn']").change(function () {
		var startDate = new Date($(this).val());
		var endDate = new Date($("input[name='checkOut']").val());
		if (startDate && endDate) {
			displayBookingDetail(startDate, endDate);
		}
	});

	$("input[name='checkOut']").change(function () {
		var startDate = new Date($("input[name='checkIn']").val());
		var endDate = new Date($(this).val());
		if (startDate && endDate) {
			displayBookingDetail(startDate, endDate);
		}
	});

})(jQuery);