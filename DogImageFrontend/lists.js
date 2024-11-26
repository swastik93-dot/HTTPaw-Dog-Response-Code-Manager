
if (!sessionStorage.getItem('userId')) {
   
    window.location.href = 'index.html';
}


let listModal;
let confirmationModal;
let currentList = null;
let isEditMode = false;

document.addEventListener('DOMContentLoaded', function() {
   
    listModal = new bootstrap.Modal(document.getElementById('listModal'));
    confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    
    // Load user's lists
    loadUserLists();

    
    document.getElementById('editListBtn').addEventListener('click', toggleEditMode);
    document.getElementById('saveListBtn').addEventListener('click', saveListChanges);
    document.getElementById('deleteListBtn').addEventListener('click', showDeleteConfirmation);
    document.getElementById('confirmDeleteBtn').addEventListener('click', deleteList);
});

async function loadUserLists() {
    const userId = sessionStorage.getItem('userId');
  

    try {
        const response = await fetch(`https://localhost:7002/api/List/user/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch lists');
        
        const lists = await response.json();
        displayLists(lists);
    } catch (error) {
        console.error('Error:', error);
        showError('Failed to load lists');
    }
}

function displayLists(lists) {

    const container = document.getElementById('listsContainer');
    container.innerHTML = ''; // Clear loading spinner

    if (lists.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No lists found. Create your first list!
                </div>
            </div>`;
        return;
    }

    lists.forEach(list => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-4';
        card.innerHTML = `
            <div class="card list-card h-100" data-list-id="${list.id}">
                <div class="card-body">
                    <h5 class="card-title">${list.name}</h5>
                    <p class="card-text">
                        <small class="text-muted">Created: ${new Date(list.creationDate).toLocaleDateString()}</small><br>
                        <small>${list.responseCodes.split(',').length} response codes</small>
                    </p>
                </div>
            </div>
        `;
        
        card.querySelector('.list-card').addEventListener('click', () => showListDetails(list));
        container.appendChild(card);
    });
}

function showListDetails(list) {
    currentList = list;
    isEditMode = false;
    
  
    document.getElementById('listName').value = list.name;
    document.getElementById('listName').disabled = true;
    
    // Display response codes
    const codesContainer = document.getElementById('responseCodesContainer');
    codesContainer.innerHTML = list.responseCodes.split(',').map(code => 
        `<span class="code-tag">${code.trim()}</span>`
    ).join(' ');
    
    // Display images
    const imagesContainer = document.getElementById('imagesContainer');
    imagesContainer.innerHTML = list.imageLink.split(',').map(link => 
        `<img src="${link.trim()}" alt="HTTP Dog" class="img-fluid">`
    ).join('');
    
    // Update buttons
    document.getElementById('editListBtn').classList.remove('d-none');
    document.getElementById('saveListBtn').classList.add('d-none');
    
    listModal.show();
}

function toggleEditMode() {
  
    isEditMode = !isEditMode;
    
 
    document.getElementById('listName').disabled = !isEditMode;
    
    if (isEditMode) {
        // Convert code tags to editable format
        const codesContainer = document.getElementById('responseCodesContainer');
        const codes = currentList.responseCodes.split(',').map(code => code.trim());
        codesContainer.innerHTML = `
            <input type="text" class="form-control" 
                   value="${codes.join(', ')}" 
                   placeholder="Enter response codes separated by commas">
        `;
        
        // Show/hide buttons
        document.getElementById('editListBtn').classList.add('d-none');
        document.getElementById('saveListBtn').classList.remove('d-none');
    } else {
        showListDetails(currentList);
    }
}

async function saveListChanges() {
    const updatedName = document.getElementById('listName').value;
    const updatedCodes = document.querySelector('#responseCodesContainer input').value;
    
    // Validate input
    if (!updatedName || !updatedCodes) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        // Create updated list object
        const updatedList = {
            ...currentList,//so
            name: updatedName,
            responseCodes: updatedCodes,
            imageLink: updatedCodes.split(',')
                .map(code => `https://http.dog/${code.trim()}.jpg`)
                .join(', ')
        };
        
        // Call API to update list
        const response = await fetch(`https://localhost:7002/api/List/${currentList.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedList)
        });
        
        if (!response.ok) throw new Error('Failed to update list');
        
        // Update current list
        currentList = updatedList;
        showListDetails(currentList);
        loadUserLists(); // Refresh the list view
        
        alert('List updated successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update list');
    }
}

function showDeleteConfirmation() {
    confirmationModal.show();
}

async function deleteList() {
    try {
        const response = await fetch(`https://localhost:7002/api/List/${currentList.id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete list');
        
        confirmationModal.hide();
        listModal.hide();
        loadUserLists(); // Refresh the list view bu calling load function
        
        alert('List deleted successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete list');
    }
}

function showError(message) {
    const container = document.getElementById('listsContainer');
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-danger">
                ${message}
            </div>
        </div>`;
}
