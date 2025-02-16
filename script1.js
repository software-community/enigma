document.querySelectorAll('.login-button').forEach(button => {
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

document.querySelectorAll('.signup-button').forEach(button => {
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

document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const sidebarButton = document.getElementById("sidebar-button");
    const dropdown = document.querySelector(".s-dropdown");
    const dropdownToggle = document.getElementById("dropdown-toggle");

    // Toggle Sidebar
    sidebarButton.addEventListener("click", function (event) {
        event.preventDefault();
        sidebar.classList.toggle("open");
        event.stopPropagation(); // Prevents triggering the document click event
    });

    // Toggle Dropdown
    dropdownToggle.addEventListener("click", function (event) {
        event.preventDefault();
        dropdown.classList.toggle("active");
        event.stopPropagation(); // Prevents triggering the document click event
    });

    // Close Sidebar when clicking outside
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !sidebarButton.contains(event.target)) {
            sidebar.classList.remove("open");
        }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {
        if (!dropdown.contains(event.target) && !event.target.closest(".s-dropdown")) {
            dropdown.classList.remove("active");
        }
    });
});
