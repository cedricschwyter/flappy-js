

class Tile {
    constructor(_index) {
        this.m_index = _index;
        this.m_offset = 0;
        this.m_width = width / 4;
		this.m_height = random(200,height - 300 - 200);
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
		if(this.m_index == -1){
			
		}else{
			rect(0 + this.m_offset,0 ,this.m_width - 200, this.m_height);
			rect(0 + this.m_offset,height - (height - this.m_height- 300) ,this.m_width -200,height - this.m_height - 300);
		}
    }
}