"use strict";
let pets = []; // 8
let fullPetsList = []; //48
let currPets = [];
let currentPage;
let countPets;
let isEnabled = true;

const checkItemsPerPage = () => {
  if (
    document.querySelector("body").offsetWidth >= 768 &&
    document.querySelector("body").offsetWidth < 1280
  ) {
    return 6;
  }
  if (document.querySelector("body").offsetWidth < 768) {
    return 3;
  } else return 8;
};

function getNewPets() {
  let tempArr = [];

  for (let i = 0; i < 6; i++) {
    const newPets = pets;

    for (let j = pets.length; j > 0; j--) {
      let randInd = Math.floor(Math.random() * j);
      const randElem = newPets.splice(randInd, 1)[0];
      newPets.push(randElem);
    }
    tempArr = [...tempArr, ...newPets];
  }
  return tempArr;
}

const sort863 = (list) => {
  const length = list.length;

  for (let i = 0; i < length / 6; i++) {
    const stepList = list.slice(i * 6, i * 6 + 6);

    for (let j = 0; j < 6; j++) {
      const duplicatedItem = stepList.find((item, ind) => {
        return item.name === stepList[j].name && ind !== j;
      });

      if (duplicatedItem !== undefined) {
        const ind = i * 6 + j;
        const which8OfList = Math.trunc(ind / 8);

        list.splice(which8OfList * 8, 0, list.splice(ind, 1)[0]);

        i -= 2;
        break;
      }
    }
  }

  return list;
};

const createPets = (direction, countPet) => {
  const petsCards = document.querySelector("#pets-cards");
  createElements(direction, countPet);
};

const createElements = (direction) => {
  isEnabled = false;
  let currPets = fullPetsList.slice(0, 8);
  const cardholder = document.querySelector("#pets-cards");
  const timer = Number(document.querySelector("#pets-cards").offsetWidth) / 2;
  for (let i = 0; i < 8; i++) {
    let petCard = document.createElement("div");
    petCard.className = "pets-card";
    petCard.id = `pets-card-${i}`;
    petCard.innerHTML = `
			<img src="${currPets[i].img}" alt="Pets Katrine" class="pets-card__image">
			<div class="pets-card__content">
				<h4 class="pets-card__title">
					${currPets[i].name}
				</h4>
				<button class="pets-card__button">
					Learn more
				</button>
			</div>`;
    let delay = timer;
    petCard.onclick = () => openModal(currPets[i].name);
    if (!direction) {
      cardholder.children[i].classList.add("slide-out-right");
      setTimeout(() => {
        cardholder.removeChild(cardholder.lastElementChild);
        petCard.classList.add("slide-in-left");
        cardholder.insertBefore(petCard, cardholder.firstElementChild);
      }, delay);
    } else {
      cardholder.children[i].classList.add("slide-out-left");
      setTimeout(() => {
        cardholder.removeChild(cardholder.firstElementChild);
        petCard.classList.add("slide-in-right");
        cardholder.appendChild(petCard);
      }, delay);
    }
    petCard.addEventListener("animationend", () => {
      petCard.classList.remove("slide-in-left");
      petCard.classList.remove("slide-in-right");
      isEnabled = true;
    });
  }
};

function setCurrentPage(currentPage) {
  document.querySelector("#current-page").innerHTML = currentPage + 1;
}

function reFillCard(temp, cardIndex, direction) {
  isEnabled = false;
  const delay = Number(document.querySelector("#pets-cards").offsetWidth) / 2;
  const petCard = document.querySelector(`#pets-card-${cardIndex}`);

  if (direction) {
    petCard.classList.add("slide-out-right");
    setTimeout(() => {
      petCard.classList.remove("slide-out-right");
      petCard.classList.add("slide-in-left");
      petCard.children[0].src = temp.img;
      let inner = petCard.children[1];
      inner.children[0].textContent = temp.name;
    }, delay);
  } else {
    petCard.classList.add("slide-out-left");
    setTimeout(() => {
      petCard.classList.remove("slide-out-left");
      petCard.classList.add("slide-in-right");
      petCard.children[0].src = temp.img;
      let inner = petCard.children[1];
      inner.children[0].textContent = temp.name;
    }, delay);
  }
  petCard.addEventListener("animationend", () => {
    petCard.classList.remove("slide-in-right");
    petCard.classList.remove("slide-in-left");
    isEnabled = true;
  });
}

