// ----- Login Logic -----
function loginEmail() {
    const email = document.getElementById('email').value;
    if(!email.endsWith('@college.edu')) {
        alert('Use your college email!');
        return;
    }
    localStorage.setItem('email', email);
    window.location.href = 'user-info.html';
}

function loginGoogle() {
    const email = prompt('Simulate Google Login (Enter college email):');
    if(!email || !email.endsWith('@college.edu')) {
        alert('Invalid college email');
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

    if(user.role === 'buyer') user.role = 'seller';
    else user.role = 'buyer';

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
        sold += item.sold;
        revenue += item.sold * item.price;
        const div = document.createElement('div');
        div.innerHTML = `<p>${item.name} | ₹${item.price} | Qty: ${item.quantity} | Sold: ${item.sold}</p>
        <button onclick="deleteItem(${idx})">Delete</button>`;
        container.appendChild(div);
    });

    document.getElementById('items-sold').innerText = `Items Sold: ${sold}`;
    document.getElementById('revenue').innerText = `Total Revenue: ₹${revenue}`;
    document.getElementById('active-listings').innerText = `Active Listings: ${userItems.length}`;
}

function deleteItem(idx) {
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    items.splice(idx,1);
    localStorage.setItem('items', JSON.stringify(items));
    loadSellerItems();
}

// Load seller items when page loads
if(document.getElementById('seller-items')) loadSellerItems();

// ----- Buyer Logic -----
function loadBuyerItems() {
    const user = JSON.parse(localStorage.getItem('user'));
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const container = document.getElementById('items-container');
    if(!container) return;

    const hostelItems = items.filter(i => i.hostel === user.hostel);
    container.innerHTML = '<h2>Items Available in Your Hostel</h2>';
    hostelItems.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `<p>${item.name} | ₹${item.price} | Qty: ${item.quantity}</p>
        <button onclick="buyItem(${idx})">Buy</button>`;
        container.appendChild(div);
    });
}

// Buy an item
function buyItem(idx) {
    const user = JSON.parse(localStorage.getItem('user'));
    const items = JSON.parse(localStorage.getItem('items') || '[]');
    const hostelItems = items.filter(i => i.hostel === user.hostel);
    const item = hostelItems[idx];
    if(!item || item.quantity <= 0) return alert('Item not available');

    item.quantity -= 1;
    item.sold = (item.sold || 0) + 1;
    localStorage.setItem('items', JSON.stringify(items));
    loadBuyerItems();
    alert(`You bought ${item.name} for ₹${item.price}`);
}

// Load buyer items on page load
if(document.getElementById('items-container')) loadBuyerItems();
