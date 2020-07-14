class Card {
    static instance = null;
    constructor({ position, name, spacing }) {
        if (Card.instance) {
            Card.instance.destroy();
        }
        Card.instance = this;
        this.positioning = {
            position,
            placing: "top",
        };
        this.name = name;
        this.spacing = spacing || 0;

        this.node = document.createElement("div");
        this.node.classList.add("tw-card", "hidden");

        const body = document.createElement("div");
        body.classList.add("tw-card-body");
        const img = document.createElement("img");
        img.src = "/common/avatar.png";
        const handle = document.createElement("span");
        handle.textContent = name;
        const extra = document.createElement("div");
        extra.textContent = "Extra data";
        body.append(img, handle, extra);
        this.node.append(body);
    }

    getElement() {
        return this.node;
    }

    unhide() {
        this.node.classList.remove("hidden");
    }

    show() {
        this.setCoordinates(-1000, -1000);
        document.body.append(this.node);
        this.setPosition(this.positioning.placing, this.positioning.position);
        this.node.classList.remove("hidden");
    }

    setPosition(placing, x, y) {
        let position;
        if (y === undefined) {
            position = x;
        } else {
            position = {
                x,
                y,
            };
        }

        switch (placing) {
            case "top":
                this.node.style.removeProperty("right");
                this.node.style.removeProperty("bottom");
                this.node.style.setProperty("left", (position.x - this.node.clientWidth / 2) + "px");
                this.node.style.setProperty("top", position.y - this.node.clientHeight + "px");
                break;
        }
    }

    setCoordinates(x, y) {
        let position;
        if (y === undefined) {
            position = x;
        } else {
            position = {
                x,
                y,
            };
        }
        this.node.style.setProperty("left", position.x);
        this.node.style.setProperty("top", position.y);
    }

    destroy() {
        if (this.node) {
            this.node.remove();
        }
        Card.instance = null;
    }
}