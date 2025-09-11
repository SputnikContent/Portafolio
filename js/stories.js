document.addEventListener("DOMContentLoaded", function() {
    const shareBtn = document.querySelector('.share-btn');
    const storyModal = document.getElementById('story-modal');
    const closeBtn = document.querySelector('.close-story-btn');
    const storyForm = document.getElementById('story-form');

    // Muestra el modal cuando se hace clic en el botón
    shareBtn.addEventListener('click', function(e) {
        e.preventDefault();
        storyModal.classList.add('active');
    });

    // Oculta el modal al hacer clic en el botón de cerrar
    closeBtn.addEventListener('click', function() {
        storyModal.classList.remove('active');
    });

    // Oculta el modal al hacer clic fuera de él
    window.addEventListener('click', function(e) {
        if (e.target === storyModal) {
            storyModal.classList.remove('active');
        }
    });

    // Maneja el envío del formulario
    storyForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Puedes obtener los valores del formulario si lo necesitas en el futuro
        const name = document.getElementById('story-name').value;
        const email = document.getElementById('story-email').value;
        const story = document.getElementById('story-text').value;

        // Ocultar el modal y resetear el formulario
        storyModal.classList.remove('active');
        storyForm.reset();

        // Mostrar el mensaje de confirmación
        alert("¡Gracias por compartir tu historia! Se analizará y se tomará en cuenta para futuras publicaciones.");
    });
});