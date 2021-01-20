/* eslint-disable no-param-reassign */
/* eslint-disable import/extensions */

import * as storage from "./storage.js";
import create from "./utils/create.js";
import language from "./layouts/index.js"; // { en, ru }
import Key from "./Key.js";

const main = create("main", "", [
  create("h1", "title", "Virtual Keyboard"),
  create(
    "p",
    "hint",
    "Use left <kbd>Ctrl</kbd> + <kbd>Alt</kbd> to switch language. Last language saves in localStorage."
  ),
  create(
    "p",
    "hint",
    "Use button 'hide'(on the virtual keyboard) to hide keyboard. And click on text area to show keyboard"
  ),
  create(
    "p",
    "hint",
    "Button 'Sound'(on the virtual keyboard) toggles keyboard sounds on and off. Green button - on, Gray button - off"
  ),
  create(
    "p",
    "hint",
    "Button 'Voice'(on the virtual keyboard) toggles keyboard voice input on/off. Green button - on, Gray button - off.\
	  Wait a bit when language switch "
  ),
]);

export default class Keyboard {
  constructor(rowsOrder) {
    this.rowsOrder = rowsOrder;
    this.keysPressed = {};
    this.isCaps = false;
  }

  init(langCode) {
    this.keyBase = language[langCode];
    this.output = create(
      "textarea",
      "output",
      null,
      main,
      ["placeholder", "Click here to start..."],
      ["rows", 5],
      ["cols", 50],
      ["spellcheck", true],
      ["autocorrect", "on"]
    );
    this.audios = [];
    Object.keys(language).forEach((lang) => {
      this.audios.push([
        `${lang}-letter`,
        create("audio", null, null, main, [
          "src",
          `./assets/sounds/${lang}/letter.mp3`,
        ]),
      ]);
      this.audios.push([
        `${lang}-func`,
        create("audio", null, null, main, [
          "src",
          `./assets/sounds/${lang}/func.mp3`,
        ]),
      ]);
    });
    this.isSoundOn = true;
    this.container = create("div", "keyboard keyboard-hidden", null, main, [
      "language",
      langCode,
    ]);
    this.isHidden = true;
    document.body.prepend(main);
    return this;
  }

  generateLayout() {
    this.keyButtons = [];
    this.rowsOrder.forEach((row, i) => {
      const rowElement = create("div", "keyboard__row", null, this.container, [
        "row",
        i + 1,
      ]);
      rowElement.style.display = "flex";
      row.forEach((code) => {
        const keyObj = this.keyBase.find((key) => key.code === code);
        if (keyObj) {
          const keyButton = new Key(keyObj);
          if (keyButton.code === "Sound") keyButton.div.classList.add("active");
          this.keyButtons.push(keyButton);
          rowElement.appendChild(keyButton.div);
        }
      });
    });
    this.output.onclick = this.getVisibleBoard;
    document.addEventListener("keydown", this.handleEvent);
    document.addEventListener("keyup", this.handleEvent);
    this.container.onmousedown = this.preHandleEvent;
    this.container.onmouseup = this.preHandleEvent;
  }

  getVisibleBoard = (e) => {
    e.stopPropagation();
    this.container.classList.remove("keyboard-hidden");
    this.isHidden = false;
  };
  preHandleEvent = (e) => {
    e.stopPropagation();
    const keyDiv = e.target.closest(".keyboard__key");
    if (!keyDiv) return;
    const {
      dataset: { code },
    } = keyDiv;
    keyDiv.addEventListener("mouseleave", this.resetButtonState);
    this.handleEvent({ code, type: e.type });
  };

  // Ф-я обработки событий

  handleEvent = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    if (this.isHidden) return;
    const { code, type } = e;
    const keyObj = this.keyButtons.find((key) => key.code === code);
    if (!keyObj) return;
    this.output.focus();