function refillCards(direction) {
  const cardsOnPage = document.querySelectorAll(".pets-card");
  let i = 0;
  cardsOnPage.forEach((temp, cardIndex) => {
    if (i >= currPets.length) return;
    reFillCard(currPets[i], cardIndex, direction);
    i++;
  });
}

function getFirstPets() {
  countPets = checkItemsPerPage();
  currentPage = 0;
  currPets = fullPetsList.slice(
    countPets * currentPage,
    countPets * (currentPage + 1)
  );
  setCurrentPage(currentPage);
  refillCards(true);

  document.querySelector("#next-page").removeAttribute("disabled");
  document.querySelector("#next-page").classList.add("slider-button-next");
  document.querySelector("#next-page").classList.remove("slider-button-back");

  document.querySelector("#last-page").removeAttribute("disabled");
  document.querySelector("#last-page").classList.add("slider-button-next");
  document.querySelector("#last-page").classList.remove("slider-button-back");

  document.querySelector("#prev-page").setAttribute("disabled", "disabled");
  document.querySelector("#prev-page").classList.remove("slider-button-next");
  document.querySelector("#prev-page").classList.add("slider-button-back");

  document.querySelector("#first-page").setAttribute("disabled", "disabled");
  document.querySelector("#first-page").classList.remove("slider-button-next");
  document.querySelector("#first-page").classList.add("slider-button-back");
}
function getLastPets() {
  countPets = checkItemsPerPage();
  currentPage = fullPetsList.length / countPets - 1;
  currPets = fullPetsList.slice(
    countPets * currentPage,
    countPets * (currentPage + 1)
  );
  setCurrentPage(currentPage);
  refillCards(false);

  document.querySelector("#prev-page").removeAttribute("disabled");
  document.querySelector("#prev-page").classList.add("slider-button-next");
  document.querySelector("#prev-page").classList.remove("slider-button-back");

  document.querySelector("#first-page").removeAttribute("disabled");
  document.querySelector("#first-page").classList.add("slider-button-next");
  document.querySelector("#first-page").classList.remove("slider-button-back");

  document.querySelector("#next-page").setAttribute("disabled", "disabled");
  document.querySelector("#next-page").classList.remove("slider-button-next");
  document.querySelector("#next-page").classList.add("slider-button-back");

  document.querySelector("#last-page").setAttribute("disabled", "disabled");
  document.querySelector("#last-page").classList.remove("slider-button-next");
  document.querySelector("#last-page").classList.add("slider-button-back");
}
function getNextPets() {
  currentPage++;
  countPets = checkItemsPerPage();
  currPets = fullPetsList.slice(
    countPets * currentPage,
    countPets * (currentPage + 1)
  );
  setCurrentPage(currentPage);

  refillCards(false);
  if (currentPage > 0) {
    document.querySelector("#prev-page").removeAttribute("disabled");
    document.querySelector("#prev-page").classList.add("slider-button-next");
    document.querySelector("#prev-page").classList.remove("slider-button-back");

    document.querySelector("#first-page").removeAttribute("disabled");
    document.querySelector("#first-page").classList.add("slider-button-next");
    document
      .querySelector("#first-page")
      .classList.remove("slider-button-back");
  }
  if (fullPetsList.length / countPets <= currentPage + 1) {
    document.querySelector("#next-page").setAttribute("disabled", "disabled");
    document.querySelector("#next-page").classList.remove("slider-button-next");
    document.querySelector("#next-page").classList.add("slider-button-back");

    document.querySelector("#last-page").setAttribute("disabled", "disabled");
    document.querySelector("#last-page").classList.remove("slider-button-next");
    document.querySelector("#last-page").classList.add("slider-button-back");
  }
}

function getPrevPets() {
  currentPage--;
  countPets = checkItemsPerPage();
  currPets = fullPetsList.slice(
    countPets * currentPage,
    countPets * (currentPage + 1)
  );
  setCurrentPage(currentPage);

  refillCards(true);

  if (currentPage == 0) {
    document.querySelector("#prev-page").setAttribute("disabled", "disabled");
    document.querySelector("#prev-page").classList.remove("slider-button-next");
    document.querySelector("#prev-page").classList.add("slider-button-back");

    document.querySelector("#first-page").setAttribute("disabled", "disabled");
    document
      .querySelector("#first-page")
      .classList.remove("slider-button-next");
    document.querySelector("#first-page").classList.add("slider-button-back");
  } else if (fullPetsList.length / countPets >= currentPage) {
    document.querySelector("#next-page").removeAttribute("disabled");
    document.querySelector("#next-page").classList.add("slider-button-next");
    document.querySelector("#next-page").classList.remove("slider-button-back");

    document.querySelector("#last-page").removeAttribute("disabled");
    document.querySelector("#last-page").classList.add("slider-button-next");
    document.querySelector("#last-page").classList.remove("slider-button-back");
  }
}

