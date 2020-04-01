

class Tile {
    constructor(_index, isVisible = true) {
		this.m_isVisible = isVisible;
        this.m_index = _index;
        this.m_width = width / 4;
		this.m_height_t = random(height/6 , height - height/2 - bird.m_size);
		this.m_height_b = height - (height - this.m_height_t - height/2);
		this.m_offset = this.m_index * this.m_width;
		this.m_col = color(0, 0, 0);
		this.m_passed= false;
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
		if(this.m_isVisible){
			if(bird.m_pos.x - bird.m_size < this.m_offset + this.m_width / 4 && bird.m_pos.x + bird.m_size > this.m_offset){
				if(bird.m_pos.y + bird.m_size > this.m_height_b || bird.m_pos.y - bird.m_size < this.m_height_t){
					this.m_col = color(255, 0, 0);
					//setup();
				}else{
					this.m_col = color(0, 0, 0);
				}
			}else{
				this.m_col = color(0, 0, 0);
			}
		}
	}
	
	score(){
		if(this.m_isVisible && !this.m_passed){
			if(bird.m_pos.x - bird.m_size > this.m_offset + this.m_width / 4){
				score++;
				this.m_passed = true;
				console.log(score);
			}
		}
	}

    update() {
        this.m_offset -= SPEED;
		this.collision();
		this.score();
	}

    draw() {
		fill(this.m_col);
        stroke(5);
		if(this.m_isVisible == false){
			
		} else {
			rect(this.m_offset, 0, this.m_width / 4, this.m_height_t);
			rect(this.m_offset, this.m_height_b, this.m_width / 4, height - this.m_height_b);
		}
    }
}