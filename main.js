document.addEventListener('DOMContentLoaded', () => {
    const forms = [
        { id: 'hero-form', feedbackId: 'form-feedback' },
        { id: 'footer-form', feedbackId: 'footer-feedback' }
    ];

    const DB_ID = '83ee5a31-a644-4ffe-8b53-060358ad9d53';
    const SUBMIT_URL = `https://stg-app.baget.ai/api/public/databases/${DB_ID}/rows`;

    forms.forEach(({ id, feedbackId }) => {
        const form = document.getElementById(id);
        const feedback = document.getElementById(feedbackId);

        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Add source info
            data.source = id === 'hero-form' ? 'hero' : 'footer';

            const submitBtn = form.querySelector('button');
            const originalBtnText = submitBtn.innerText;
            
            submitBtn.innerText = 'Joining...';
            submitBtn.disabled = true;

            try {
                const response = await fetch(SUBMIT_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ data }),
                });

                if (response.ok) {
                    feedback.innerText = 'Thanks! We\'ll be in touch soon.';
                    feedback.className = 'feedback success';
                    form.reset();
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                feedback.innerText = 'Something went wrong. Please try again.';
                feedback.className = 'feedback error';
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    });
});
