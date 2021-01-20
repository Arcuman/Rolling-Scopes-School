// eslint-disable-next-line import/prefer-default-export
import { SET_CARDS } from "../../../../../js/redux/types";

// eslint-disable-next-line import/prefer-default-export
export function setCards(cards) {
    return {
        type: SET_CARDS,
        cards,
    };
}
