"use strict";

const form = document.querySelector('.mybooks-form');
const booksDiv = document.querySelector('.panel-group');
// display search results
form.addEventListener('submit', function(e){
	booksDiv.innerHTML = ""; 
	e.preventDefault();
	const searchTerm = document.querySelector('#search').value;
	const url = window.location.href+"/search?q="+searchTerm;
	
	//get all search results and display them
	ajaxFunctions.ajaxRequest('POST', url, function(data){
		//if data exists
		if (data) {
			//make it in json format
			const books = JSON.parse(data);
			//lookp trough the books and add them to the view
			for (var i = 0; i < books.length; i++) {
				//if no image and no description
				if (books[i].description === undefined && books[i].imagelinks === undefined) {
					booksDiv.innerHTML += `<div class='panel panel-default'>
											<div class='panel-body'>
												<div class='col-sm-2'>
													<p>No image available</p>
													<button class="add" data-text='${books[i].title}' data-img="no image">I own this book</button>
												</div>
												<div class='col-sm-10'>
													<h4 >Title: <span class="bookTitle"> ${books[i].title} </span></h4>
													<p>Authors: ${books[i].authors}</p>
													<p>Language ${books[i].language}</p>
													<p>Description: No description is available</p>
												</div>
												
											</div>
										</div>` 
					//if just no description					
				}else if (books[i].description === undefined) {
					booksDiv.innerHTML += `<div class='panel panel-default'>
											<div class='panel-body'>
												<div class='col-sm-2'>
													<img src="${books[i].imagelinks.thumbnail}">
													<button class="add" data-text='${books[i].title}' data-img="${books[i].imagelinks.thumbnail}">I own this book</button>
												</div>
												<div class='col-sm-10'>
													<h4 >Title: <span class="bookTitle"> ${books[i].title} </span></h4>
													<p>Authors: ${books[i].authors}</p>
													<p>Language ${books[i].language}</p>
													<p>Description: No description is available</p>
												</div>
												
											</div>
										</div>` 
				//if everything exists						
				}else{
					booksDiv.innerHTML += `<div class='panel panel-default'>
											<div class='panel-body'>
												<div class='col-sm-2'>
													<img src="${books[i].imagelinks.thumbnail}">
													<button class="add" data-text='${books[i].title}' data-img="${books[i].imagelinks.thumbnail}">I own this book</button>
												</div>
												<div class='col-sm-10'>
													<h4 >Title: <span class="bookTitle"> ${books[i].title} </span></h4>
													<p>Authors: ${books[i].authors}</p>
													<p>Language ${books[i].language}</p>
													<p>Description: ${books[i].description}</p>
												</div>
												
											</div>
										</div>` 
				}
				
			}
		}else{
			//if there is an error
			console.log('no data');
		}
	}) 
})

const panelGroup = document.querySelector('.panel-group');
const mybooks = document.querySelector('.mybooks');
// make the user select the book he owns to add to his books
panelGroup.addEventListener('click', function(e){

	//check if it's the "i own this book" button
	
	if (e.target.tagName === "BUTTON" && e.target.classList.contains("add") === true) {
		//find data attr to get the books title and the img url
		const bookName = e.target.attributes["data-text"].value;
		//encode because of special characters
		const bookImg = encodeURIComponent(e.target.attributes["data-img"].value);
		//make a post req to add the book into users books arr
		const url2 = window.location.href+"/addmybook?b="+bookName+"&img="+bookImg;
		ajaxFunctions.ajaxRequest('POST', url2, function(data){

			if (data) {
				location.reload();
			}
			
		})
	}
})

const url3 = "http://localhost:8080/mybooks"
ajaxFunctions.ajaxRequest('GET', url3, function(data){

	if (data) {
		console.log("Share MOAR books");
	}

})

//delete the book the user chooses to delete

const deleteBook = document.querySelectorAll('.deleteBook');

for (var i = 0; i < deleteBook.length; i++) {
	deleteBook[i].addEventListener('click', function(e){
		e.preventDefault();
		const delBook = encodeURIComponent(e.target.parentElement.firstElementChild.children[0].currentSrc);
		console.log(delBook);
		const delURI = "http://localhost:8080/mybooks?delbook=" + delBook;
		ajaxFunctions.ajaxRequest('DELETE', delURI, function(data){
			if (data) {
				location.reload();
			}else{
				console.log("no data");
			}
		})
	})
}