function getPetsFromJSON() {
  fetch("../../assets/pets.json")
    .then((res) => res.json())
    .then((list) => {
      pets = list;
      currentPage = 0;
      countPets = checkItemsPerPage();
      fullPetsList = getNewPets();
      fullPetsList = sort863(fullPetsList);
      currPets = fullPetsList.slice(
        countPets * currentPage,
        countPets * (currentPage + 1)
      );
      setCurrentPage(currentPage);
      createPets(true, countPets);
    });
}

function openModal(petName) {
  const modalWindow = document.getElementById("modal-window");
  const modalImage = document.getElementById("modal-image");
  const modalTitle = document.getElementById("modal-title");
  const modalSubtitle = document.getElementById("modal-subtitle");
  const modalDescription = document.getElementById("modal-description");
  const modalAge = document.getElementById("modal-age");
  const modalInoculations = document.getElementById("modal-inoculations");
  const modalDiseases = document.getElementById("modal-diseases");
  const modalParasites = document.getElementById("modal-parasites");

  const petData = pets.find((item) => {
    return item.name === petName;
  });

  modalImage.src = petData.img;
  modalTitle.textContent = petData.name;
  modalSubtitle.textContent = petData.type + " - " + petData.breed;
  modalDescription.textContent = petData.description;
  modalAge.textContent = petData.age;
  modalInoculations.textContent = petData.inoculations.join(", ").trim();
  modalDiseases.textContent = petData.diseases.join(", ").trim();
  modalParasites.textContent = petData.parasites.join(", ").trim();

  document.querySelector("#modal").classList.add("change-modal");
  document.querySelector("body").classList.add("change-body");
}

document.addEventListener("DOMContentLoaded", getPetsFromJSON);

function popupOver(event) {
  const popupClose = document.querySelector("#modal-close");
  if (
    Array.from(document.querySelectorAll(".popup-click")).find(
      (node) => node === event.target
    )
  )
    popupClose.classList.add("change-close");
}

document.querySelector("#next-page").addEventListener("click", getNextPets);

document.querySelector("#prev-page").addEventListener("click", getPrevPets);

document.querySelector("#first-page").addEventListener("click", getFirstPets);

document.querySelector("#last-page").addEventListener("click", getLastPets);

function popupOut() {
  document.querySelector("#modal-close").classList.remove("change-close");
}

document.querySelectorAll(".popup-click").forEach((popupBlock) => {
  popupBlock.addEventListener("mouseover", (event) => popupOver(event), false);
  popupBlock.addEventListener("mouseout", (event) => popupOut(event), false);
});

document.querySelector("#modal").addEventListener("click", () => {
  document.querySelector("#modal").classList.remove("change-modal");
  document.querySelector("body").classList.remove("change-body");
});

document
  .querySelector("#modal-window")
  .addEventListener("click", (event) => event.stopPropagation(), false);

document.querySelector("#burger-menu").addEventListener("click", () => {
  document.querySelector("#burger-menu").classList.toggle("change-burger-menu");
  document
    .querySelector(".header-burger-bar")
    .classList.toggle("change-header-burger-bar");
  document
    .querySelector(".header-burger-bar1")
    .classList.toggle("change-header-burger-bar1");
  document
    .querySelector(".header-burger-bar2")
    .classList.toggle("change-header-burger-bar2");
  document
    .querySelector(".header-burger-bar3")
    .classList.toggle("change-header-burger-bar3");
  document.querySelector("#menu").classList.toggle("change-menu");
  document.querySelector("#logo").classList.toggle("change-header-logo");
  document
    .querySelector("#logo-title")
    .classList.toggle("change-header-logo-title");
  document
    .querySelector("#logo-subtitle")
    .classList.toggle("change-header-logo-subtitle");
  document.querySelector("body").classList.toggle("change-body");
});
