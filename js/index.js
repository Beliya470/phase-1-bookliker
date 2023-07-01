document.addEventListener("DOMContentLoaded", function() {
    const listPanel = document.getElementById('list-panel');
    const bookList = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
  
    // Fetch and display the list of books
    fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => {
        books.forEach(book => {
          const bookItem = document.createElement('li');
          bookItem.textContent = book.title;
          bookItem.addEventListener('click', () => showBookDetails(book));
          bookList.appendChild(bookItem);
        });
      });
  
    // Show book details
    function showBookDetails(book) {
      showPanel.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.img_url}" alt="${book.title}">
        <p>${book.description}</p>
        <h3>Liked by:</h3>
        <ul id="liked-users">
          ${getLikedUsersHTML(book.users)}
        </ul>
        <button id="like-button">${book.users.some(user => user.id === 1) ? 'Unlike' : 'Like'}</button>
      `;
  
      const likeButton = document.getElementById('like-button');
      likeButton.addEventListener('click', () => toggleLike(book));
    }
  
    // Toggle like for a book
    function toggleLike(book) {
      const currentUser = { id: 1, username: 'pouros' };
      const likedUsers = book.users;
      const likeButton = document.getElementById('like-button');
  
      if (likedUsers.some(user => user.id === currentUser.id)) {
        // Unlike book
        const updatedUsers = likedUsers.filter(user => user.id !== currentUser.id);
        likeButton.textContent = 'Like';
        updateLikedUsers(book, updatedUsers);
      } else {
        // Like book
        const updatedUsers = [...likedUsers, currentUser];
        likeButton.textContent = 'Unlike';
        updateLikedUsers(book, updatedUsers);
      }
    }
  
    // Update liked users for a book
    function updateLikedUsers(book, users) {
      fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ users })
      })
        .then(response => response.json())
        .then(updatedBook => {
          const likedUsersList = document.getElementById('liked-users');
          likedUsersList.innerHTML = getLikedUsersHTML(updatedBook.users);
        });
    }
  
    // Helper function to generate HTML for liked users
    function getLikedUsersHTML(users) {
      return users.map(user => `<li>${user.username}</li>`).join('');
    }
  });
  