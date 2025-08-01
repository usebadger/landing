const achievements = [
  { emoji: "🛒", text: "First Purchase", color: "primary" },
  { emoji: "⚡", text: "Power User", color: "secondary" },
  { emoji: "🦡", text: "Badger", color: "tertiary" },
  { emoji: "🔥", text: "Streak Master", color: "primary" },
  { emoji: "🌟", text: "Early Adopter", color: "secondary" },
  { emoji: "💎", text: "Premium Member", color: "tertiary" },
  { emoji: "🎯", text: "Goal Crusher", color: "primary" },
  { emoji: "🤝", text: "Team Player", color: "secondary" },
  { emoji: "🚀", text: "Rising Star", color: "tertiary" },
  // { emoji: "🏆", text: "7-Day Streak", color: "primary" },
];

const list = document.getElementById("achievements-list");
const maxVisible = 4;
const achievementsInterval = 3000;

function addAchievement(achievement) {
  const newItem = document.createElement("li");
  newItem.className = `achievement-item bg-${achievement.color} text-${achievement.color}-against px-4 py-2 rounded-md flex gap-2 items-center shadow-lg`;
  newItem.innerHTML = `<span class="text-2xl">${achievement.emoji}</span><span>${achievement.text}</span>`;
  // Remove any duplicates of this new item
  const items = list.querySelectorAll(".achievement-item");
  for (let i = 0; i < items.length; i++) {
    if (items[i].textContent === newItem.textContent) {
      items[i].remove();
    }
  }
  list.appendChild(newItem);
}

function cycleAchievements() {
  // Immediately jump the list up (no transition)
  list.classList.add("slide-up");

  // Move the last item to the beginning
  const lastItem = list.lastElementChild;
  lastItem.remove();
  lastItem.classList.add("slide-in");
  list.insertBefore(lastItem, list.firstChild);

  setTimeout(() => {
    list.classList.remove("slide-up");
    lastItem.classList.remove("slide-in");
  }, 50);

  const randomOffset = Math.floor(Math.random() * (achievementsInterval / 2));
  const interval = achievementsInterval / 2 + randomOffset;

  setTimeout(() => {
    cycleAchievements();
  }, interval);
}

setTimeout(cycleAchievements, achievementsInterval);

for (let i = 0; i < achievements.length; i++) {
  addAchievement(achievements[i]);
}

// Streak Demo Functionality
const streakCount = document.getElementById("streak-count");
const streakSubtitle = document.getElementById("streak-subtitle");
const calendarGrid = document.getElementById("calendar-grid");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");

let currentStreak = 2;
const maxStreak = 14;
const resetStreak = 3;
let initialInterval = 2000;
let currentInterval = initialInterval;

const motivationalSubtitles = [
  "Keep it up!",
  "You're on a roll!",
  "Amazing progress!",
  "You're unstoppable!",
  "Incredible dedication!",
  "You're a legend!",
];

function generateCalendar() {
  calendarGrid.innerHTML = "";

  // Generate 28 calendar days (4 rows of 7 days, with some empty slots)
  for (let i = 0; i < maxStreak; i++) {
    const dayElement = document.createElement("div");
    dayElement.className =
      "w-6 h-6 rounded text-xs flex items-center justify-center";

    if (i < maxStreak) {
      dayElement.textContent = i + 1;
      if (i < currentStreak) {
        dayElement.className += " bg-primary text-primary-against";
      } else {
        dayElement.className += " bg-gray-300 text-gray-600";
      }
    } else {
      dayElement.className += " bg-transparent";
    }

    calendarGrid.appendChild(dayElement);
  }
}

function updateStreak() {
  // Update streak count
  streakCount.textContent = `${currentStreak} day streak`;

  // Update subtitle every 5 days
  const subtitleIndex = Math.floor((currentStreak - 1) / 5);
  if (currentStreak === 0) {
    streakSubtitle.textContent = "Start your streak";
  } else if (subtitleIndex < motivationalSubtitles.length) {
    streakSubtitle.textContent = motivationalSubtitles[subtitleIndex];
  }

  // Update progress
  const progressPercentage = (currentStreak / maxStreak) * 100;
  progressText.textContent = `${currentStreak}/${maxStreak}`;
  progressBar.style.width = `${progressPercentage}%`;

  // Update calendar
  generateCalendar();

  if (currentStreak > 0 && currentStreak % 7 === 0) {
    addAchievement({
      emoji: "🏆",
      text: `${currentStreak} Day Streak`,
      color: "primary",
    });
  }
}

