// ============================
// DATA STORE
// ============================
let supplierInfo = {};
let buyerInfo = {};
let items = [];
let invoiceInfo = {};
let transportInfo = {};
let discountPct = 0;
let igstPct = 0;

// ============================
// SECTION SWITCH
// ============================
function switchSection(section) {
    const entryPanel = document.getElementById('section-entry');
    const historyPanel = document.getElementById('section-history');
    const btnEntry = document.getElementById('switch-entry');
    const btnHistory = document.getElementById('switch-history');
    const slider = document.getElementById('switch-slider');

    if (section === 'entry') {
        entryPanel.classList.add('active');
        historyPanel.classList.remove('active');
        btnEntry.classList.add('active');
        btnHistory.classList.remove('active');
        slider.classList.remove('right');
    } else {
        historyPanel.classList.add('active');
        entryPanel.classList.remove('active');
        btnHistory.classList.add('active');
        btnEntry.classList.remove('active');
        slider.classList.add('right');
        renderHistory();
    }

    // Re-trigger animation
    const activePanel = section === 'entry' ? entryPanel : historyPanel;
    activePanel.style.animation = 'none';
    activePanel.offsetHeight; // trigger reflow
    activePanel.style.animation = '';
}

// ============================
// GENERIC DIALOG OPEN / CLOSE
// ============================
function openDialog(id) {
    const modal = document.getElementById(id);
    modal.style.display = 'flex';

    if (id === 'supplier-dialog') prefillSupplier();
    if (id === 'buyer-dialog') prefillBuyer();
    if (id === 'item-dialog') resetItemForm();
}

function closeDialog(id) {
    document.getElementById(id).style.display = 'none';
}

// Close on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.style.display = 'none';
    }
});

// ============================
// SUPPLIER INFO
// ============================
function loadDefaultSupplier() {
    const saved = localStorage.getItem('supplierProfile');
    if (saved) {
        supplierInfo = JSON.parse(saved);
    } else {
        supplierInfo = {
            name: "Vyani Enterprise",
            address: "467, Pandol",
            city: "Surat",
            pincode: "395004",
            state: "Gujarat",
            phone: "7777900729"
        };
    }
}

function prefillSupplier() {
    document.getElementById('f-supplier-name').value = supplierInfo.name || '';
    document.getElementById('f-supplier-address').value = supplierInfo.address || '';
    document.getElementById('f-supplier-city').value = supplierInfo.city || '';
    document.getElementById('f-supplier-pincode').value = supplierInfo.pincode || '';
    document.getElementById('f-supplier-state').value = supplierInfo.state || '';
    document.getElementById('f-supplier-phone').value = supplierInfo.phone || '';
}

function saveSupplierInfo() {
    supplierInfo = {
        name: document.getElementById('f-supplier-name').value.trim(),
        address: document.getElementById('f-supplier-address').value.trim(),
        city: document.getElementById('f-supplier-city').value.trim(),
        pincode: document.getElementById('f-supplier-pincode').value.trim(),
        state: document.getElementById('f-supplier-state').value.trim(),
        phone: document.getElementById('f-supplier-phone').value.trim()
    };
    // Save as default profile for future invoices
    localStorage.setItem('supplierProfile', JSON.stringify(supplierInfo));
    renderSupplier();
    closeDialog('supplier-dialog');
}

function renderSupplier() {
    const el = document.getElementById('d-supplier');
    if (!el) return;
    if (!supplierInfo.name) {
        el.innerHTML = '<p class="empty-hint">Click "🏢 Supplier Info" to enter supplier details</p>';
        return;
    }
    el.innerHTML = `
        <p><strong>${supplierInfo.name}</strong></p>
        ${supplierInfo.address ? '<p>Address: ' + supplierInfo.address + '</p>' : ''}
        <p>${supplierInfo.city ? 'City: ' + supplierInfo.city + ', ' : ''}${supplierInfo.pincode ? 'Pincode: ' + supplierInfo.pincode : ''}</p>
        ${supplierInfo.state ? '<p>State: ' + supplierInfo.state + '</p>' : ''}
        ${supplierInfo.phone ? '<p>Ph: ' + supplierInfo.phone + '</p>' : ''}
    `;
}

