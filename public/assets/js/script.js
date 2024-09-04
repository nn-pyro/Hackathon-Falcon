document.getElementById('user-info-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        condition: formData.get('condition'),
        language: document.getElementById('language').value
    };

    // Hiển thị phần xử lý và ẩn các phần khác
    document.getElementById('processing').style.display = 'block';
    document.getElementById('advice-section').style.display = 'none';

    fetch('/getAdvice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('processing').style.display = 'none';
        document.getElementById('advice-section').style.display = 'block';
        document.getElementById('advice-text').textContent = data.advice;
    })
    .catch(error => {
        document.getElementById('processing').style.display = 'none';
        console.error('Error:', error);
    });
});

function setLanguage(lang) {
    document.getElementById('language').value = lang;
    const currentLanguage = document.getElementById('current-language');
    if (lang === 'en') {
        currentLanguage.textContent = 'English';
    } else if (lang === 'vi') {
        currentLanguage.textContent = 'Tiếng Việt';
    }
}