function incrementStreak() {
  if (currentStreak <= maxStreak) {
    if (Math.random() < 0.05) {
      currentStreak = 0;
      currentInterval = initialInterval;
    }
    updateStreak();
  } else if (currentStreak >= maxStreak + resetStreak) {
    currentStreak = 0;
    currentInterval = initialInterval;
  }
  currentStreak++;

  currentInterval = currentInterval * 0.9;
  setTimeout(incrementStreak, currentInterval);
}

// Initialize the streak demo
generateCalendar();

setTimeout(incrementStreak, initialInterval);

const demoSteps = [
  {
    title: "Emit events from your app",
    description:
      "When a user does something in your app, send an event to Badger",
    note: "📊 We keep track of stats and progress for you",
    example: `const badger = new BadgerClient({
  appId,
  appSecret
});

badger.events.sendEvent({
  event: "purchase_made",
  userId: "456",
  metadata: {
    productId: "123",
  }
});`,
  },
  {
    title: "Create a badge",
    description: "Specify an event and criteria",
    note: "",
    example: `<img src="/create-badge-preview.webp" alt="Badge creation interface" class="w-full rounded-lg shadow-lg object-contain" loading="lazy" />`,
  },
  {
    title: "Earn badges!",
    description: "Get notified instantly when a user earns a badge",
    note: "",
    example: `server.post("/webhook", (req, res) => {
  if (req.body.type === "user.badge.unlocked") {
    console.log(
      "New badge unlocked:",
      req.body.data.userId,
      req.body.data.badge
    );
  }
});`,
  },
  {
    title: "View badges",
    description: "Easily fetch a user's badges",
    note: "👀 You can view all badges in the dashboard",
    example: `const { badges } = await badger.users.getUserBadges("456");`,
  },
];

// Setup Carousel Functionality
const carouselTrack = document.getElementById("carousel-track");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const carouselDots = document.getElementById("carousel-dots");

let currentSlide = 0;

function createCarouselSlides() {
  carouselTrack.innerHTML = "";
  carouselDots.innerHTML = "";

  demoSteps.forEach((step, index) => {
    // Create slide
    const slide = document.createElement("div");
    slide.className = "carousel-slide w-full px-4";
    slide.innerHTML = `
      <div class="text-center space-y-3 w-full">
        <h4 class="text-lg font-semibold text-fg">${step.title}</h4>
        <p class="text-muted text-sm">${step.description}</p>
        <div class="code-block text-green-400 ${
          step.example.includes("<img") ? "p-0" : "p-3 bg-gray-900"
        } rounded text-xs font-mono text-left overflow-x-auto w-full">
        <pre><code>${step.example}</code></pre>
        </div>
        ${
          step.note
            ? `<p class="text-xs text-muted italic">${step.note}</p>`
            : ""
        }
      </div>
    `;
    carouselTrack.appendChild(slide);

    // Create dot
    const dot = document.createElement("button");
    dot.className = `w-3 h-3 rounded-full transition-all ${
      index === 0 ? "bg-primary" : "bg-gray-300"
    }`;
    dot.addEventListener("click", () => goToSlide(index));
    carouselDots.appendChild(dot);
  });
}

function updateCarousel() {
  const slideWidth = 33.333;
  carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

  // Update dots
  const dots = carouselDots.querySelectorAll("button");
  dots.forEach((dot, index) => {
    dot.className = `w-3 h-3 rounded-full transition-all ${
      index === currentSlide ? "bg-primary" : "bg-gray-300"
    }`;
  });

  // Update button states
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === demoSteps.length - 1;

  prevBtn.style.opacity = currentSlide === 0 ? "0.5" : "1";
  nextBtn.style.opacity = currentSlide === demoSteps.length - 1 ? "0.5" : "1";
}

