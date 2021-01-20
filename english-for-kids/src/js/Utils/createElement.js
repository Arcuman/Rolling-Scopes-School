export default function createElement(tag, classList) {
    const template = document.createElement(tag);
    template.classList.add(classList);
    return template;
}
