"use strict";


const form = document.querySelector(".profile-form");

form.addEventListener('submit', function(e){
	e.preventDefault();
	const city = document.querySelector('#city').value;
	console.log(city);
	const state = document.querySelector('#state').value;

	const url = window.location.href+"/update?city="+ city + "&state="+ state;

	ajaxFunctions.ajaxRequest('POST', url, function(data){
		
		if (data) {
			location.reload();
		}else{
			location.reload();
			alert("Oops, Something went wrong, please refresh and try again.");
		}

	}) 
})
