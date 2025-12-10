// Mycelial Network - Organic Website Element
// Elegant organic growth with sophisticated color palette

let nodes = [];
let branches = [];
let signals = [];
let growthQueue = [];

// Sophisticated color palette for website integration
let palette = {
  background: [250, 250, 250, 0], // White transparent background
  fade: [250, 250, 250, 15], // Fade overlay to clear trails
  mainBranch: [139, 119, 101, 60], // Warm taupe/mushroom - ~23% opacity
  thinBranch: [168, 147, 129, 60], // Lighter tan - ~23% opacity
  node: [101, 89, 78, 60], // Deep earth brown - ~23% opacity
  signalCore: [218, 165, 32, 80], // Rich amber/gold - slightly more visible
  signalGlow: [238, 203, 123, 50], // Soft gold glow - more subtle
  signalTrail: [218, 165, 32, 60], // Amber trail - ~23% opacity
  accentGreen: [106, 129, 112], // Muted sage green (optional accent)
};

function setup() {
  let container = document.getElementById("mycelial-canvas");
  let canvas = createCanvas(windowWidth, container.offsetHeight);
  canvas.parent("mycelial-canvas");
  background(palette.background);

  // Start with a single spore on the left third of screen
  let root = new Node(width * 0.3, 80, 0);
  nodes.push(root);

  // Initialize growth from root with more branches
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i + random(-0.3, 0.3);
    growthQueue.push({
      parent: root,
      angle: angle,
      depth: 1,
      thickness: 4,
    });
  }
}

function draw() {
  // Subtle fade for trail effect - keeps the organic animation alive
  fill(palette.fade);
  noStroke();
  rect(0, 0, width, height);

  // Grow new branches (limited per frame for animation)
  for (let i = 0; i < 3 && growthQueue.length > 0; i++) {
    let growth = growthQueue.shift();
    growBranch(growth);
  }

  // Draw all branches with organic, elegant lines
  for (let branch of branches) {
    strokeWeight(branch.thickness);

    // Color varies by thickness - thicker branches are darker
    if (branch.thickness > 2) {
      stroke(
        palette.mainBranch[0],
        palette.mainBranch[1],
        palette.mainBranch[2],
        palette.mainBranch[3]
      );
    } else {
      stroke(
        palette.thinBranch[0],
        palette.thinBranch[1],
        palette.thinBranch[2],
        palette.thinBranch[3]
      );
    }

    // Subtle organic variation
    let x1 = branch.start.x + random(-0.2, 0.2);
    let y1 = branch.start.y + random(-0.2, 0.2);
    let x2 = branch.end.x + random(-0.2, 0.2);
    let y2 = branch.end.y + random(-0.2, 0.2);

    line(x1, y1, x2, y2);
  }

  // Update and draw signals
  for (let i = signals.length - 1; i >= 0; i--) {
    signals[i].update();
    signals[i].display();

    if (signals[i].finished) {
      signals.splice(i, 1);
    }
  }

  // Occasionally spawn new signals
  if (frameCount % 60 === 0 && nodes.length > 5) {
    let randomNode = random(nodes);
    signals.push(new Signal(randomNode));
  }

  // Draw nodes as organic connection points
  fill(palette.node[0], palette.node[1], palette.node[2], palette.node[3]);
  noStroke();
  for (let node of nodes) {
    let size = map(node.depth, 0, 10, 3.5, 1.2);
    ellipse(node.x, node.y, size);
  }
}

function growBranch(growth) {
  let maxDepth = 8; // Back to 8 for more tree-like growth
  if (growth.depth > maxDepth) return;

  // Calculate branch length with variation - moderate lengths
  let branchLength = map(growth.depth, 0, maxDepth, 90, 25);
  branchLength *= random(0.9, 1.4);

  // Add angular variation for organic feel
  let angle = growth.angle + random(-0.5, 0.5);

  // Bias angles toward horizontal (avoid steep vertical angles)
  // Normalize angle to -PI to PI range
  let normalizedAngle = ((angle % TWO_PI) + TWO_PI) % TWO_PI;
  if (normalizedAngle > PI) normalizedAngle -= TWO_PI;

  // If angle is too vertical (between -PI/4 and PI/4 or around PI), nudge it more horizontal
  if (abs(normalizedAngle) < PI / 6) {
    // Too vertical upward - push toward horizontal
    angle += random() > 0.5 ? PI / 4 : -PI / 4;
  } else if (
    abs(normalizedAngle - PI) < PI / 6 ||
    abs(normalizedAngle + PI) < PI / 6
  ) {
    // Too vertical downward - push toward horizontal
    angle += random() > 0.5 ? PI / 4 : -PI / 4;
  }

  // Calculate new position
  let newX = growth.parent.x + cos(angle) * branchLength;
  let newY = growth.parent.y + sin(angle) * branchLength;

  // Check boundaries
  if (newX < 20 || newX > width - 20 || newY < 10 || newY > height - 10) {
    return;
  }

  // Check for overcrowding only at shallow depths
  if (growth.depth < 4) {
    for (let node of nodes) {
      let d = dist(newX, newY, node.x, node.y);
      if (d < 30) {
        return; // Skip if too close in early growth
      }
    }
  }

  // Create new node
  let newNode = new Node(newX, newY, growth.depth);
  nodes.push(newNode);

  // Create branch connection
  let newThickness = growth.thickness * 0.8;
  branches.push({
    start: growth.parent,
    end: newNode,
    thickness: max(newThickness, 0.5),
  });

  // Add connection references
  growth.parent.connections.push(newNode);
  newNode.connections.push(growth.parent);

  // Emit event for new connection (for audio sonification)
  window.dispatchEvent(
    new CustomEvent("mycelial-connection", {
      detail: { x: newX, y: newY, depth: growth.depth },
    })
  );

  // Queue further growth - moderate branching
  let branchCount = random() > 0.4 ? 2 : 1;
  if (growth.depth < 3) branchCount = 2;

  for (let i = 0; i < branchCount; i++) {
    let branchAngle = angle + random(-PI / 3, PI / 3);
    growthQueue.push({
      parent: newNode,
      angle: branchAngle,
      depth: growth.depth + 1,
      thickness: newThickness,
    });
  }
}

