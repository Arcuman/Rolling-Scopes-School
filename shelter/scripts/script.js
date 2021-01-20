let pets = []; // 8
let currPets = [];
let countPets;
let isEnabled = true;


const checkItemsPerPage = () => {
	if (document.querySelector("body").offsetWidth >= 768 && document.querySelector("body").offsetWidth < 1280) {
		return 2;
	}
	if (document.querySelector("body").offsetWidth < 768) {
		return 1;
	} else
		return 3;
}

function generatePetsFromArray(arr) {
	let tempPets = arr.slice();
	let newPets = []
	for (let j = 0; j < countPets; j++) {
		let randInd = Math.floor(Math.random() * tempPets.length);
		const randElem = tempPets.splice(randInd, 1)[0];
		newPets.push(randElem);
	}
	return newPets;
}

function generateNewPets() {
	let newPets = []
	let tempPets = pets.slice();
	for (let j = 0; j < countPets; j++) {
		tempPets.forEach((item, ind) => {
			if (item.name === currPets[j].name) {
				tempPets.splice(ind, 1);
			}
		})
	}
	newPets = generatePetsFromArray(tempPets)
	return newPets;
}

function getNewPets() {
	let newPets = [];
	if (currPets.length < 1) {
		currPets = generatePetsFromArray(pets);
	} else {
		newPets = generateNewPets();
		currPets = newPets;
	}
}

const createPets = (direction) => {
	const petsCards = document.querySelector("#pets-cards");
	createElements(direction);
}

createElements = (direction) => {
	isEnabled = false;
	const cardholder = document.querySelector("#pets-cards");
	const timer = Number(document.querySelector('#pets-cards').offsetWidth) / 2;
	for (let i = 0; i < currPets.length; i++) {
		let petCard = document.createElement('div');
		petCard.className = 'pets-card';
		petCard.innerHTML =
			`
			<img src="${currPets[i].img}" alt="Pets Katrine" class="pets-card__image">
			<div class="pets-card__content">
				<h4 class="pets-card__title">
					${currPets[i].name}
				</h4>
				<button class="pets-card__button">
					Learn more
				</button>
			</div>`
		let delay = timer;
		petCard.onclick = () => openModal(currPets[i].name);
		if (!direction) {
			cardholder.children[i].classList.add('slide-out-right');
			setTimeout(() => {
				cardholder.removeChild(cardholder.lastElementChild);
				petCard.classList.add('slide-in-left');
				cardholder.insertBefore(petCard, cardholder.firstElementChild);
			}, delay);
		} else {
			cardholder.children[i].classList.add('slide-out-left');
			setTimeout(() => {
				cardholder.removeChild(cardholder.firstElementChild);
				petCard.classList.add('slide-in-right');
				cardholder.appendChild(petCard);
			}, delay);
		}
		petCard.addEventListener('animationend', () => {
			petCard.classList.remove('slide-in-left');
			petCard.classList.remove('slide-in-right');
			isEnabled = true;
		});
	}
}

function hideItem(direction) {
	const petsCards = document.querySelector("#pets-cards");
	isEnabled = false;
	petsCards.classList.add(direction);
	petsCards.addEventListener('animationend', function () {
		this.classList.remove('active', direction);
	});
}

function showItem(direction) {
	const petsCards = document.querySelector("#pets-cards");
	petsCards.classList.add('next', direction);
	petsCards.addEventListener('animationend', function () {
		this.classList.remove('next', direction);
		this.classList.add('active');
		isEnabled = true;
	});
}

function getNextPets() {
	getNewPets();
	createPets(true);
}

function getPrevPets() {
	getNewPets();
	createPets(false);
}

function getPetsFromJSON() {
	fetch("../../assets/pets.json").then(res => res.json()).then(list => {
		pets = list;
		countPets = 3;
		getNewPets();
		console.log(currPets);
		createPets(true);
	})
}


