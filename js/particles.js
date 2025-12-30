const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let particlesArray;

// Resize Canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
}

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Create Particle Class
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    // Method to draw individual particle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = '#569cd6'; // Accent Blue
        ctx.fill();
    }

    // Check particle position, check mouse position, move the particle, draw the particle
    update() {
        // Check if particle is still within canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Check collision detection - mouse position / particle position
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;

        // Draw particle
        this.draw();
    }
}

// Create particle array
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1; // Random size between 1 and 3
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2; // Slow random speed
        let directionY = (Math.random() * 0.4) - 0.2;
        // Fetch color from CSS variable for consistency
        const styles = getComputedStyle(document.body);
        let color = styles.getPropertyValue('--accent-blue').trim() || '#569cd6';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Check if particles are close enough to draw line between them
function connect() {
    let opacityValue = 1;
    const styles = getComputedStyle(document.body);
    const accentColor = styles.getPropertyValue('--accent-blue').trim() || '#569cd6';

    // Convert hex to rgb for opacity manipulation if needed, 
    // but here we just leave it as is or hardcode the rgb base if we want simple opacity.
    // For simplicity and performance in this specific "polish" step, 
    // sticking to a fixed rgba helper or just hardcoding the rgb base matching the theme is safer 
    // unless we write a hexToRgb helper. 
    // The previous code used 'rgba(86, 156, 214, ...)' which matches #569cd6.
    // Let's keep the dynamic fetch but strict to the known theme for now to avoid complex parsing logic in a simple portfolio script.
    // Actually, let's just stick to the previous hardcoded RGB for the lines to ensure alpha works correctly without a parser function,
    // but updated comment to reflect why.

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));

            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(86, 156, 214, ' + opacityValue * 0.15 + ')'; // Use brand accent color with low opacity
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

// Resize event
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
    init();
});

// Mouse out event
window.addEventListener('mouseout', () => {
    mouse.x = undefined;
    mouse.y = undefined;
});

init();
animate();
