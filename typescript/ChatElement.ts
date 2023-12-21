export class ChatElement {
    public HTMLLIElement: HTMLLIElement = document.createElement("li");
    public name: string = "";
    constructor(_HTMLLIElement: HTMLLIElement, _name: string) {
        this.name = _name;
        this.HTMLLIElement = _HTMLLIElement;
    }
}