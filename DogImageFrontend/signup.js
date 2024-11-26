document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    const mobile = document.getElementById('mobile').value;
    const address = document.getElementById('address').value;

    const userData = {
        username: username,
        password: password,
        name: name,
        mobile: mobile,
        address: address
    };

    try {
        const response = await fetch('https://localhost:7002/api/User/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        if (response.ok) {
            // SweetAlert for successful signup
            Swal.fire({
                icon: 'success',
                title: 'Signup successful!',
                showConfirmButton: false,
                timer: 2500  
            }).then(() => {
                window.location.href = 'index.html';  // Redirect to login page after the notification
            });
        } else {
            // SweetAlert for failed signup
            Swal.fire({
                icon: 'error',
                title: 'Signup failed!',
                text: 'Please try again.',
                showConfirmButton: false,
                timer: 2500  
            });
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
});