function goToSlide(index) {
  currentSlide = index;
  updateCarousel();
}

function nextSlide() {
  if (currentSlide < demoSteps.length - 1) {
    currentSlide++;
    updateCarousel();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    updateCarousel();
  }
}

// Event listeners
prevBtn.addEventListener("click", prevSlide);
nextBtn.addEventListener("click", nextSlide);

// Initialize carousel
createCarouselSlides();
updateCarousel();

// Milestone Tracker Functionality
const milestoneTitle = document.getElementById("milestone-title");
const milestoneSubtitle = document.getElementById("milestone-subtitle");
const locCounter = document.getElementById("loc-counter");
const milestoneTarget = document.getElementById("milestone-target");
const milestoneProgress = document.getElementById("milestone-progress");
const milestoneProgressBar = document.getElementById("milestone-progress-bar");

let currentLOC = 0;
const milestones = [
  { target: 0, text: "Start coding", subtitle: "Start your journey!" },
  { target: 1000, text: "Write 1k LOC", subtitle: "Getting started!" },
  { target: 10000, text: "Write 10k LOC", subtitle: "You're on fire!" },
  { target: 20000, text: "Write 20k LOC", subtitle: "Code machine!" },
  { target: 50000, text: "Write 50k LOC", subtitle: "Legendary coder!" },
  { target: 100000, text: "Write 100k LOC", subtitle: "Unstoppable!" },
];

let currentMilestoneIndex = 0;
let locIncrementInterval = 100;
let currentIncrement = 0;

function formatNumber(num) {
  if (num >= 1000000) {
    let formatted = (num / 1000000).toFixed(1);
    if (formatted.endsWith(".0")) {
      formatted = formatted.slice(0, -2);
    }
    return formatted + "M";
  } else if (num >= 1000) {
    let formatted = (num / 1000).toFixed(1);
    if (formatted.endsWith(".0")) {
      formatted = formatted.slice(0, -2);
    }
    return formatted + "k";
  }
  return num.toString();
}

function updateMilestoneTracker() {
  const currentMilestone = milestones[currentMilestoneIndex];
  const nextMilestone = milestones[currentMilestoneIndex + 1];

  // Update counter with animation
  locCounter.textContent = formatNumber(currentLOC);

  // Update target and progress
  if (nextMilestone) {
    milestoneTarget.textContent = nextMilestone.text;

    // Calculate progress percentage
    const progressPercentage = Math.min(
      (currentLOC / milestones[milestones.length - 1].target) * 100,
      100
    );
    milestoneProgressBar.style.width = `${progressPercentage}%`;

    // Update subtitle
  } else {
    // At max milestone
    milestoneTarget.textContent = "Max milestone reached!";
    milestoneProgressBar.style.width = "100%";
  }

  // Check if we should advance to next milestone
  if (nextMilestone && currentLOC >= nextMilestone.target) {
    currentMilestoneIndex++;

    // Add achievement for milestone
    addAchievement({
      emoji: "💻",
      text: `${formatNumber(nextMilestone.target)} LOC!`,
      color: "primary",
    });

    // Update immediately
    updateMilestoneTracker();
  }
}

function incrementLOC() {
  // Random increment between 1 and 50 lines
  const increment = Math.floor(Math.random() * 50) + 1;
  currentLOC += increment;

  // Slow down as we get higher
  // if (currentLOC > 10000) {
  //   locIncrementInterval = Math.max(3000, locIncrementInterval * 1.01);
  // } else if (currentLOC > 50000) {
  //   locIncrementInterval = Math.max(5000, locIncrementInterval * 1.02);
  // }

  updateMilestoneTracker();

  if (currentLOC >= 100000) {
    return;
  }

  // Schedule next increment
  setTimeout(incrementLOC, locIncrementInterval);
}

// Initialize milestone tracker
updateMilestoneTracker();

// Start the LOC counter
setTimeout(incrementLOC, locIncrementInterval);

document.querySelectorAll("a").forEach((a) => {
  if (a.host !== window.location.host && !a.getAttribute("data-umami-event")) {
    a.setAttribute("data-umami-event", "link-click");
    a.setAttribute("data-umami-event-url", a.href);
  }
});
