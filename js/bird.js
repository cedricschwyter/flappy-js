

class Bird {
    constructor() {
        this.m_pos = createVector(width / 3, height / 2);
        this.m_vel = createVector(0, 0);
        this.m_textures = [];
        this.m_radius = 150;
    }

    get_pos() {
        return this.m_pos;
    }

    jump() {
        this.m_vel = createVector(0, -POWER);
    }

    check_bounds() {
		if(this.m_pos.y > height - this.m_radius && millis() - bounced > 5000) {
            this.m_pos = createVector(this.m_pos.x, height - this.m_radius);
            this.m_vel = createVector(0,0);
        }
        if(this.m_pos.y < this.m_radius) {
            this.m_pos = createVector(this.m_pos.x, this.m_radius);
            this.m_vel = createVector(0, -this.m_vel.y * BOUNCE);
        }
        if(this.m_pos.y > height - this.m_radius) {
            this.m_pos = createVector(this.m_pos.x, height - this.m_radius);
            this.m_vel = createVector(0, -this.m_vel.y * BOUNCE);
        }
		
		
    }

    update() {
        this.m_pos = this.m_pos.add(this.m_vel);
        this.m_vel = this.m_vel.add(createVector(0, 3));
        this.check_bounds();
		console.log(millis() - bounced);
    }

    draw() {
        fill(0);
        circle(this.m_pos.x, this.m_pos.y, 2 * this.m_radius);
    }
}