const menuButton = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const revealItems = document.querySelectorAll(".reveal");
const caseItems = document.querySelectorAll(".case-item");
const previewImage = document.getElementById("previewImage");
const previewMeta = document.getElementById("previewMeta");
const previewTitle = document.getElementById("previewTitle");
const previewDescription = document.getElementById("previewDescription");
const casePreview = document.getElementById("casePreview");
const casePreviewCopy = document.querySelector(".case-preview-copy");
const heroLineTwo = document.querySelector(".hero .line2");
const hero = document.querySelector(".hero");
const heroVideo = document.querySelector(".hero-video");
const scrollProgress = document.getElementById("scrollProgress");
const galleryBillboard = document.getElementById("galleryBillboard");
const mainPhotoCurrent = document.getElementById("mainPhotoCurrent");
const mainPhotoNext = document.getElementById("mainPhotoNext");
const dualBillboard = document.getElementById("dualBillboard");
const dualPhotoLeft = document.getElementById("dualPhotoLeft");
const dualPhotoRight = document.getElementById("dualPhotoRight");
const mainPhotoCaption = document.querySelector(".main-photo-caption");
const captionMotionLines = Array.from(document.querySelectorAll(".caption-motion-text .motion-line:not(.billboard-dynamic)"));

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

if (heroLineTwo) {
  const lineTwoPalette = [
    "#4b8fcb", // blue
    "#64a8e2", // light blue
    "#3f79b3", // deep blue
    "#63b88b", // green
    "#84cf9d", // mint green
    "#d8b65a", // gold
    "#f0cf70", // warm gold
    "#d59c53", // amber / brown
    "#a26f43", // brown
    "#e2b56a", // tan gold
    "#e27a46", // orange
    "#d95d4f", // red
    "#f1d26f" // yellow
  ];

  let lastLineTwoColor = "";
  let lineTwoTimer = null;

  const pickNextLineTwoColor = () => {
    const pool = lineTwoPalette.filter((color) => color !== lastLineTwoColor);
    return pool[Math.floor(Math.random() * pool.length)] || lineTwoPalette[0];
  };

  const applyLineTwoColor = () => {
    const nextColor = pickNextLineTwoColor();
    lastLineTwoColor = nextColor;
    heroLineTwo.style.setProperty("--hero-line2-color", nextColor);
  };

  // Trigger the noticeable shift right as the line comes back from fade-out.
  const queueLineTwoColorShift = () => {
    if (lineTwoTimer) window.clearTimeout(lineTwoTimer);
    lineTwoTimer = window.setTimeout(applyLineTwoColor, 1700);
  };

  applyLineTwoColor();
  queueLineTwoColorShift();

  heroLineTwo.addEventListener("animationiteration", (event) => {
    if (event.animationName !== "heroTitleRevealB") return;
    queueLineTwoColorShift();
  });
}

if (menuButton && navLinks) {
  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
  };

  menuButton.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("open")) return;
    if (event.target === menuButton || menuButton.contains(event.target)) return;
    if (navLinks.contains(event.target)) return;
    closeMenu();
  });
}

const navAnchors = Array.from(document.querySelectorAll("#navLinks a[href^='#']"));
const sectionMap = new Map(
  navAnchors
    .map((anchor) => {
      const href = anchor.getAttribute("href");
      if (!href) return null;
      return [anchor, document.querySelector(href)];
    })
    .filter((entry) => entry && entry[1])
);

const setActiveNavLink = (targetId) => {
  navAnchors.forEach((anchor) => {
    const isMatch = anchor.getAttribute("href") === `#${targetId}`;
    anchor.classList.toggle("is-active", isMatch);
    if (isMatch) {
      anchor.setAttribute("aria-current", "page");
    } else {
      anchor.removeAttribute("aria-current");
    }
  });
};

if (sectionMap.size) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible.length) {
        setActiveNavLink(visible[0].target.id);
      }
    },
    {
      root: null,
      threshold: [0.35, 0.55, 0.75],
      rootMargin: "-20% 0px -55% 0px"
    }
  );

  sectionMap.forEach((section) => navObserver.observe(section));

  const initialHash = window.location.hash ? window.location.hash.slice(1) : "";
  if (initialHash) {
    setActiveNavLink(initialHash);
  } else {
    setActiveNavLink("home");
  }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const hash = link.getAttribute("href");
    if (!hash || hash === "#") return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();
    const topbar = document.querySelector(".topbar");
    const offset = topbar ? topbar.getBoundingClientRect().height + 24 : 0;
    const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - offset);
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", hash);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

revealItems.forEach((item, index) => {
  const delay = Math.min(index * 60, 240);
  item.style.transitionDelay = `${delay}ms`;
});

