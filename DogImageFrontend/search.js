
//Authentication
if (!sessionStorage.getItem('userId')) {
   
    window.location.href = 'index.html';
}

function generateCodes(responseCode) {
    let codes = [];
    
  //Here I am checking if the response code is in the correct format
  
    if (!responseCode.match(/^\d{3}$/) && !responseCode.match(/^\d{1,2}x{1,2}$/)) {
        alert('Invalid response code format. Please use either a 3-digit code (e.g., 203) or patterns like 2xx, 20x, etc.');
        return [];
    }

    if (responseCode.includes('x')) {
        const base = responseCode.replace(/x/g, '');  //Here I am replacing the x with an empty string
        
        // Check pattern type
        if (responseCode.endsWith('xx')) {  // Cases like '2xx', '3xx', '4xx'
            for (let i = 0; i <= 9; i++) {
                for (let j = 0; j <= 9; j++) {
                    codes.push(`${base}${i}${j}`);
                }
            }
        } else if (responseCode.endsWith('x')) {  // Cases like '20x', '30x', '40x'
           
            for (let i = 0; i <= 9; i++) {
                codes.push(`${base}${i}`);
            }
        }
    } else {
        // Single response code case (e.g., '203')
        codes = [responseCode];
    }

    return codes;
}

// Function to check if image exists
async function imageExists(code) {

    const imageUrl = `https://http.dog/${code}.jpg`;
    try {
        const response = await fetch(imageUrl, { method: 'HEAD' });
        return response.ok ? imageUrl : null;
    } catch (error) {
        console.error(`Error checking image for HTTP ${code}:`, error);
        return null;
    }
}

// Event listener for searching dog images
document.getElementById('searchForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const responseCode = document.getElementById('responseCode').value;
    const dogImagesDiv = document.getElementById('dogImages');
    dogImagesDiv.innerHTML = ''; 

    if (!responseCode) {
        alert('Please enter a response code.');
        return;
    }

   
    window.currentValidCodes = [];

    //here we get all codes 203,204..
    const codes = generateCodes(responseCode);
    
    if (codes.length === 0) return;  

    // Show loading indicator
    const loadingDiv = document.createElement('div');
    loadingDiv.textContent = 'Loading images...';
    dogImagesDiv.appendChild(loadingDiv);

    try {
      
        const results = await Promise.all(codes.map(async code => {
            const imageUrl = await imageExists(code);
            return { code, imageUrl };
        }));

        // Remove loading indicator
        dogImagesDiv.innerHTML = '';

        // Filter and display valid results
        results.forEach(({ code, imageUrl }) => {
            if (imageUrl) {
                window.currentValidCodes.push(code);
                
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('col-md-4', 'mb-3');
                
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = `Dog image for HTTP ${code}`;
                imgElement.classList.add('img-fluid');
                
                const codeLabel = document.createElement('div');
                codeLabel.textContent = `HTTP ${code}`;
                codeLabel.classList.add('text-center', 'mt-2');
                
                imgContainer.appendChild(imgElement);
                imgContainer.appendChild(codeLabel);
                dogImagesDiv.appendChild(imgContainer);
            }
        });

        if (window.currentValidCodes.length === 0) {
            dogImagesDiv.innerHTML = '<div class="alert alert-info">No images found for the given response code pattern.</div>';
        } else {
            // Add a summary of found images
            const summaryDiv = document.createElement('div');
            summaryDiv.classList.add('alert', 'alert-success', 'mt-3');
            summaryDiv.textContent = `Found ${window.currentValidCodes.length} images for pattern "${responseCode}"`;
            dogImagesDiv.insertBefore(summaryDiv, dogImagesDiv.firstChild);
        }
    } catch (error) {
        console.error('Error:', error);
        dogImagesDiv.innerHTML = '<div class="alert alert-danger">Error loading images. Please try again.</div>';
    }
});

// Event listener for saving filtered list
document.getElementById('saveListForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const listName = document.getElementById('listName').value;
    

    ///////////////////////

    const userId1 = sessionStorage.getItem('userId');
        try {
            const response = await fetch(`https://localhost:7002/api/List/user/${userId1}`);
            if (!response.ok) throw new Error('Failed to fetch lists');
            
            const lists = await response.json();
            const listExists = lists.some(list => list.name === listName);
    
            if (listExists) {
                alert(`The list "${listName}" already exists.`);
            } 
            else{
                if (!listName || !window.currentValidCodes || window.currentValidCodes.length === 0) {
                    alert('Please search for images first and provide a list name.');
                    return;
                }
            
                const userId = sessionStorage.getItem('userId');
             
            
                const imageLinks = window.currentValidCodes.map(code => `https://http.dog/${code}.jpg`);
            
                const listData = {
                    userId: userId,
                    name: listName,
                
                    responseCodes: window.currentValidCodes.join(', '),
                    imageLink: imageLinks.join(', ')
                };
            
                try {
                    const response = await fetch('https://localhost:7002/api/List/create', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(listData)
                    });
            
                    if (response.ok) {
                        alert('List saved successfully!');
                    } else {
                        console.log(response);
                        alert('Failed to save list.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Error saving list. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to check list name');
        }

});