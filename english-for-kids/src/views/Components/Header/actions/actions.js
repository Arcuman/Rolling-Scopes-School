/* eslint-disable import/prefer-default-export */
import { CHANGE_MENU_VISIBILITY } from "../../../../js/redux/types";

export function changeMenuVisibility() {
    return {
        type: CHANGE_MENU_VISIBILITY,
    };
}