// ============================
// BUYER INFO
// ============================
function prefillBuyer() {
    document.getElementById('f-buyer-name').value = buyerInfo.name || '';
    document.getElementById('f-buyer-address').value = buyerInfo.address || '';

    document.getElementById('f-buyer-city').value = buyerInfo.city || '';
    document.getElementById('f-buyer-pincode').value = buyerInfo.pincode || '';
    document.getElementById('f-buyer-state').value = buyerInfo.state || '';
    document.getElementById('f-buyer-phone').value = buyerInfo.phone || '';
}

function saveBuyerInfo() {
    buyerInfo = {
        name: document.getElementById('f-buyer-name').value.trim(),
        address: document.getElementById('f-buyer-address').value.trim(),

        city: document.getElementById('f-buyer-city').value.trim(),
        pincode: document.getElementById('f-buyer-pincode').value.trim(),
        state: document.getElementById('f-buyer-state').value.trim(),
        phone: document.getElementById('f-buyer-phone').value.trim()
    };
    renderBuyer();
    closeDialog('buyer-dialog');
}

function renderBuyer() {
    const el = document.getElementById('d-buyer');
    if (!el) return;
    if (!buyerInfo.name) {
        el.innerHTML = '<p class="empty-hint">Click "👤 Buyer Info" to enter buyer details</p>';
        return;
    }
    el.innerHTML = `
        <p><strong>${buyerInfo.name}</strong></p>
        ${buyerInfo.address ? '<p>Address: ' + buyerInfo.address + '</p>' : ''}

        ${buyerInfo.city ? '<p>City: ' + buyerInfo.city + '</p>' : ''}
        ${buyerInfo.pincode ? '<p>Pincode: ' + buyerInfo.pincode + '</p>' : ''}
        ${buyerInfo.state ? '<p>State: ' + buyerInfo.state + '</p>' : ''}
        ${buyerInfo.phone ? '<p>Ph: ' + buyerInfo.phone + '</p>' : ''}
    `;
}

function renderInvoiceInfo() {
    // placeholder for invoice info rendering
}

function renderTransport() {
    // placeholder for transport info rendering
}