class Node {
  constructor(x, y, depth) {
    this.x = x;
    this.y = y;
    this.depth = depth;
    this.connections = [];
  }
}

class Signal {
  constructor(startNode) {
    this.current = startNode;
    this.path = [startNode];
    this.position = createVector(startNode.x, startNode.y);
    this.targetIndex = 0;
    this.speed = 3;
    this.finished = false;
    this.trail = [];

    // Build a path through connected nodes
    this.buildPath(6); // Path length
  }

  buildPath(length) {
    let current = this.current;
    for (let i = 0; i < length; i++) {
      if (current.connections.length > 0) {
        let next = random(current.connections);
        // Avoid immediate backtracking
        if (this.path.length > 1 && next === this.path[this.path.length - 2]) {
          next = random(current.connections);
        }
        this.path.push(next);
        current = next;
      } else {
        break;
      }
    }
  }

  update() {
    if (this.targetIndex >= this.path.length - 1) {
      this.finished = true;
      return;
    }

    let target = this.path[this.targetIndex + 1];
    let targetPos = createVector(target.x, target.y);
    let direction = p5.Vector.sub(targetPos, this.position);

    if (direction.mag() < this.speed) {
      this.targetIndex++;
      this.position.set(targetPos);

      // Emit event when signal reaches a node (for audio sonification)
      window.dispatchEvent(
        new CustomEvent("mycelial-signal", {
          detail: { x: this.position.x, y: this.position.y },
        })
      );
    } else {
      direction.setMag(this.speed);
      this.position.add(direction);
    }

    // Store trail positions
    this.trail.push(this.position.copy());
    if (this.trail.length > 15) {
      this.trail.shift();
    }
  }

  display() {
    // Draw elegant trail with amber glow
    noFill();
    for (let i = 0; i < this.trail.length - 1; i++) {
      let alpha = map(i, 0, this.trail.length, 0, 180);
      stroke(
        palette.signalCore[0],
        palette.signalCore[1],
        palette.signalCore[2],
        alpha
      );
      strokeWeight(1.5);
      line(
        this.trail[i].x,
        this.trail[i].y,
        this.trail[i + 1].x,
        this.trail[i + 1].y
      );
    }

    // Draw signal point with soft golden glow
    fill(
      palette.signalCore[0],
      palette.signalCore[1],
      palette.signalCore[2],
      palette.signalCore[3]
    );
    noStroke();
    ellipse(this.position.x, this.position.y, 5);

    // Soft outer glow - larger and more diffuse
    fill(
      palette.signalGlow[0],
      palette.signalGlow[1],
      palette.signalGlow[2],
      palette.signalGlow[3]
    );
    ellipse(this.position.x, this.position.y, 12);

    // Even softer halo
    fill(
      palette.signalGlow[0],
      palette.signalGlow[1],
      palette.signalGlow[2],
      20
    );
    ellipse(this.position.x, this.position.y, 20);
  }
}

function windowResized() {
  let container = document.getElementById("mycelial-canvas");
  resizeCanvas(windowWidth, container.offsetHeight);
  // Clear and restart the network when window resizes significantly
  nodes = [];
  branches = [];
  signals = [];
  growthQueue = [];

  background(palette.background);

  // Recreate root node on left third
  let root = new Node(width * 0.3, 80, 0);
  nodes.push(root);

  // Initialize growth from root
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i + random(-0.3, 0.3);
    growthQueue.push({
      parent: root,
      angle: angle,
      depth: 1,
      thickness: 4,
    });
  }
}

function mousePressed() {
  // Click to send a signal burst from nearest node
  let nearest = nodes[0];
  let minDist = dist(mouseX, mouseY, nearest.x, nearest.y);

  for (let node of nodes) {
    let d = dist(mouseX, mouseY, node.x, node.y);
    if (d < minDist) {
      minDist = d;
      nearest = node;
    }
  }

  // Spawn multiple signals
  for (let i = 0; i < 5; i++) {
    signals.push(new Signal(nearest));
  }
}
