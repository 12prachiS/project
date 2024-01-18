// script.js
$(document).ready(function () {
    // Your GitHub username
    var githubUsername = '12prachiS';

    // Set GitHub profile link
    $('#github-profile-link').attr('href', 'https://github.com/12prachiS' );

    // GitHub API endpoint for user repositories
    var apiUrl = 'https://api.github.com/users/12prachiS/repos';

    // Add global variables for pagination
    var currentPage = 1;
    var perPage = 10; // Default value, you can change this

    // Add loader element
    var loader = $('#loader');

    // Make an AJAX request to GitHub API
    function fetchRepositories() {
        // Display loader before making the API call
        loader.show();

        $.ajax({
            url: apiUrl,
            data: {
                per_page: perPage,
                page: currentPage,
            },
            method: 'GET',
            success: function (data) {
                // Handle the data (list of repositories) here
                displayRepositories(data);
                
                // Hide loader after the API call is successful
                loader.hide();
            },
            error: function (error) {
                // Handle errors here
                console.error('Error fetching GitHub repositories:', error);

                // Hide loader after handling the error
                loader.hide();
            }
        });
    }

    // Initial fetch on page load
    fetchRepositories();

    // Function to display repositories on the webpage
    function displayRepositories(repositories) {
        var repositoriesContainer = $('#repositories-container');

        // Clear existing repositories
        repositoriesContainer.empty();

        // Check if repositories exist
        if (repositories.length === 0) {
            repositoriesContainer.append('<p>No repositories found.</p>');
            return;
        }

        // Loop through repositories and create HTML elements
        repositories.forEach(function (repo) {
            var repoDiv = $('<div class="repository">');
            repoDiv.append(`<h3>${repo.name}</h3>`);
            repoDiv.append(`<p>${repo.description || 'No description available'}</p>`);
            repoDiv.append(`<p><a href="${repo.html_url}" target="_blank">View on GitHub</a></p>`);
            repositoriesContainer.append(repoDiv);
        });

        // Add pagination controls
        repositoriesContainer.append(`
            <div id="pagination-controls">
                <button id="prevPageBtn">Previous Page</button>
                <button id="nextPageBtn">Next Page</button>
                <label for="perPageSelect">Repositories per Page:</label>
                <select id="perPageSelect">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                </select>
            </div>
        `);

        // Set the selected value of perPageSelect
        $('#perPageSelect').val(perPage);

        // Event listener for pagination controls
        $('#prevPageBtn').on('click', function () {
            if (currentPage > 1) {
                currentPage--;
                fetchRepositories();
            }
        });

        $('#nextPageBtn').on('click', function () {
            currentPage++;
            fetchRepositories();
        });

        $('#perPageSelect').on('change', function () {
            perPage = $(this).val();
            currentPage = 1; // Reset to the first page when changing perPage
            fetchRepositories();
        });

        // Add Search Bar
        repositoriesContainer.prepend(`
            <input type="text" id="searchInput" placeholder="Search repositories...">
        `);

        // Event listener for search input
        $("#searchInput").on("input", function () {
            filterRepositories($(this).val());
        });
    }

    // Function to filter repositories based on search text
    function filterRepositories(searchText) {
        // Assuming you have an array called 'repositories' that holds your repository data
        // You may need to adapt this based on your actual data structure
        const filteredRepositories = repositories.filter(repository => {
            // Check if the repository name or any other relevant information contains the searchText
            return repository.name.toLowerCase().includes(searchText.toLowerCase());
        });

        // Call a function to update the displayed repositories with the filtered results
        displayRepositories(filteredRepositories);
    }
});