// ============================
// 2. ITEM ENTRY
// ============================
function resetItemForm() {
    document.getElementById('f-item-desc').value = '';
    document.getElementById('f-item-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('f-item-challan').value = '';
    document.getElementById('f-item-amount').value = '';
    setTimeout(() => document.getElementById('f-item-desc').focus(), 200);
}

function saveItemEntry() {
    const desc = document.getElementById('f-item-desc').value.trim();
    if (!desc) { alert('Please enter description.'); return; }

    items.push({
        desc: desc,
        challanDate: document.getElementById('f-item-date').value,
        challanNo: document.getElementById('f-item-challan').value.trim(),
        amount: parseFloat(document.getElementById('f-item-amount').value) || 0
    });

    renderItems();
    closeDialog('item-dialog');
}

function deleteItem(index) {
    items.splice(index, 1);
    renderItems();
}

function renderItems() {
    const tbody = document.getElementById('items-body');
    tbody.innerHTML = '';

    if (items.length === 0) {
        tbody.innerHTML = '<tr id="empty-row"><td colspan="6" class="empty-hint" style="padding:2rem">No items added. Click "＋ Add Item" to start.</td></tr>';
        recalcTotals();
        return;
    }

    items.forEach((item, i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${item.desc}</td>
            <td>${item.challanDate}</td>
            <td>${item.challanNo}</td>
            <td style="text-align:right">₹ ${item.amount.toLocaleString('en-IN')}</td>
            <td style="text-align:center"><button class="delete-btn" onclick="deleteItem(${i})" title="Delete">🗑️</button></td>
        `;
        tbody.appendChild(tr);
    });

    recalcTotals();
}

function recalcTotals() {
    let grandTotal = 0;
    items.forEach(item => grandTotal += item.amount);

    document.getElementById('d-grand-total').innerText = '₹ ' + grandTotal.toLocaleString('en-IN');

    const wordsEl = document.getElementById('d-amount-words');
    if (grandTotal > 0) {
        wordsEl.innerHTML = `<strong>Amount Chargeable (in words):</strong><br>Indian Rupees ${numberToWords(grandTotal)} Only`;
    } else {
        wordsEl.innerHTML = '';
    }
}

// ============================
// NUMBER TO WORDS (Indian system)
// ============================
function numberToWords(num) {
    if (num === 0) return 'Zero';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
        'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function twoDigits(n) {
        if (n < 20) return ones[n];
        return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    }

    function threeDigits(n) {
        if (n >= 100) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + twoDigits(n % 100) : '');
        return twoDigits(n);
    }

    let result = '';
    if (num >= 10000000) { result += threeDigits(Math.floor(num / 10000000)) + ' Crore '; num %= 10000000; }
    if (num >= 100000) { result += twoDigits(Math.floor(num / 100000)) + ' Lakh '; num %= 100000; }
    if (num >= 1000) { result += twoDigits(Math.floor(num / 1000)) + ' Thousand '; num %= 1000; }
    if (num > 0) result += threeDigits(num);

    return result.trim();
}

// ============================
// SAVE INVOICE
// ============================
function saveInvoice() {
    if (!buyerInfo.name) { alert('Please set Buyer details first.'); return; }
    if (items.length === 0) { alert('Please add at least one item.'); return; }

    const invoice = {
        invoiceInfo: { ...invoiceInfo },
        supplierInfo: { ...supplierInfo },
        buyerInfo: { ...buyerInfo },
        transportInfo: { ...transportInfo },
        items: [...items],
        discountPct, igstPct,
        savedAt: new Date().toISOString()
    };

    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    invoices.push(invoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    alert('✅ Invoice saved successfully!');

    // Sync to Firebase if available
    syncToFirebase();

    // Reset form after save
    resetAll(true);
    // Switch to history section to show saved invoice
    switchSection('history');
}

// ============================
// RESET ALL
// ============================
function resetAll(skipConfirm) {
    if (!skipConfirm && !confirm('Are you sure you want to reset everything?')) return;
    invoiceInfo = {};
    buyerInfo = {};
    transportInfo = {};
    items = [];
    discountPct = 0;
    igstPct = 0;

    loadDefaultSupplier(); // reload default supplier
    renderSupplier();
    renderInvoiceInfo();
    renderBuyer();
    renderTransport();
    renderItems();
}

// ============================
// HISTORY
// ============================
function renderHistory() {
    const container = document.getElementById('history-list');
    if (!container) return;

    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');

    // Update badge count
    updateHistoryBadge(invoices.length);

    if (invoices.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:3rem 1rem;">
                <div style="font-size:3rem; margin-bottom:1rem; opacity:0.5;">📋</div>
                <p class="empty-hint" style="font-size:1rem;">No saved invoices yet.</p>
                <p class="empty-hint" style="margin-top:0.5rem;">Switch to "Data Entry" to create your first invoice.</p>
            </div>`;
        return;
    }

    container.innerHTML = '';

    // Show newest first
    invoices.slice().reverse().forEach((inv, revIdx) => {
        const realIdx = invoices.length - 1 - revIdx;
        const buyer = inv.buyerInfo || {};
        const info = inv.invoiceInfo || {};
        const total = calcGrandTotal(inv);
        const date = info.invDate || (inv.savedAt ? inv.savedAt.split('T')[0] : '-');

        const card = document.createElement('div');
        card.className = 'history-card';
        card.innerHTML = `
            <div class="history-card-info">
                <span class="hc-buyer">👤 ${buyer.name || 'Unknown Buyer'}</span>
                <span class="hc-meta">
                    Invoice: ${info.invNo || '-'} &nbsp;|&nbsp; Date: ${date} &nbsp;|&nbsp;
                    Phone: ${buyer.phone || '-'} &nbsp;|&nbsp;
                    Grand Total: ₹ ${total.toLocaleString('en-IN')}
                </span>
            </div>
            <div class="history-card-actions">
                <button class="icon-btn" onclick="viewInvoice(${realIdx})" title="View">👁️ View</button>
                <button class="icon-btn" onclick="printInvoice(${realIdx})" title="Print">🖨️ Print</button>
                <button class="icon-btn icon-btn-danger" onclick="deleteInvoice(${realIdx})" title="Delete">🗑️</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function updateHistoryBadge(count) {
    let badge = document.querySelector('#switch-history .history-count-badge');
    if (count > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'history-count-badge';
            document.getElementById('switch-history').appendChild(badge);
        }
        badge.textContent = count;
    } else if (badge) {
        badge.remove();
    }
}

function calcGrandTotal(inv) {
    let itemTotal = 0;
    (inv.items || []).forEach(item => itemTotal += (item.amount || 0));
    const disc = inv.discountPct || 0;
    const igst = inv.igstPct || 0;
    const discVal = Math.round(itemTotal * disc / 100);
    const subTotal = itemTotal - discVal;
    return subTotal + Math.round(subTotal * igst / 100);
}

function deleteInvoice(index) {
    if (!confirm('Are you sure you want to delete this invoice?')) return;
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    invoices.splice(index, 1);
    localStorage.setItem('invoices', JSON.stringify(invoices));

    // Sync to Firebase after deletion
    syncToFirebase();

    renderHistory();
}

function viewInvoice(index) {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const inv = invoices[index];
    if (!inv) return;

    // Load into current form
    invoiceInfo = inv.invoiceInfo || {};
    supplierInfo = inv.supplierInfo || JSON.parse(localStorage.getItem('supplierProfile')) || { name: "Vyani Enterprise" };
    buyerInfo = inv.buyerInfo || {};
    transportInfo = inv.transportInfo || {};
    items = inv.items || [];
    discountPct = inv.discountPct || 0;
    igstPct = inv.igstPct || 0;

    renderInvoiceInfo();
    renderBuyer();
    renderTransport();
    renderItems();

    // Switch to Data Entry section
    switchSection('entry');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================
// PRINT INVOICE (Buyer info only)
// ============================
function printInvoice(index) {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const inv = invoices[index];
    if (!inv) return;

    const buyer = inv.buyerInfo || {};
    const info = inv.invoiceInfo || {};
    const supplier = inv.supplierInfo || JSON.parse(localStorage.getItem('supplierProfile')) || { name: "Vyani Enterprise", address: "467, Pandol", city: "Surat", pincode: "395004", state: "Gujarat", phone: "7777900729" };
    const itms = inv.items || [];

    let grandTotal = 0;
    itms.forEach(item => grandTotal += (item.amount || 0));

    // Build items rows
    let itemRows = '';
    itms.forEach((item, i) => {
        itemRows += `<tr>
            <td>${i + 1}</td>
            <td>${item.desc}</td>
            <td>${item.challanDate}</td>
            <td>${item.challanNo}</td>
            <td style="text-align:right">₹ ${item.amount.toLocaleString('en-IN')}</td>
        </tr>`;
    });

    const html = `
    <div class="print-invoice">
        <h2>Tax Invoice</h2>

        <!-- Supplier + Meta -->
        <div class="pi-grid">
            <div class="pi-cell">
                <strong>Supplier: ${supplier.name || '-'}</strong><br>
                Address: ${supplier.address || '-'}<br>
                City: ${supplier.city || '-'}, Pincode: ${supplier.pincode || '-'}<br>
                State: ${supplier.state || '-'}<br>
                Ph: ${supplier.phone || '-'}
            </div>
            <div class="pi-cell">
                <strong>Invoice No:</strong> ${info.invNo || '-'}<br>
                <strong>Date:</strong> ${info.invDate || '-'}<br>
                <strong>Delivery Challans:</strong> ${info.dc || '-'}<br>
                <strong>Bill Due Days:</strong> ${info.due || '-'}
            </div>
        </div>

        <!-- Buyer Info -->
        <div class="pi-grid">
            <div class="pi-cell">
                <strong>Buyer's Name:</strong> ${buyer.name || '-'}<br>
                <strong>Address:</strong> ${buyer.address || '-'}<br>

                <strong>City:</strong> ${buyer.city || '-'}<br>
                <strong>Pincode:</strong> ${buyer.pincode || '-'}<br>
                <strong>State:</strong> ${buyer.state || '-'}<br>
                <strong>Phone No:</strong> ${buyer.phone || '-'}
            </div>
            <div class="pi-cell">
                <strong>State of Supply:</strong> ${buyer.state || '-'}
            </div>
        </div>

        <!-- Items Table -->
        <table>
            <thead>
                <tr>
                    <th>Sr</th>
                    <th>Description</th>
                    <th>Challan Date</th>
                    <th>Challan No.</th>
                    <th style="text-align:right">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${itemRows}
            </tbody>
        </table>

        <!-- Totals -->
        <div class="pi-totals">
            <div class="pi-totals-inner">
                <div class="pi-grand"><span>Grand Total</span><span>₹ ${grandTotal.toLocaleString('en-IN')}</span></div>
            </div>
        </div>

        <div class="pi-words">
            <strong>Amount Chargeable (in words):</strong><br>
            Indian Rupees ${numberToWords(grandTotal)} Only
        </div>

        <div style="text-align:right; margin-top:10px; font-size:11px;">E & O.E</div>
    </div>`;

    document.getElementById('print-area').innerHTML = html;
    openDialog('print-dialog');
}

function doPrint() {
    window.print();
}

// ============================
// INIT: Load history on page load
// ============================
document.addEventListener('DOMContentLoaded', () => {
    // Update history badge count on load
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    updateHistoryBadge(invoices.length);
});

// ============================
// AUTH (for signin / signup pages)
// ============================
// ============================
// FIREBASE REALTIME DB SYNC LOGIC
// ============================
// IMPORTANT: Put your Firebase config here so data actually syncs
const firebaseConfig = {
    apiKey: "AIzaSyAQaglDg92vdyY4KV0PzIQ7uzGo3cMI_vs",
    authDomain: "invoice-cb128.firebaseapp.com",
    databaseURL: "https://invoice-cb128-default-rtdb.firebaseio.com",
    projectId: "invoice-cb128",
    storageBucket: "invoice-cb128.firebasestorage.app",
    messagingSenderId: "744211700508",
    appId: "1:744211700508:web:a5af1c74fc6ce959ef38d9",
    measurementId: "G-0PDFTPJKYM"
};

function initFirebase() {
    if (typeof firebase === 'undefined') return; // Only run if Firebase is loaded (in index.html)

    // Initialize only if not already initialized
    if (!firebase.apps.length) {
        if (!firebaseConfig.apiKey) {
            console.warn("Firebase config is empty. Please add your credentials in script.js to enable real-time sync.");
            return;
        }
        firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth();
    const db = firebase.database();

    // Sign in anonymously to allow database access rules
    auth.signInAnonymously()
        .then(() => {
            console.log("Firebase Anonymous Auth successful");

            // Listen for changes from Firebase
            const invoicesRef = db.ref('global_invoices');
            invoicesRef.on('value', (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    // Update local storage from Firebase to sync across devices
                    localStorage.setItem('invoices', JSON.stringify(data));

                    // Re-render UI if we are on the history screen
                    if (document.getElementById('history-list')) {
                        renderHistory();
                    }
                }
            });
        })
        .catch((error) => {
            console.error("Firebase Anonymous Auth failed: ", error);
        });
}

function syncToFirebase() {
    if (typeof firebase === 'undefined' || !firebase.apps.length) return;

    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const db = firebase.database();

    // Save to a global path so all devices see the same data
    db.ref('global_invoices').set(invoices)
        .catch(err => console.error("Firebase sync error:", err));
}

// Check logged in state on main app load
document.addEventListener('DOMContentLoaded', () => {
    // Automatically redirect to signin if not authorized
    const isAuthPage = window.location.pathname.includes('signin') || window.location.pathname.includes('signup');
    if (!localStorage.getItem('isAuthenticated') && !isAuthPage && window.location.pathname.includes('index.html')) {
        window.location.href = 'signin.html';
        return;
    }

    if (!isAuthPage) {
        // Init firebase sync for index page
        initFirebase();
        loadDefaultSupplier();
        renderSupplier();
    }
});

const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Signup is handled manually by admin now.');
        window.location.href = 'signin.html';
    });
}

const signinForm = document.getElementById('signin-form');
if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;

        // Custom Login required by user
        if (email === 'maniyadhruvik07@gmail.com' && password === 'maniya@#07') {
            alert('Welcome, Dhruvik!');
            localStorage.setItem('isAuthenticated', 'true');
            window.location.href = 'index.html';
        } else {
            alert('❌ Invalid credentials.');
        }
    });
}