    // НАЖАТИЕ КНОПКИ
    if (type.match(/keydown|mousedown/)) {
      //Воспроизведение звуков клавиатуры
      if (this.isSoundOn) {
        let lang = this.container.dataset.language;
        if (keyObj.isFnKey) {
          let audio = this.audios.find(
            (audioDiv) => audioDiv[0] === `${lang}-func`
          )[1];
          audio.currentTime = 0;
          audio.play();
        } else {
          let audio = this.audios.find(
            (audioDiv) => audioDiv[0] === `${lang}-letter`
          )[1];
          audio.currentTime = 0;
          audio.play();
        }
      }

      if (!type.match(/mouse/)) e.preventDefault();

      if (code.match(/HideButton/)) {
        this.container.classList.add("keyboard-hidden");
        this.output.blur();
        this.isHidden = true;
        return;
      }

      if (code.match(/Control|Alt|Caps|Shift/) && e.repeat) return;

      if (code.match(/Control/)) this.ctrKey = true;

      if (code.match(/Alt/)) this.altKey = true;

      if (code.match(/Lang/)) this.switchLanguage();

      if (code.match(/Control/) && this.altKey) this.switchLanguage();
      if (code.match(/Alt/) && this.ctrKey) this.switchLanguage();

      keyObj.div.classList.add("active");

      // if (code.match(/Shift/)) this.shiftKey = true;
      // if (this.shiftKey) this.switchUpperCase(true);
      if (code.match(/Shift/) && !this.shiftKey) {
        this.shiftKey = true;
        this.switchUpperCase(true);
      } else if (code.match(/Shift/) && this.shiftKey) {
        this.shiftKey = false;
        this.switchUpperCase(false);
        keyObj.div.classList.remove("active");
      }

      if (code.match(/Caps/) && !this.isCaps) {
        this.isCaps = true;
        this.switchUpperCase(true);
      } else if (code.match(/Caps/) && this.isCaps) {
        this.isCaps = false;
        this.switchUpperCase(false);
        keyObj.div.classList.remove("active");
      }

      if (code.match(/Sound/) && !this.isSoundOn) {
        this.isSoundOn = true;
      } else if (code.match(/Sound/) && this.isSoundOn) {
        this.isSoundOn = false;
        keyObj.div.classList.remove("active");
      }
      if (code.match(/Voice/) && !this.isVoiceOn) {
        this.isVoiceOn = true;
        this.speechRecognationStart();
      } else if (code.match(/Voice/) && this.isVoiceOn) {
        this.isVoiceOn = false;
        this.speechRecognationEnd();
        keyObj.div.classList.remove("active");
      }
      // Определяем, какой символ мы пишем в консоль (спец или основной)
      if (!this.isCaps) {
        // если не зажат капс, смотрим не зажат ли шифт
        this.printToOutput(keyObj, this.shiftKey ? keyObj.shift : keyObj.small);
      } else if (this.isCaps) {
        // если зажат капс
        if (this.shiftKey) {
          // и при этом зажат шифт - то для кнопки со спецсимволом даем верхний регистр
          this.printToOutput(
            keyObj,
            keyObj.sub.innerHTML ? keyObj.shift : keyObj.small
          );
        } else {
          // и при этом НЕ зажат шифт - то для кнопки без спецсивмола даем верхний регистр
          this.printToOutput(
            keyObj,
            !keyObj.sub.innerHTML ? keyObj.shift : keyObj.small
          );
        }
      }
      this.keysPressed[keyObj.code] = keyObj;
      // ОТЖАТИЕ КНОПКИ
    } else if (e.type.match(/keyup|mouseup/)) {
      this.resetPressedButtons(code);
      if (code.match(/Control/)) this.ctrKey = false;
      if (code.match(/Alt/)) this.altKey = false;
      if (
        !code.match(/Caps/) &&
        !code.match(/Shift/) &&
        !code.match(/Sound/) &&
        !code.match(/Voice/)
      )
        keyObj.div.classList.remove("active");
    }
  };

  speechRecognationStart() {
    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    this.recognition = new SpeechRecognition();
    this.recognition.interimResults = true;
    //this.recognition.lang = "en-US";
    //  this.recognition.lang = "ru-RU";
    this.recognition.lang =
      this.container.dataset.language === "ru" ? "ru-RU" : "en-US";
    this.recognition.addEventListener("result", (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      const poopScript = transcript.replace(/poop|poo|shit|dump/gi, "💩");

      if (e.results[0].isFinal) {
        this.printToOutputVoice(poopScript);
      }
    });

    this.recognition.addEventListener("end", this.recognition.start);

    this.recognition.start();
  }
  speechRecognationEnd() {
    this.recognition.stop();
    this.recognition.removeEventListener("end", this.recognition.start);
  }

  resetButtonState = ({
    target: {
      dataset: { code },
    },
  }) => {
    if (code.match(/Control/)) this.ctrKey = false;
    if (code.match(/Alt/)) this.altKey = false;
    this.resetPressedButtons(code);
    if (!this.isHidden) this.output.focus();
  };

  resetPressedButtons = (targetCode) => {
    if (!this.keysPressed[targetCode]) return;
    if (
      !targetCode.match(/Caps/) &&
      !targetCode.match(/Shift/) &&
      !targetCode.match(/Sound/) &&
      !targetCode.match(/Voice/)
    )
      this.keysPressed[targetCode].div.classList.remove("active");
    this.keysPressed[targetCode].div.removeEventListener(
      "mouseleave",
      this.resetButtonState
    );
    delete this.keysPressed[targetCode];
  };

  switchUpperCase(isTrue) {
    // Флаг - чтобы понимать, мы поднимаем регистр или опускаем
    if (isTrue) {
      // Мы записывали наши кнопки в keyButtons, теперь можем легко итерироваться по ним
      this.keyButtons.forEach((button) => {
        // Если у кнопки есть спецсивол - мы должны переопределить стили
        if (button.sub) {
          // Если только это не капс, тогда поднимаем у спецсимволов
          if (this.shiftKey) {
            button.sub.classList.add("sub-active");
            button.letter.classList.add("sub-inactive");
          }
        }
        // Не трогаем функциональные кнопки
        // И если капс, и не шифт, и именно наша кнопка без спецсимвола
        if (
          !button.isFnKey &&
          this.isCaps &&
          !this.shiftKey &&
          !button.sub.innerHTML
        ) {
          // тогда поднимаем регистр основного символа letter
          button.letter.innerHTML = button.shift;
          // Если капс и зажат шифт
        } else if (!button.isFnKey && this.isCaps && this.shiftKey) {
          // тогда опускаем регистр для основного симовла letter
          button.letter.innerHTML = button.small;
          // а если это просто шифт - тогда поднимаем регистр у основного символа
          // только у кнопок, без спецсимвола --- там уже выше отработал код для них
        } else if (!button.isFnKey && !button.sub.innerHTML) {
          button.letter.innerHTML = button.shift;
        }
      });
    } else {
      // опускаем регистр в обратном порядке
      this.keyButtons.forEach((button) => {
        // Не трогаем функциональные кнопки
        // Если есть спецсимвол
        if (button.sub.innerHTML && !button.isFnKey) {
          // то возвращаем в исходное
          // если не зажат капс и не нажат шифт
          if (!this.isCaps && !this.shiftKey) {
            button.sub.classList.remove("sub-active");
            button.letter.classList.remove("sub-inactive");
            // то просто возвращаем основным символам нижний регистр
            button.letter.innerHTML = button.small;
            //если не зажат капс но зажат шифт
          } else if (this.isCaps && !this.shiftKey) {
            button.sub.classList.remove("sub-active");
            button.letter.classList.remove("sub-inactive");
          }
          // если это кнопка без спецсимвола (снова не трогаем функциональные)
        } else if (!button.isFnKey) {
          // то если зажат капс
          if (!this.isCaps && !this.shiftKey) {
            // то просто возвращаем основным символам нижний регистр
            button.letter.innerHTML = button.small;
            //если не зажат капс но зажат шифт
          } else if (!this.isCaps && this.shiftKey) {
            // если шифт зажат - то возвращаем верхний регистр
            button.letter.innerHTML = button.shift;
          } else if (this.isCaps && !this.shiftKey) {
            // если шифт зажат - то возвращаем верхний регистр
            button.letter.innerHTML = button.shift;
          }
        }
      });
    }
  }

  switchLanguage = () => {
    const langAbbr = Object.keys(language);
    let langIdx = langAbbr.indexOf(this.container.dataset.language);
    this.keyBase =
      langIdx + 1 < langAbbr.length
        ? language[langAbbr[(langIdx += 1)]]
        : language[langAbbr[(langIdx -= langIdx)]];

    this.container.dataset.language = langAbbr[langIdx];
    storage.set("kbLang", langAbbr[langIdx]);

    if (this.recognition) {
      this.recognition.stop();
      this.recognition.lang =
        this.container.dataset.language === "ru" ? "ru-RU" : "en-US";
    }

    this.keyButtons.forEach((button) => {
      const keyObj = this.keyBase.find((key) => key.code === button.code);
      if (!keyObj) return;
      button.shift = keyObj.shift;
      button.small = keyObj.small;
      if (keyObj.shift && keyObj.shift.match(/[^a-zA-Zа-яА-ЯёЁ0-9]/g)) {
        button.sub.innerHTML = keyObj.shift;
      } else {
        button.sub.innerHTML = "";
      }
      button.letter.innerHTML = keyObj.small;
    });
    if (this.isCaps) this.switchUpperCase(true);
  };

  printToOutput(keyObj, symbol) {
    let cursorPos = this.output.selectionStart;
    const left = this.output.value.slice(0, cursorPos);
    const right = this.output.value.slice(cursorPos);
    const textHandlers = {
      Tab: () => {
        this.output.value = `${left}\t${right}`;
        cursorPos += 1;
      },
      ArrowLeft: () => {
        cursorPos = cursorPos - 1 >= 0 ? cursorPos - 1 : 0;
      },
      ArrowRight: () => {
        cursorPos += 1;
      },
      ArrowUp: () => {
        const positionFromLeft = this.output.value
          .slice(0, cursorPos)
          .match(/(\n).*$(?!\1)/g) || [[1]];
        cursorPos -= positionFromLeft[0].length;
      },
      ArrowDown: () => {
        const positionFromLeft = this.output.value
          .slice(cursorPos)
          .match(/^.*(\n).*(?!\1)/) || [[1]];
        cursorPos += positionFromLeft[0].length;
      },
      Enter: () => {
        this.output.value = `${left}\n${right}`;
        cursorPos += 1;
      },
      Delete: () => {
        this.output.value = `${left}${right.slice(1)}`;
      },
      Backspace: () => {
        this.output.value = `${left.slice(0, -1)}${right}`;
        cursorPos -= 1;
      },
      Space: () => {
        this.output.value = `${left} ${right}`;
        cursorPos += 1;
      },
    };
    if (textHandlers[keyObj.code]) textHandlers[keyObj.code]();
    else if (!keyObj.isFnKey) {
      cursorPos += 1;
      this.output.value = `${left}${symbol || ""}${right}`;
    }
    this.output.setSelectionRange(cursorPos, cursorPos);
  }
  printToOutputVoice(word) {
    let cursorPos = this.output.selectionStart;
    const left = this.output.value.slice(0, cursorPos);
    const right = this.output.value.slice(cursorPos);
    cursorPos += word.length + 1;
    this.output.value = `${left}${word + " " || ""}${right}`;
    this.output.setSelectionRange(cursorPos, cursorPos);
  }
}
