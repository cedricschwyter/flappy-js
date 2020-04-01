

class Tile {
    constructor(_index, isVisible = true) {
		this.m_isVisible = isVisible;
        this.m_index = _index;
        this.m_width = width / 4;
		this.m_height = random(height/4 , height - height/2 - bird.m_size);
		this.m_offset = this.m_index * this.m_width;
		this.m_col = color(0, 0, 0);
    }

    get_index() {
        return this.m_index;
    }
	
	get_outofbounds() {
		if(this.m_offset + this.m_width < -this.m_width){
			return true;
		} else {
			return false;
		}
    }

	collision() {
		if(bird.m_pos.x - bird.m_size < this.m_offset + this.m_width / 4 && bird.m_pos.x + bird.m_size > this.m_offset)
			if(bird.m_pos.y + bird.m_size > height - (height - this.m_height - height/4) || bird.m_pos.y - bird.m_size < this.m_height)
				this.m_col = color(255, 0, 0);
			else
				this.m_col = color(0, 0, 0);
		else
			this.m_col = color(0, 0, 0);
	}

    update() {
        this.m_offset -= SPEED;
		this.collision();
	}

    draw() {
		fill(this.m_col);
        stroke(5);
		if(this.m_isVisible == false){
			
		} else {
			rect(this.m_offset, 0, this.m_width / 4, this.m_height);
			rect(this.m_offset, height - (height - this.m_height - height/4), this.m_width / 4, height - this.m_height - height/4);
		}
    }
}