function openModal(petName) {
	const modalWindow = document.getElementById('modal-window');
	const modalImage = document.getElementById('modal-image');
	const modalTitle = document.getElementById('modal-title');
	const modalSubtitle = document.getElementById('modal-subtitle');
	const modalDescription = document.getElementById('modal-description');
	const modalAge = document.getElementById('modal-age');
	const modalInoculations = document.getElementById('modal-inoculations');
	const modalDiseases = document.getElementById('modal-diseases');
	const modalParasites = document.getElementById('modal-parasites');

	const petData = pets.find(item => {
		return item.name === petName
	});

	modalImage.src = petData.img;
	modalTitle.textContent = petData.name;
	modalSubtitle.textContent = petData.type + ' - ' + petData.breed;
	modalDescription.textContent = petData.description;
	modalAge.textContent = petData.age;
	modalInoculations.textContent = petData.inoculations.join(', ').trim();
	modalDiseases.textContent = petData.diseases.join(', ').trim();
	modalParasites.textContent = petData.parasites.join(', ').trim();

	document.querySelector('#modal').classList.add('change-modal');
	document.querySelector('body').classList.add('change-body');
}

document.addEventListener("DOMContentLoaded", getPetsFromJSON);


document.querySelector('#slider-next').addEventListener('click', () => {
	if (isEnabled) {
		getNextPets();
	}
})

function popupOver(event) {
	const popupClose = document.querySelector('#modal-close');
	if (Array.from(document.querySelectorAll('.popup-click')).find(node => node === event.target)) popupClose.classList.add('change-close');
}

function popupOut() {
	document.querySelector('#modal-close').classList.remove('change-close');
}

document.querySelectorAll('.popup-click').forEach(popupBlock => {
	popupBlock.addEventListener("mouseover", (event) => popupOver(event), false);
	popupBlock.addEventListener("mouseout", (event) => popupOut(event), false);
});



document.querySelector('#modal').addEventListener('click', () => {
	document.querySelector('#modal').classList.remove('change-modal');
	document.querySelector('body').classList.remove('change-body');
})

document.querySelector('#modal-window').addEventListener('click', (event) => event.stopPropagation(), false);

document.querySelector('#slider-prev').addEventListener('click', () => {
	if (isEnabled) {
		getPrevPets();
	}
})

document.querySelector('#burger-menu').addEventListener('click', () => {
	document.querySelector('#burger-menu').classList.toggle('change-burger-menu');
	document.querySelector('.header-burger-bar').classList.toggle('change-header-burger-bar');
	document.querySelector('.header-burger-bar1').classList.toggle('change-header-burger-bar1');
	document.querySelector('.header-burger-bar2').classList.toggle('change-header-burger-bar2');
	document.querySelector('.header-burger-bar3').classList.toggle('change-header-burger-bar3');
	document.querySelector('#menu').classList.toggle('change-menu');
	document.querySelector('#logo').classList.toggle('change-header-logo');
	document.querySelector('#logo-title').classList.toggle('change-header-logo-title');
	document.querySelector('#logo-subtitle').classList.toggle('change-header-logo-subtitle');
	document.querySelector('body').classList.toggle('change-body');

})









// let currentPage = 0;
// document.querySelector("#prevPage").addEventListener('click', (e) => {
// 	if (currentPage > 0) {
// 		currentPage--;
// 		console.log(currentPage + 1);
// 	}
// 	document.querySelector("#pets").style.top = `calc(35px - ${190 * currentPage}px)`;
// 	document.querySelector("#currentPage").innerText = (currentPage + 1).toString();

// });

// document.querySelector("#nextPage").addEventListener('click', (e) => {
// 	if (currentPage < (document.querySelector("#pets").offsetHeight / 190) - 1) {
// 		currentPage++;
// 		console.log(currentPage + 1);
// 	}

// 	document.querySelector("#pets").style.top = `calc(35px - ${190 * currentPage}px)`;
// 	document.querySelector("#currentPage").innerText = (currentPage + 1).toString();
// });

// (fullPetsList / itemsPerPage)

// // let itemsPerPage = 8;





// function closeModal() {
// 	const elements = ['modal', 'modal-window'];
// 	this.switchView(elements);
// }