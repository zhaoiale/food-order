// ==============================================
// ✅ 菜品数据：在这里添加菜品、替换图片、修改价格
// ==============================================
const foodData = [
  { 
    id: 1, 
    name: "招牌汉堡", 
    price: 28.00, 
    desc: "多汁牛肉+芝士", 
    img: "https://picsum.photos/seed/burger/300/200",  // 替换这里的链接改图片
    category: "hot" 
  },
  { 
    id: 2, 
    name: "香辣炸鸡", 
    price: 32.00, 
    desc: "外酥里嫩", 
    img: "https://picsum.photos/seed/chicken/300/200", 
    category: "hot" 
  },
  { 
    id: 3, 
    name: "芝士披萨", 
    price: 45.00, 
    desc: "意式薄底", 
    img: "https://picsum.photos/seed/pizza/300/200", 
    category: "staple" 
  },
  { 
    id: 4, 
    name: "原味薯条", 
    price: 12.00, 
    desc: "酥脆可口", 
    img: "https://picsum.photos/seed/fries/300/200", 
    category: "snack" 
  },
  { 
    id: 5, 
    name: "冰可乐", 
    price: 8.00, 
    desc: "冰镇解暑", 
    img: "https://picsum.photos/seed/cola/300/200", 
    category: "drink" 
  },
  { 
    id: 6, 
    name: "草莓冰淇淋", 
    price: 18.00, 
    desc: "奶香浓郁", 
    img: "https://picsum.photos/seed/icecream/300/200", 
    category: "dessert" 
  }
];

// ==============================================
// 购物车功能（无需修改）
// ==============================================
let cart = JSON.parse(localStorage.getItem('orderCart')) || [];

// DOM元素
const foodList = document.getElementById('food-list');
const cartCount = document.getElementById('cart-count');
const mobileCartCount = document.getElementById('mobile-cart-count');
const modalCartCount = document.getElementById('modal-cart-count');
const pcCartItems = document.getElementById('pc-cart-items');
const mobileCartItems = document.getElementById('mobile-cart-items');
const pcTotal = document.getElementById('pc-total');
const modalTotal = document.getElementById('modal-total');
const checkoutBtn = document.getElementById('checkout-btn');
const modalCheckoutBtn = document.getElementById('modal-checkout-btn');
const mobileCartModal = document.getElementById('mobile-cart-modal');
const mobileCartBtn = document.getElementById('mobile-cart-btn');
const closeModal = document.getElementById('close-modal');
const successModal = document.getElementById('success-modal');
const closeSuccess = document.getElementById('close-success');
const categoryBtns = document.querySelectorAll('.category-btn');

// 渲染菜品列表
function renderFoodList(category = 'all') {
  let filterFood = foodData;
  if (category !== 'all') {
    filterFood = foodData.filter(item => item.category === category);
  }
  foodList.innerHTML = filterFood.map(food => `
    <div class="bg-white rounded-xl overflow-hidden shadow card-hover">
      <img src="${food.img}" alt="${food.name}" class="w-full h-40 object-cover">
      <div class="p-3">
        <h3 class="font-bold text-lg">${food.name}</h3>
        <p class="text-gray text-sm mb-2">${food.desc}</p>
        <div class="flex justify-between items-center">
          <span class="text-primary font-bold text-lg">¥${food.price.toFixed(2)}</span>
          <button onclick="addCart(${food.id})" class="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
            <i class="fa-solid-plus"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// 加入购物车
window.addCart = function(foodId) {
  const food = foodData.find(item => item.id === foodId);
  const index = cart.findIndex(item => item.id === foodId);
  if (index > -1) {
    cart[index].count++;
  } else {
    cart.push({...food, count: 1});
  }
  updateCart();
}

// 修改购物车数量
window.changeCount = function(foodId, type) {
  const index = cart.findIndex(item => item.id === foodId);
  if (type === 'minus') {
    cart[index].count--;
    if (cart[index].count === 0) cart.splice(index, 1);
  } else {
    cart[index].count++;
  }
  updateCart();
}

// 更新购物车
function updateCart() {
  localStorage.setItem('orderCart', JSON.stringify(cart));
  const count = cart.reduce((sum, item) => sum + item.count, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.count), 0).toFixed(2);
  
  cartCount.textContent = count;
  mobileCartCount.textContent = count;
  modalCartCount.textContent = count;
  pcTotal.textContent = total;
  modalTotal.textContent = total;
  renderCartItems();
  
  checkoutBtn.disabled = cart.length === 0;
  modalCheckoutBtn.disabled = cart.length === 0;
}

// 渲染购物车
function renderCartItems() {
  if (cart.length === 0) {
    pcCartItems.innerHTML = '<p class="text-gray text-center py-6">购物车为空</p>';
    mobileCartItems.innerHTML = '<p class="text-gray text-center py-6">购物车为空</p>';
    return;
  }
  const html = cart.map(item => `
    <div class="flex justify-between items-center border-b pb-2">
      <div class="flex-1">
        <p class="font-medium">${item.name}</p>
        <p class="text-primary text-sm">¥${item.price.toFixed(2)}</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="changeCount(${item.id}, 'minus')" class="w-6 h-6 rounded border flex items-center justify-center">-</button>
        <span>${item.count}</span>
        <button onclick="changeCount(${item.id}, 'plus')" class="w-6 h-6 rounded border flex items-center justify-center">+</button>
      </div>
    </div>
  `).join('');
  pcCartItems.innerHTML = html;
  mobileCartItems.innerHTML = html;
}

// 分类切换
categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    categoryBtns.forEach(b => b.classList.remove('active', 'bg-primary', 'text-white'));
    btn.classList.add('active', 'bg-primary', 'text-white');
    renderFoodList(btn.dataset.category);
  });
});

// 弹窗控制
mobileCartBtn.addEventListener('click', () => mobileCartModal.classList.remove('hidden'));
closeModal.addEventListener('click', () => mobileCartModal.classList.add('hidden'));
checkoutBtn.addEventListener('click', () => successModal.classList.remove('hidden'));
modalCheckoutBtn.addEventListener('click', () => successModal.classList.remove('hidden'));
closeSuccess.addEventListener('click', () => {
  successModal.classList.add('hidden');
  cart = [];
  updateCart();
});

// 初始化
renderFoodList();
updateCart();