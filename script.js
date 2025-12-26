document.addEventListener('DOMContentLoaded', () => {
    // 24-Hour Countdown Timer
    const countdownElement = document.getElementById('countdown');
    const banner = document.getElementById('urgency-banner');

    function startCountdown() {
        // Set target time: 24 hours from now
        let targetTime = localStorage.getItem('demoTargetTime');
        
        if (!targetTime) {
            targetTime = new Date().getTime() + (24 * 60 * 60 * 1000);
            localStorage.setItem('demoTargetTime', targetTime);
        } else {
            targetTime = parseInt(targetTime);
        }

        const x = setInterval(function() {
            const now = new Date().getTime();
            const distance = targetTime - now;

            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = 
                (hours < 10 ? "0" + hours : hours) + ":" + 
                (minutes < 10 ? "0" + minutes : minutes) + ":" + 
                (seconds < 10 ? "0" + seconds : seconds);

            if (distance < 0) {
                clearInterval(x);
                countdownElement.innerHTML = "EXPIRED";
                banner.style.background = "#333";
            }
        }, 1000);
    }

    startCountdown();

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation to sections and cards
    document.querySelectorAll('.info-card, .step, .pricing-card, .callout-box').forEach(el => {
        el.style.opacity = '0'; // Initial state for observer
        observer.observe(el);
    });

    // Add CSS for the observer items
    const style = document.createElement('style');
    style.innerHTML = `
        .info-card, .step, .pricing-card, .callout-box {
            transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
    `;
    document.head.appendChild(style);
});
