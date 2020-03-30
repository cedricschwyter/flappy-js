

class Tile {
    constructor(_index) {
        this.m_index = _index;
        this.m_offset = 0;
        this.m_width = width / 4;
    }

    get_index() {
        return this.m_index;
    }

    update() {
        this.m_offset = this.m_index * this.m_width + SPEED;
    }

    draw() {
        color(0);
        stroke(5);
        // TODO: draw rect
    }
}