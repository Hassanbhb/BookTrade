"use strict";

const tradeBtn = document.querySelectorAll('.trade');

const modalbtn = document.querySelector(".modalbtn");
const modalBody = document.querySelector('.modal-body');
let userChoice;

let imgSrc;
let imgOwner;
let myImgSrc;
let myBookOwner;

//trade button functionality
for (var i = 0; i < tradeBtn.length; i++) {

	tradeBtn[i].addEventListener('click', function(event){
		//get the img src of the book the user want's and the book he wants to give
		//and the ids of the owners of both books
		imgSrc = encodeURIComponent(event.target.parentElement.firstElementChild.currentSrc);
		imgOwner = event.target.parentElement.firstElementChild.dataset.id;
		
		//gat the current users books to give him a choice to choose which book
		//he is ready to give
		const url = "https://rocky-journey-81281.herokuapp.com/user/books";
		ajaxFunctions.ajaxRequest('GET', url, function(data){
			const arr = JSON.parse(data);
			console.log(arr);
			if (arr) {
				for (var i = 0; i < arr.length; i++) {
					
					modalBody.innerHTML += `<div class="text-center">
												<img data-id="${arr[i]._id}" src="${arr[i].bookimg}"><br>	
												<button ype="button" class="btn btn-default myChoice" data-dismiss="modal">trade this</button>
											</div>`; 
				}
				userChoice = document.querySelectorAll(".myChoice");
				
				if (userChoice) {
					userPick(userChoice);
				}
			}else{
				console.log('no data');
			}
			
		});

		
	})
}

const opirations = document.querySelector('.opirations');

function userPick(userChoice){
	for (var i = 0; i < userChoice.length; i++) {
		userChoice[i].addEventListener('click', function(e){
			myImgSrc = encodeURIComponent(event.target.parentElement.firstElementChild.currentSrc);
			myBookOwner = event.target.parentElement.firstElementChild.dataset.id;
			
			const uri = window.location.href+"?owner="+imgOwner+"&imgsrc="+imgSrc+"&mybook="+myImgSrc+"&myBookOwner="+myBookOwner;

			ajaxFunctions.ajaxRequest('POST', uri, function(data){
				const info = JSON.parse(data);
				if (info) {
					if (data) {
						location.reload(); 
					};
				}
			})
		})
	}
}

//stop the books from adding up again and again
const modalCloseBtn = document.querySelector(".close");

modalCloseBtn.addEventListener('click', function(e){
	modalBody.innerHTML = "";
})

//cancel buttons functionality

const cancel_btn = document.querySelectorAll(".cancel");

for (var i = 0; i < cancel_btn.length; i++) {
	cancel_btn[i].addEventListener('click', function(e){
		
		const tradeId = e.target.dataset.tradeid;

		const deleteURI = window.location.href+"?tradeid="+tradeId;

		ajaxFunctions.ajaxRequest('DELETE', deleteURI, function(data){
			if (data) {
				console.log(data);
				location.reload();
			}else{
				console.log("no data");
			}
		})
	})
}

//accept button functionality
const accept_btn = document.querySelectorAll(".accept");

for (var i = 0; i < accept_btn.length; i++) {
	accept_btn[i].addEventListener('click', function(e){
		
		const tradeId = e.target.dataset.tradeid;
		const userTwo = e.target.dataset.userTwo; 
		const putURI = "https://rocky-journey-81281.herokuapp.com/user/books?tradeid="+ tradeId +"&usertwo="+ userTwo;

		ajaxFunctions.ajaxRequest('POST', putURI, function(data){
			if (data) {
				console.log(data);
				location.reload();
			}else{
				console.log("no data");
			}
		})
	})
}