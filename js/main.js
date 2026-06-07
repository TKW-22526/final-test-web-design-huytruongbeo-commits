// Khởi tạo cấu trúc dữ liệu giỏ hàng nâng cao lưu chi tiết từng sản phẩm
let cartData = JSON.parse(localStorage.getItem('gym_cart_advanced')) || {
    items: {},
    totalQty: 0,
    totalPrice: 0
};

// Hàm đồng bộ hiển thị ra ngoài màn hình chính
function updateCartUI() {
    const qtyEl = document.getElementById('cart-total-qty');
    const priceEl = document.getElementById('cart-total-price');
    
    if (qtyEl && priceEl) {
        qtyEl.innerText = cartData.totalQty;
        priceEl.innerText = cartData.totalPrice.toLocaleString('vi-VN') + ' VNĐ';
    }
}

// Hàm thêm sản phẩm vào giỏ hàng
function addToCart(productName) {
    let price = 0;

    if (productName.includes('Đai Lưng')) price = 250000;
    else if (productName.includes('Con Lăn')) price = 180000;
    else if (productName.includes('Kháng Lực')) price = 150000;
    else if (productName.includes('Parallettes')) price = 350000;
    else price = 220000;

    if (cartData.items[productName]) {
        cartData.items[productName].qty += 1;
    } else {
        cartData.items[productName] = { price: price, qty: 1 };
    }

    recalculateCart();
    alert(`Đã thêm "${productName}" vào giỏ hàng thành công! Bạn có thể bấm "Kiểm Tra Giỏ Hàng" để kiểm tra.`);
}

// Hàm tính toán lại toàn bộ dữ liệu giỏ hàng
function recalculateCart() {
    let totalQty = 0;
    let totalPrice = 0;

    for (let key in cartData.items) {
        totalQty += cartData.items[key].qty;
        totalPrice += cartData.items[key].price * cartData.items[key].qty;
    }

    cartData.totalQty = totalQty;
    cartData.totalPrice = totalPrice;

    localStorage.setItem('gym_cart_advanced', JSON.stringify(cartData));
    updateCartUI();
}

// Hàm mở bảng Popup kiểm tra chi tiết giỏ hàng (Đã tối ưu màu chữ sang Dark Mode)
function openCartModal() {
    const modal = document.getElementById('cart-modal');
    const itemsContainer = document.getElementById('cart-modal-items');
    
    if (!modal || !itemsContainer) return;

    itemsContainer.innerHTML = '';

    if (Object.keys(cartData.items).length === 0) {
        itemsContainer.innerHTML = '<p style="text-align:center; color:#888; padding:20px; margin:0;">Giỏ hàng của bạn đang trống!</p>';
    } else {
        for (let name in cartData.items) {
            let item = cartData.items[name];
            let itemSumPrice = item.price * item.qty;

            let row = document.createElement('div');
            row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #2d2d2d;';
            row.innerHTML = `
                <div style="flex:2;">
                    <strong style="font-size:14px; color:#fff;">${name}</strong><br>
                    <span style="font-size:13px; color:#ed1c24; font-weight:bold;">${item.price.toLocaleString('vi-VN')} đ</span>
                </div>
                <div style="flex:1; text-align:center; display:flex; gap:5px; align-items:center; justify-content:center;">
                    <button onclick="changeQty('${name}', -1)" style="padding:2px 8px; cursor:pointer; border:1px solid #444; background:#2a2a2a; color:#fff; font-weight:bold; border-radius:3px;">-</button>
                    <span style="font-size:14px; font-weight:bold; min-width:20px; color:#fff;">${item.qty}</span>
                    <button onclick="changeQty('${name}', 1)" style="padding:2px 8px; cursor:pointer; border:1px solid #444; background:#2a2a2a; color:#fff; font-weight:bold; border-radius:3px;">+</button>
                </div>
                <div style="flex:1; text-align:right; font-weight:bold; color:#fff; font-size:14px;">
                    ${itemSumPrice.toLocaleString('vi-VN')} đ
                </div>
            `;
            itemsContainer.appendChild(row);
        }
    }

    document.getElementById('modal-subtotal').innerText = cartData.totalPrice.toLocaleString('vi-VN') + ' VNĐ';
    document.getElementById('modal-total').innerText = cartData.totalPrice.toLocaleString('vi-VN') + ' VNĐ';
    modal.style.display = 'flex';
}

