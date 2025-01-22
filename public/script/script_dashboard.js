document.querySelectorAll('.fquiz').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;

        let boxShadow = '';

        if (x < width * 0.33) {
            boxShadow = '#c443c4 -10px 0 20px';
        } else if (x < width * 0.66) {
            boxShadow = 'rgb(228, 204, 96) 0 0 20px';
        } else {
            boxShadow = 'rgb(127, 212, 233) 10px 0 20px';
        }

        card.style.boxShadow = boxShadow;
    });

    card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
    });
});

document.querySelectorAll('.takeQuiz').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        button.style.backgroundPosition = `${x / rect.width * 100}% ${y / rect.height * 100}%`;
    });

    button.addEventListener('mouseleave', () => {
        button.style.backgroundPosition = '0 0';
    });
});