const setActiveCase = (item) => {
  caseItems.forEach((caseItem) => caseItem.classList.remove("is-active"));
  item.classList.add("is-active");

  const image = item.dataset.image;
  const meta = item.dataset.meta;
  const description = item.dataset.description;
  const title = item.textContent.trim();
  const accent = item.dataset.accent || "#9af6d8";

  if (previewImage) {
    previewImage.style.opacity = "0";
    window.setTimeout(() => {
      previewImage.src = image;
      previewImage.alt = `${title} preview image`;
      previewImage.style.opacity = "1";
    }, 140);
  }

  if (previewMeta) previewMeta.textContent = meta;
  if (previewTitle) previewTitle.textContent = title;
  if (previewDescription) previewDescription.textContent = description;

  if (casePreviewCopy) {
    const motionClasses = ["motion-rise", "motion-slide", "motion-float", "motion-zoom"];
    casePreviewCopy.classList.remove(...motionClasses);
    void casePreviewCopy.offsetWidth;
    casePreviewCopy.classList.add(motionClasses[Math.floor(Math.random() * motionClasses.length)]);
  }

  document.body.style.setProperty("--accent", accent);
};

caseItems.forEach((item) => {
  item.addEventListener("mouseenter", () => setActiveCase(item));
  item.addEventListener("focus", () => setActiveCase(item));
});

if (hero && heroVideo) {
  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroVideo.style.transform = `scale(1.08) translate(${x * -12}px, ${y * -10}px)`;
  });
}

if (casePreview) {
  casePreview.addEventListener("mousemove", (event) => {
    const rect = casePreview.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
    casePreview.style.setProperty("--tilt-x", `${x}deg`);
    casePreview.style.setProperty("--tilt-y", `${y}deg`);
  });

  casePreview.addEventListener("mouseleave", () => {
    casePreview.style.setProperty("--tilt-x", "0deg");
    casePreview.style.setProperty("--tilt-y", "0deg");
  });
}