// Hàm đóng bảng popup kiểm tra giỏ hàng
function closeCartModal() {
    document.getElementById('cart-modal').style.display = 'none';
}

// Hàm tăng giảm số lượng sản phẩm trực tiếp trong bảng kiểm tra
function changeQty(name, amount) {
    if (cartData.items[name]) {
        cartData.items[name].qty += amount;
        if (cartData.items[name].qty <= 0) {
            delete cartData.items[name];
        }
        recalculateCart();
        openCartModal();
    }
}

// Hàm nút hành động khi bấm "Tiến Hành Thanh Toán"
function checkoutAction() {
    if (cartData.totalQty === 0) {
        alert('Giỏ hàng của bạn đang trống, không thể thực hiện thanh toán!');
        return;
    }
    alert(`🎉 ĐẶT HÀNG THÀNH CÔNG!\n\nCảm ơn bạn đã mua sắm tại HuyTruong Sports.\nTổng hóa đơn của bạn là: ${cartData.totalPrice.toLocaleString('vi-VN')} VNĐ.\nChuyên viên của shop sẽ liên hệ giao hàng sớm nhất!`);
    clearCart();
    closeCartModal();
}

// Hàm làm sạch giỏ hàng
function clearCart() {
    cartData = { items: {}, totalQty: 0, totalPrice: 0 };
    localStorage.setItem('gym_cart_advanced', JSON.stringify(cartData));
    updateCartUI();
    if (document.getElementById('cart-modal').style.display === 'flex') {
        openCartModal();
    }
}

// Tự động hiển thị dữ liệu chi tiết trang detail.html khi load trang
document.addEventListener("DOMContentLoaded", function () {
    updateCartUI();

    const params = new URLSearchParams(window.location.search);
    const product = params.get('product');

    const imgEl = document.getElementById('detail-img');
    const titleEl = document.getElementById('detail-title');
    const priceEl = document.getElementById('detail-price');
    const descEl = document.getElementById('detail-desc');

    if (!imgEl) return; 

    if (product === 'dai-lung') {
        imgEl.src = '../assets/dailung.jpg';
        titleEl.innerText = 'Đai Lưng Tập Tạ Cao Cấp';
        priceEl.innerText = '250.000 VNĐ';
        descEl.innerText = 'Đai lưng bảo vệ cột sống thắt lưng chắc chắn, hỗ trợ lực tối đa cho các bài tập gánh tạ nặng (Squat, Deadlift). Chất da êm ái, độ bền vượt trội.';
    } else if (product === 'lan-bung') {
        imgEl.src = '../assets/lanbung.webp'; 
        titleEl.innerText = 'Con Lăn Tập Bụng Siêu Tốc';
        priceEl.innerText = '180.000 VNĐ';
        descEl.innerText = 'Thiết kế bánh xe thông minh chống trượt, tay cầm bọc mút bám tay cực tốt. Giúp tăng cường sức mạnh vùng cơ lõi (Core) và làm săn chắc cơ bụng nhanh chóng.';
    } else if (product === 'khang-luc') {
        imgEl.src = '../assets/khangluc.jpg';
        titleEl.innerText = 'Dây Kháng Lực Đa Năng';
        priceEl.innerText = '150.000 VNĐ';
        descEl.innerText = 'Sản phẩm hoàn hảo cho các bài tập bổ trợ tại nhà hoặc phòng gym. Nhiều mức lực co giãn giúp tác động sâu vào các nhóm cơ mông, đùi và vai.';
    } else if (product === 'parallettes') {
        imgEl.src = '../assets/para.jpg';
        titleEl.innerText = 'Dụng Cụ Parallettes Gỗ';
        priceEl.innerText = '350.000 VNĐ';
        descEl.innerText = 'Làm từ chất liệu gỗ tự nhiên cao cấp, mài nhẵn bám tay tuyệt đối. Phụ kiện không thể thiếu đối với các tín đồ tập Calisthenics, Street Workout (Handstand, L-sit, Push-up).';
    }
});