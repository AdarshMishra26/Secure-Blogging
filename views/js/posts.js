document.addEventListener('DOMContentLoaded', function() {
    const createPostForm = document.getElementById('create-post-form');
    const messageElement = document.getElementById('message');

    fetchUserPosts();

    if (createPostForm) {
        createPostForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(createPostForm);

            fetch('/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken(),
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title: formData.get('title'),
                    content: formData.get('content')
                })
            })
            .then(response => response.json())
            .then(data => {
                messageElement.textContent = data.message;
                fetchUserPosts();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    }
});

function fetchUserPosts() {
    fetch('/posts', {
        headers: {
            'X-CSRF-Token': getCsrfToken(),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(posts => {
        const userPostsContainer = document.getElementById('user-posts-container');
        userPostsContainer.innerHTML = '';
        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'post';
            postElement.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.content}</p>
                <button onclick="deletePost(${post.id})">Delete</button>
            `;
            userPostsContainer.appendChild(postElement);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function deletePost(postId) {
    fetch(`/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            'X-CSRF-Token': getCsrfToken(),
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').textContent = data.message;
        fetchUserPosts();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function getCsrfToken() {
    const csrfToken = document.cookie.split(';').find(cookie => cookie.trim().startsWith('_csrf='));
    return csrfToken ? csrfToken.split('=')[1] : '';
}
