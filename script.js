// ----- College Email Validation -----
function isValidCollegeEmail(email) {
    const pattern = /^\d+@kiit\.ac\.in$/;
    return pattern.test(email);
}

// ----- Login Logic -----
function loginEmail() {
    const email = document.getElementById('email').value;
    if(!isValidCollegeEmail(email)) {
        alert('Use your KIIT college email (rollno@kiit.ac.in)!');
        return;
    }
    localStorage.setItem('email', email);
    window.location.href = 'user-info.html';
}

function loginGoogle() {
    const email = prompt('Simulate Google Login (Enter KIIT college email):');
    if(!email || !isValidCollegeEmail(email)) {
        alert('Invalid KIIT college email');
        return;
    }
    localStorage.setItem('email', email);
    window.location.href = 'user-info.html';
}

// ----- User Info Page -----
function saveUserInfo() {
    const hostel = document.getElementById('hostel').value.toUpperCase();
    const room = document.getElementById('room').value;
    const role = document.getElementById('role').value;

    const hostelPattern = /^(?:[1-9][0-9]?|100)[A-Z]$/;
    const roomPattern = /^\d{3}$/;

    if(!hostelPattern.test(hostel)) {
        alert('Invalid hostel format! Example: 25A');
        return;
    }
    if(!roomPattern.test(room)) {
        alert('Invalid room number! Example: 101');
        return;
    }

    const user = {
        email: localStorage.getItem('email'),
        hostel: hostel,
        room: room,
        role: role
    };
    localStorage.setItem('user', JSON.stringify(user));

    if(role === 'buyer') window.location.href = 'buyer.html';
    else window.location.href = 'seller.html';
}

// ----- Role Switching -----
function switchRole() {
    const user = JSON.parse(localStorage.getItem('user'));
    if(!user) return alert('User not found');

    user.role = (user.role === 'buyer') ? 'seller' : 'buyer';
    localStorage.setItem('user', JSON.stringify(user));

    if(user.role === 'buyer') window.location.href = 'buyer.html';
    else window.location.href = 'seller.html';
}

// ----- Seller Logic -----
function addItem() {
    const name = document.getElementById('item-name').value;
    const price = parseFloat(document.getElementById('item-price').value);
    const quantity = parseInt(document.getElementById('item-quantity').value);

    if(!name || price <= 0 || quantity <= 0) return alert('Enter valid item details');

    const user = JSON.parse(localStorage.getItem('user'));
    const items = JSON.parse(localStorage.getItem('items') || '[]');

    items.push({
        name, price, quantity, sellerEmail: user.email, hostel: user.hostel, sold:0
    });

    localStorage.setItem('items', JSON.stringify(items));
    loadSellerItems();
}

function loadSellerItems() {
    const user = JSON.parse(localStorage.getItem('user'));
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const container = document.getElementById('seller-items');
    if(!container) return;

    const userItems = items.filter(i => i.sellerEmail === user.email);
    container.innerHTML = '<h3>Your Items</h3>';
    let sold = 0, revenue = 0;
    userItems.forEach((item, idx) => {
        sold += item
