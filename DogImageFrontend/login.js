document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const loginData = {
        username: username,
        password: password,
    };
    
    try {
        const response = await fetch('https://localhost:7002/api/User/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
           
            const responseData = await response.json();
            
            // Store userId in session storage 
            sessionStorage.setItem('userId', responseData.userId);
            
            Swal.fire({
                icon: 'success',
                title: 'Login successful!',
                text: 'You will be redirected shortly...',
                timer: 2500,
                showConfirmButton: false
            }).then(() => {
                window.location.href = 'search.html';
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login failed!',
                text: 'Invalid credentials, please try again.',
                timer: 2500,
                showConfirmButton: false
            });
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login. Please try again.');
    }
});