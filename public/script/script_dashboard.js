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


// document.getElementById('friendsButton').addEventListener('click', function() {
//     document.getElementById('friendsWindow').style.display = 'block';
// });

// document.getElementById('closeButton').addEventListener('click', function() {
//     document.getElementById('friendsWindow').style.display = 'none';
// });

// // Optionally, close the friends window if clicking outside of it
// window.addEventListener('click', function(event) {
//     if (event.target === document.getElementById('friendsWindow')) {
//         document.getElementById('friendsWindow').style.display = 'none';
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
    const featuredQuizzes = document.querySelector(".featuredQuizzes");
    let scrollAmount = 0;
    const scrollStep = featuredQuizzes.children[0].offsetWidth + parseInt(getComputedStyle(featuredQuizzes.children[0]).marginRight);

    function slide() {
        if (scrollAmount + featuredQuizzes.offsetWidth >= featuredQuizzes.scrollWidth) {
            // Reset to start if we've reached the end
            scrollAmount = 0;
            featuredQuizzes.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        } else {
            scrollAmount += scrollStep;
            featuredQuizzes.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    setInterval(slide, 7000);
});

// document.addEventListener('DOMContentLoaded', () => {
//     const rowsPerPage = 10;
//     const table = document.querySelector('.past-quizzes table'); // Changed this line to select your table correctly
//     const tbody = table.querySelector('tbody');
//     const rows = Array.from(tbody.querySelectorAll('tr'));
//     const totalPages = Math.ceil(rows.length / rowsPerPage);
//     const pageInfo = document.getElementById('page-info');
//     const prevPageButton = document.getElementById('prev-page');
//     const nextPageButton = document.getElementById('next-page');
//     let currentPage = 1;
  
//     function renderTable() {
//       // Clear the table
//       tbody.innerHTML = '';
//       // Get the rows for the current page
//       const start = (currentPage - 1) * rowsPerPage;
//       const end = start + rowsPerPage;
//       const pageRows = rows.slice(start, end);
//       // Add the rows to the table
//       pageRows.forEach(row => tbody.appendChild(row));
//       // Update page info
//       pageInfo.textContent = `Page ${currentPage} out of ${totalPages}`;
//       // Enable/disable buttons
//       prevPageButton.disabled = currentPage === 1;
//       nextPageButton.disabled = currentPage === totalPages;
//     }
  
//     prevPageButton.addEventListener('click', () => {
//       if (currentPage > 1) {
//         currentPage--;
//         renderTable();
//       }
//     });
  
//     nextPageButton.addEventListener('click', () => {
//       if (currentPage < totalPages) {
//         currentPage++;
//         renderTable();
//       }
//     });
  
//     // Initial render
//     renderTable();
// });

// document.addEventListener('DOMContentLoaded', () => {
//     const rows = document.querySelectorAll('.past-quizzes table tr');
  
//     rows.forEach(row => {
//       row.addEventListener('mousemove', event => {
//         const rect = row.getBoundingClientRect();
//         const x = event.clientX - rect.left;
//         const y = event.clientY - rect.top;
//         const gradient = `radial-gradient(circle at ${x}px ${y}px, rgb(196, 69, 196) 10%, rgb(66, 202, 255))`;
//         row.style.background = gradient;
//       });
  
//       row.addEventListener('mouseleave', () => {
//         row.style.background = ''; /* Reset to white background on mouse leave */
//       });
//     });
//   });
  
    
document.addEventListener('DOMContentLoaded', () => {
    const rowsPerPage = 10;
    const table = document.querySelector('.past-quizzes table');
    const tbody = table.querySelector('tbody');
    let rows = Array.from(tbody.querySelectorAll('tr'));
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    const pageInfo = document.getElementById('page-info');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    let currentPage = 1;
  
    function applyHoverEffect(row) {
      row.addEventListener('mousemove', event => {
        const rect = row.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const gradient = `radial-gradient(circle at ${x}px ${y}px, rgb(196, 69, 196) 10%, rgb(66, 202, 255))`;
        row.style.background = gradient;
      });
  
      row.addEventListener('mouseleave', () => {
        row.style.background = ''; /* Reset to white background on mouse leave */
      });
    }
  
    function renderTable() {
      // Clear the table
      tbody.innerHTML = '';
      // Get the rows for the current page
      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const pageRows = rows.slice(start, end);
      // Add the rows to the table
      pageRows.forEach(row => {
        tbody.appendChild(row);
        applyHoverEffect(row); // Re-apply hover effect
      });
      // Update page info
      pageInfo.textContent = `Page ${currentPage} out of ${totalPages}`;
      // Enable/disable buttons
      prevPageButton.disabled = currentPage === 1;
      nextPageButton.disabled = currentPage === totalPages;
    }
  
    prevPageButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  
    nextPageButton.addEventListener('click', () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderTable();
      }
    });
  
    // Initial render
    renderTable();
  });

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
  
  
  
  