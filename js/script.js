document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    // Close menu when links are clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navToggle.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  }

  // ==========================================
  // SCROLL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================
  const scrollElements = document.querySelectorAll(".hidden-scroll");

  if (scrollElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show-scroll");
          observer.unobserve(entry.target); // Animates only once
        }
      });
    }, observerOptions);

    scrollElements.forEach(el => scrollObserver.observe(el));
  }

  // ==========================================
  // HERO IMAGE CAROUSEL SLIDER (HOMEPAGE)
  // ==========================================
  const slides = document.querySelectorAll(".hero-slide");
  const indicatorsContainer = document.querySelector(".hero-indicators");

  if (slides.length > 0) {
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds
    let slideTimer;

    // Dynamically create indicator buttons
    slides.forEach((_, index) => {
      const btn = document.createElement("button");
      btn.classList.add("indicator");
      if (index === 0) btn.classList.add("active");
      btn.setAttribute("aria-label", `Go to slide ${index + 1}`);
      btn.addEventListener("click", () => {
        goToSlide(index);
        resetTimer();
      });
      indicatorsContainer.appendChild(btn);
    });

    const indicators = document.querySelectorAll(".indicator");

    function goToSlide(n) {
      slides[currentSlide].classList.remove("active");
      indicators[currentSlide].classList.remove("active");
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add("active");
      indicators[currentSlide].classList.add("active");
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function startTimer() {
      slideTimer = setInterval(nextSlide, slideInterval);
    }

    function resetTimer() {
      clearInterval(slideTimer);
      startTimer();
    }

    startTimer();
  }

  // ==========================================
  // ANIMATED STATS COUNTER
  // ==========================================
  const statNumbers = document.querySelectorAll(".stat-number");

  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const targetValue = parseInt(el.getAttribute("data-target"), 10);
          animateCounter(el, targetValue);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    function animateCounter(element, target) {
      let current = 0;
      const duration = 2000; // 2 seconds animation
      const stepTime = Math.abs(Math.floor(duration / target));
      
      // Cap minimum step time to avoid freezing
      const finalStepTime = Math.max(stepTime, 15);
      const stepValue = Math.ceil(target / (duration / finalStepTime));

      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          element.textContent = target + (element.dataset.suffix || "+");
          clearInterval(timer);
        } else {
          element.textContent = current + (element.dataset.suffix || "+");
        }
      }, finalStepTime);
    }
  }

  // ==========================================
  // IMAGE LIGHTBOX PREVIEWER
  // ==========================================
  const lightboxTriggers = document.querySelectorAll(".lightbox-trigger");
  
  if (lightboxTriggers.length > 0) {
    // Create lightbox HTML dynamically if it doesn't exist
    let lightbox = document.getElementById("lightbox");
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.id = "lightbox";
      lightbox.classList.add("lightbox");
      lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close image popup">&times;</button>
        <div class="lightbox-content">
          <img src="" alt="">
          <div class="lightbox-caption"></div>
        </div>
      `;
      document.body.appendChild(lightbox);
    }

    const lightboxImg = lightbox.querySelector("img");
    const lightboxCap = lightbox.querySelector(".lightbox-caption");
    const lightboxClose = lightbox.querySelector(".lightbox-close");

    lightboxTriggers.forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const img = trigger.querySelector("img") || trigger;
        const src = trigger.getAttribute("href") || img.getAttribute("src");
        const alt = img.getAttribute("alt") || "School Image";

        lightboxImg.setAttribute("src", src);
        lightboxImg.setAttribute("alt", alt);
        lightboxCap.textContent = alt;
        
        lightbox.classList.add("active");
        document.body.style.overflow = "hidden"; // Prevent scrolling behind
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    };

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightbox.classList.contains("active")) {
        closeLightbox();
      }
    });
  }

  // ==========================================
  // INTERACTIVE FEES CALCULATOR (NOTICES PAGE)
  // ==========================================
  const classSelect = document.getElementById("student-class");
  const feeCalculatorForm = document.getElementById("fee-calculator");

  if (classSelect && feeCalculatorForm) {
    const feeOptions = {
      classBase: {
        primary: { name: "Primary Class (1st-5th)", tuition: 200, admission: 500, exam: 100 },
        junior: { name: "Junior Class (6th-8th)", tuition: 350, admission: 600, exam: 150 },
        senior: { name: "Senior Class (9th-12th)", tuition: 500, admission: 800, exam: 200 }
      },
      addons: {
        computer: 120,
        meal: 250,
        transport: 450,
        sports: 80
      }
    };

    function calculateFees() {
      const selectedClassVal = classSelect.value;
      const baseDetails = feeOptions.classBase[selectedClassVal];

      // Get Addons
      const isComputer = document.getElementById("addon-computer").checked;
      const isMeal = document.getElementById("addon-meal").checked;
      const isTransport = document.getElementById("addon-transport").checked;
      const isSports = document.getElementById("addon-sports").checked;

      // Update Breakdown details in DOM
      document.getElementById("breakdown-tuition").textContent = `₹${baseDetails.tuition}`;
      document.getElementById("breakdown-admission").textContent = `₹${baseDetails.admission}`;
      document.getElementById("breakdown-exam").textContent = `₹${baseDetails.exam}`;

      let total = baseDetails.tuition + baseDetails.admission + baseDetails.exam;

      // Addons
      const compVal = isComputer ? feeOptions.addons.computer : 0;
      const mealVal = isMeal ? feeOptions.addons.meal : 0;
      const transVal = isTransport ? feeOptions.addons.transport : 0;
      const sportsVal = isSports ? feeOptions.addons.sports : 0;

      document.getElementById("breakdown-computer").textContent = isComputer ? `₹${compVal}` : "₹0";
      document.getElementById("breakdown-meal").textContent = isMeal ? `₹${mealVal}` : "₹0";
      document.getElementById("breakdown-transport").textContent = isTransport ? `₹${transVal}` : "₹0";
      document.getElementById("breakdown-sports").textContent = isSports ? `₹${sportsVal}` : "₹0";

      total += compVal + mealVal + transVal + sportsVal;

      // Update Grand Total
      document.getElementById("total-fees-display").textContent = `₹${total}`;
    }

    // Set listener on Form changes
    feeCalculatorForm.addEventListener("change", calculateFees);
    
    // Initial Calculation
    calculateFees();
  }

  // ==========================================
  // INTERACTIVE QUIZ GAME (ACTIVITIES PAGE)
  // ==========================================
  const quizStartBtn = document.getElementById("quiz-start-btn");
  const quizNextBtn = document.getElementById("quiz-next-btn");
  const quizRestartBtn = document.getElementById("quiz-restart-btn");
  const quizStartScreen = document.getElementById("quiz-start-screen");
  const quizGameScreen = document.getElementById("quiz-game-screen");
  const quizEndScreen = document.getElementById("quiz-end-screen");

  if (quizStartScreen && quizGameScreen && quizEndScreen) {
    const quizQuestions = [
      {
        question: "Which Indian state is Government Inter College Gorangchaur located in?",
        options: ["Himachal Pradesh", "Uttarakhand", "Uttar Pradesh", "Sikkim"],
        answer: 1,
        explanation: "GIC Gorangchaur is located in Pithoragarh district of Uttarakhand."
      },
      {
        question: "What is the capital city of Uttarakhand?",
        options: ["Nainital", "Pithoragarh", "Dehradun", "Haridwar"],
        answer: 2,
        explanation: "Dehradun is the winter capital (and primary capital) of Uttarakhand, while Gairsain is the summer capital."
      },
      {
        question: "What is the primary language spoken in the Pithoragarh region of Uttarakhand?",
        options: ["Kumaoni", "Garhwali", "Punjabi", "Bhojpuri"],
        answer: 0,
        explanation: "Pithoragarh lies in the Kumaon region, where Kumaoni is the traditional regional language."
      },
      {
        question: "Which of these is the main theme of the school logo (Shiksha, Sanskar, Vikas)?",
        options: ["Only Education", "Education, Values, and Progress", "Sports & Drama", "Science & Commerce"],
        answer: 1,
        explanation: "The slogan of GIC Gorangchaur is 'Shiksha • Sanskar • Vikas', which translates to 'Education, Culture/Values, and Development'."
      },
      {
        question: "What is the chemical symbol for water?",
        options: ["CO2", "H2O", "O2", "NaCl"],
        answer: 1,
        explanation: "Water is composed of two hydrogen atoms and one oxygen atom, chemical formula H2O."
      },
      {
        question: "Which planet in our solar system is known as the Red Planet?",
        options: ["Mars", "Venus", "Jupiter", "Saturn"],
        answer: 0,
        explanation: "Mars is called the Red Planet due to the iron oxide (rust) on its surface."
      }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    // Start Quiz
    quizStartBtn.addEventListener("click", () => {
      quizStartScreen.classList.remove("active");
      quizEndScreen.classList.remove("active");
      quizGameScreen.classList.add("active");
      currentQuestionIndex = 0;
      score = 0;
      showQuestion();
    });

    // Render Question
    function showQuestion() {
      // Hide next button, clear options and feedback
      quizNextBtn.style.display = "none";
      const feedbackEl = document.getElementById("quiz-feedback");
      feedbackEl.classList.remove("show", "correct", "incorrect");
      feedbackEl.textContent = "";

      const currentQuestion = quizQuestions[currentQuestionIndex];
      
      // Update progress details
      document.getElementById("quiz-current-num").textContent = currentQuestionIndex + 1;
      document.getElementById("quiz-total-num").textContent = quizQuestions.length;
      document.getElementById("quiz-score-val").textContent = score;

      const progressPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
      document.getElementById("quiz-progress-bar").style.width = `${progressPercent}%`;

      // Update question text
      document.getElementById("quiz-question-text").textContent = currentQuestion.question;

      // Render options buttons
      const optionsContainer = document.getElementById("quiz-options-container");
      optionsContainer.innerHTML = "";

      currentQuestion.options.forEach((opt, idx) => {
        const btn = document.createElement("button");
        btn.classList.add("quiz-opt-btn");
        btn.textContent = opt;
        btn.addEventListener("click", () => handleOptionSelection(idx, btn));
        optionsContainer.appendChild(btn);
      });
    }

    // Handle user selection
    function handleOptionSelection(selectedIndex, clickedBtn) {
      const currentQuestion = quizQuestions[currentQuestionIndex];
      const allOptionButtons = document.querySelectorAll(".quiz-opt-btn");
      
      // Disable all options so they cannot double click
      allOptionButtons.forEach(btn => btn.disabled = true);

      const feedbackEl = document.getElementById("quiz-feedback");
      feedbackEl.classList.add("show");

      if (selectedIndex === currentQuestion.answer) {
        // Correct Answer
        clickedBtn.classList.add("correct");
        score++;
        document.getElementById("quiz-score-val").textContent = score;
        feedbackEl.classList.add("correct");
        feedbackEl.innerHTML = `<strong>Correct!</strong> ${currentQuestion.explanation}`;
      } else {
        // Incorrect Answer
        clickedBtn.classList.add("incorrect");
        // Highlight the correct one
        allOptionButtons[currentQuestion.answer].classList.add("correct");
        feedbackEl.classList.add("incorrect");
        feedbackEl.innerHTML = `<strong>Incorrect.</strong> ${currentQuestion.explanation}`;
      }

      // Show Next Button
      quizNextBtn.style.display = "inline-flex";
    }

    // Handle Next Question
    quizNextBtn.addEventListener("click", () => {
      currentQuestionIndex++;
      if (currentQuestionIndex < quizQuestions.length) {
        showQuestion();
      } else {
        // Quiz completed
        quizGameScreen.classList.remove("active");
        quizEndScreen.classList.add("active");
        document.getElementById("quiz-final-score").textContent = score;
        document.getElementById("quiz-total-possible").textContent = quizQuestions.length;

        // Custom summary text based on score
        const performanceEl = document.getElementById("quiz-performance-summary");
        const percentage = (score / quizQuestions.length) * 100;
        if (percentage === 100) {
          performanceEl.textContent = "Outstanding! You got a perfect score. You truly know GIC Gorangchaur!";
        } else if (percentage >= 70) {
          performanceEl.textContent = "Great job! You scored very well. Keep up the high spirit!";
        } else if (percentage >= 50) {
          performanceEl.textContent = "Good attempt! Go back and browse the facilities and admissions page to learn more.";
        } else {
          performanceEl.textContent = "Nice try! Review our site files to find all the right answers and try again.";
        }
      }
    });

    // Restart Quiz
    quizRestartBtn.addEventListener("click", () => {
      quizEndScreen.classList.remove("active");
      quizGameScreen.classList.add("active");
      currentQuestionIndex = 0;
      score = 0;
      showQuestion();
    });
  }

  // ==========================================
  // GALLERY FILTER LOGIC (GALLERY PAGE)
  // ==========================================
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryCards = document.querySelectorAll(".gallery-card");

  if (filterButtons.length > 0 && galleryCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach(b => b.classList.remove("active"));
        // Add active class to clicked button
        btn.classList.add("active");

        const filterValue = btn.getAttribute("data-filter");

        galleryCards.forEach(card => {
          if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
            card.style.display = "block";
            // Soft opacity animation
            setTimeout(() => card.style.opacity = "1", 50);
          } else {
            card.style.opacity = "0";
            setTimeout(() => card.style.display = "none", 300);
          }
        });
      });
    });
  }
});