const updateScrollProgress = () => {
  if (!scrollProgress) return;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
  scrollProgress.style.width = `${Math.max(0, Math.min(100, pct))}%`;
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

if (galleryBillboard && mainPhotoCurrent && mainPhotoNext) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canUseEnhancedMotion = () => !reducedMotion && window.innerWidth > 700;
  const photos = [
    "assets/gallery/gallery-1.jpg",
    "assets/gallery/gallery-2.jpg",
    "assets/gallery/gallery-3.jpg",
    "assets/gallery/gallery-4.jpg",
    "assets/gallery/gallery-5.jpg",
    "assets/gallery/gallery-6.jpg",
    "assets/gallery/gallery-7.jpg",
    "assets/gallery/gallery-8.jpg"
  ];

  const motionPairs = [
    { inFx: "fx-zoom-in", outFx: "out-fade" },
    { inFx: "fx-zoom-out", outFx: "out-fade" },
    { inFx: "fx-slide-left", outFx: "out-slide" },
    { inFx: "fx-slide-right", outFx: "out-slide" },
    { inFx: "fx-scroll-up", outFx: "out-slide" },
    { inFx: "fx-scroll-down", outFx: "out-slide" },
    { inFx: "fx-fly-in", outFx: "out-fly" }
  ];

  const dualMotions = ["split-slide", "split-zoom", "split-fly", "split-scroll"];
  const captionShiftClasses = ["caption-shift-a", "caption-shift-b", "caption-shift-c"];
  const billboardNodes = Array.from(document.querySelectorAll(".billboard-dynamic"));
  const billboardPhrases = [
    "Knotless Braids",
    "Boho Braids",
    "Feed-In Cornrows",
    "Fulani Braids",
    "Passion Twists",
    "Senegalese Twists",
    "Kids Braids",
    "Stitch Braids",
    "Natural Hair Prep",
    "Legacy African Hair Braiding",
    "Innovative Styles, Old and New",
    "Women, Men, and Kids",
    "Book: (804) 605-6115",
    "Twist Styles"
  ];
  const flyInClasses = [
    "billboard-fly-in-top",
    "billboard-fly-in-bottom",
    "billboard-fly-in-left",
    "billboard-fly-in-right"
  ];
  const flyOutClasses = [
    "billboard-fly-out-bottom",
    "billboard-fly-out-top",
    "billboard-fly-out-right",
    "billboard-fly-out-left"
  ];
  const billboardSizeClasses = ["size-xl", "size-lg", "size-md", "size-sm"];
  const billboardFontClasses = ["font-grotesk", "font-sans", "font-serif"];
  const billboardPositions = [
    { x: 14, y: 16 },
    { x: 32, y: 24 },
    { x: 54, y: 18 },
    { x: 70, y: 26 },
    { x: 18, y: 42 },
    { x: 42, y: 48 },
    { x: 64, y: 44 },
    { x: 24, y: 66 },
    { x: 48, y: 70 },
    { x: 66, y: 64 }
  ];
  const captionVocabulary = [
    // User-requested billboard texts
    "Hair Styling",
    "Braiding hair for women, men, and kids with innovative styles, old and new.",
    "Over 20 Years: Legacy African Hair Braiding has served customers for over 20 years.",
    "Book by Phone: Call (804) 605-6115 to book an appointment. With great intentions of being noticed, none should be static—just like a billboard."
  ];

  let currentImgEl = mainPhotoCurrent;
  let incomingImgEl = mainPhotoNext;
  let currentIndex = 0;
  let recentIndices = [0];
  let previousMotionIndex = -1;
  let timerId = null;
  let isTransitioning = false;
  let billboardPhraseBag = [];

  const randomInRange = (min, max) => min + Math.random() * (max - min);
  const randInt = (min, max) => Math.floor(randomInRange(min, max + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (arr) => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const nextBillboardPhrase = () => {
    if (!billboardPhraseBag.length) {
      billboardPhraseBag = shuffle([...billboardPhrases]);
    }
    return billboardPhraseBag.pop();
  };

  const placeBillboardInBounds = (node, container, xPct, yPct) => {
    if (!node || !container) return;

    const safePad = 24;
    const cW = container.clientWidth;
    const cH = container.clientHeight;

    const nW = node.offsetWidth;
    const nH = node.offsetHeight;

    const xRaw = (xPct / 100) * cW;
    const yRaw = (yPct / 100) * cH;

    const minX = safePad;
    const maxX = Math.max(safePad, cW - nW - safePad);
    const minY = safePad;
    const maxY = Math.max(safePad, cH - nH - safePad);

    const leftPx = Math.min(maxX, Math.max(minX, xRaw));
    const topPx = Math.min(maxY, Math.max(minY, yRaw));

    node.style.left = `${leftPx}px`;
    node.style.top = `${topPx}px`;
  };

  const getBillboardCount = () => {
    if (!canUseEnhancedMotion()) return 1;
    const roll = Math.random();
    if (roll < 0.56) return 1;
    if (roll < 0.88) return 2;
    return 3;
  };

  const updateCaptionMotion = (dualMode) => {
    if (mainPhotoCaption) {
      mainPhotoCaption.classList.remove(...captionShiftClasses);
      mainPhotoCaption.classList.add(pick(captionShiftClasses));
    }

    if (!captionMotionLines.length) return;
    // Always use the four user-requested lines, one per .motion-line
    captionMotionLines.forEach((line, idx) => {
      // Cycle through the four lines, wrap if more lines exist
      const phrases = [
        "Hair Styling",
        "Braiding hair for women, men, and kids with innovative styles, old and new.",
        "Over 20 Years: Legacy African Hair Braiding has served customers for over 20 years.",
        "Book by Phone: Call (804) 605-6115 to book an appointment. With great intentions of being noticed, none should be static—just like a billboard."
      ];
      line.textContent = phrases[idx % phrases.length];
      if (!reducedMotion) {
        // Animate each line with a different effect
        const anims = ["textZoomFlow", "textSlideFlow", "textScrollFlow", "textFadeFlow"];
        line.style.animationName = anims[idx % anims.length];
        line.style.animationDuration = "8s";
        line.style.animationDelay = `${idx * 2}s`;
      }
    });
  };

  const updateBillboardCloud = () => {
    if (!billboardNodes.length) return;

    const container = billboardNodes[0].parentElement;
    if (!container) return;

    const positionPool = shuffle(billboardPositions);
    const sizePool = shuffle(billboardSizeClasses);
    const nodePool = shuffle(billboardNodes);
    const activeCount = Math.min(getBillboardCount(), nodePool.length);
    const activeNodes = new Set(nodePool.slice(0, activeCount));

    billboardNodes.forEach((node, idx) => {
      const sizeClass = sizePool[idx % sizePool.length];
      const fontClass = pick(billboardFontClasses);
      const inClass = pick(flyInClasses);
      const outClass = pick(flyOutClasses);
      const pos = positionPool[idx % positionPool.length];
      const jitterX = randomInRange(-5, 5);
      const jitterY = randomInRange(-4, 4);

      node.classList.remove(
        ...flyInClasses,
        ...flyOutClasses,
        ...billboardSizeClasses,
        ...billboardFontClasses
      );
      node.style.transitionDelay = `${randInt(0, 180)}ms`;

      if (!activeNodes.has(node)) {
        if (!reducedMotion) node.classList.add(outClass);
        node.style.opacity = 0;
        return;
      }

      node.textContent = nextBillboardPhrase();
      const xPct = Math.max(8, Math.min(86, pos.x + jitterX));
      const yPct = Math.max(10, Math.min(82, pos.y + jitterY));
      node.style.right = "auto";
      node.style.bottom = "auto";
      node.style.left = "0px";
      node.style.top = "0px";

      void node.offsetWidth;
      if (!reducedMotion) node.classList.add(inClass);
      node.classList.add(sizeClass, fontClass);
      node.style.opacity = 1;

      window.requestAnimationFrame(() => placeBillboardInBounds(node, container, xPct, yPct));
    });
  };

  const rememberIndex = (idx) => {
    recentIndices.push(idx);
    if (recentIndices.length > 4) recentIndices.shift();
  };

  const getDistinctIndex = (...blocked) => {
    const hardBlocked = new Set([...blocked, ...recentIndices]);
    const pool = photos
      .map((_, idx) => idx)
      .filter((idx) => !hardBlocked.has(idx));

    if (pool.length) {
      return pool[Math.floor(Math.random() * pool.length)];
    }

    const softPool = photos
      .map((_, idx) => idx)
      .filter((idx) => !blocked.includes(idx));

    return softPool[Math.floor(Math.random() * softPool.length)];
  };

  const getNextIndex = () => {
    return getDistinctIndex(currentIndex);
  };

  const getMotionPair = () => {
    let idx = previousMotionIndex;
    while (idx === previousMotionIndex) {
      idx = Math.floor(Math.random() * motionPairs.length);
    }
    previousMotionIndex = idx;
    return motionPairs[idx];
  };

  const scheduleNextSwap = () => {
    if (timerId) window.clearTimeout(timerId);
    const wait = canUseEnhancedMotion() ? randomInRange(1300, 2100) : randomInRange(1800, 2800);
    timerId = window.setTimeout(runSwap, wait);
  };

  function runSwap() {
    if (isTransitioning) return;
    isTransitioning = true;

    updateBillboardCloud();

    const dualMode = Boolean(
      canUseEnhancedMotion() &&
      dualBillboard &&
      dualPhotoLeft &&
      dualPhotoRight &&
      Math.random() < 0.28
    );

    if (dualMode) {
      const leftIndex = getDistinctIndex(currentIndex);
      const rightIndex = getDistinctIndex(currentIndex, leftIndex);
      const primaryIndex = Math.random() < 0.5 ? leftIndex : rightIndex;
      const dualFx = dualMotions[Math.floor(Math.random() * dualMotions.length)];
      const secondaryIndex = primaryIndex === leftIndex ? rightIndex : leftIndex;

      updateCaptionMotion(true);
      dualPhotoLeft.src = photos[leftIndex];
      dualPhotoRight.src = photos[rightIndex];
      dualPhotoLeft.alt = currentImgEl.alt;
      dualPhotoRight.alt = currentImgEl.alt;

      dualBillboard.className = "dual-billboard is-active";
      dualPhotoLeft.className = `dual-photo dual-left is-on ${dualFx}`;
      dualPhotoRight.className = `dual-photo dual-right is-on ${dualFx}`;
      currentImgEl.className = "main-photo is-current out-fade";

      window.setTimeout(() => {
        currentImgEl.src = photos[primaryIndex];
        currentImgEl.className = "main-photo is-current";
        incomingImgEl.className = "main-photo";
        dualBillboard.className = "dual-billboard";
        dualPhotoLeft.className = "dual-photo dual-left";
        dualPhotoRight.className = "dual-photo dual-right";

        currentIndex = primaryIndex;
        rememberIndex(primaryIndex);
        isTransitioning = false;
        scheduleNextSwap();
      }, 820);

      return;
    }

    const nextIndex = getNextIndex();
    const pair = getMotionPair();

    updateCaptionMotion(false);
    incomingImgEl.src = photos[nextIndex];
    incomingImgEl.alt = currentImgEl.alt;

    const inClass = reducedMotion ? "fx-zoom-in" : pair.inFx;
    const outClass = reducedMotion ? "out-fade" : pair.outFx;

    incomingImgEl.className = `main-photo is-next ${inClass}`;
    currentImgEl.className = `main-photo is-current ${outClass}`;

    window.setTimeout(() => {
      currentImgEl.className = "main-photo";
      incomingImgEl.className = "main-photo is-current";

      const oldCurrent = currentImgEl;
      currentImgEl = incomingImgEl;
      incomingImgEl = oldCurrent;

      currentIndex = nextIndex;
      rememberIndex(nextIndex);
      isTransitioning = false;
      scheduleNextSwap();
    }, reducedMotion ? 380 : 780);
  }

  updateBillboardCloud();
  updateCaptionMotion(false);
  scheduleNextSwap();
}
