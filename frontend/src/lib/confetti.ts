import confetti from 'canvas-confetti';

export const triggerSuccessConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#a855f7', '#3b82f6', '#ec4899'];

    (function frame() {
        const left = 0;
        const right = 0;

        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
};

export const triggerBurstConfetti = (x: number, y: number) => {
    // Normalize coordinates to 0-1
    const xNorm = x / window.innerWidth;
    const yNorm = y / window.innerHeight;

    confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: xNorm, y: yNorm },
        colors: ['#a855f7', '#3b82f6', '#ec4899'],
        disableForReducedMotion: true
    });
};
