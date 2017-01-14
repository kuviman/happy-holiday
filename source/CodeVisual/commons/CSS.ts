const customStyleSheet: any = function () {
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    return style.sheet;
}();

function addCssRule(selector: string, rule: string) {
    if ("insertRule" in customStyleSheet) {
        customStyleSheet.insertRule(selector + "{" + rule + "}", 0);
    }
    else if ("addRule" in customStyleSheet) {
        customStyleSheet.addRule(selector, rule, 0);
    }
}