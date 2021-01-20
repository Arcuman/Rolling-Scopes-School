export default function wordCardTemplate(word, image, translation) {
    return `
    <div class="word-card__inner">
        <div class="word-card__content word-card_content--front">
          <img class="word-card-img-top" src="assets/${image}" alt="Category">
            <div class="word-card-body">
                <div class="word-card-flip">
                    <img src="assets/img/rotate.svg">
                </div>
                <h2 class="word-card-word">${word}</h2>
                <button class="word-card-sound">
                    <img src="assets/img/audio.svg">
                </button>
            </div>
        </div>
        <div class="word-card__content word-card__content--back">
           <img class="word-card-img-top" src="assets/${image}" alt="Category">
            <div class="word-card-body--back">
                <h2 class="word-card-word">${translation}</h2>
            </div>
        </div>
      </div>
      `;
}
