function createHtml(html: string) {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.childNodes[0];
}