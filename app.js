// ==============================================
// 菜品数据（泡馍店）
// ==============================================
const foodData = [
  // 热门推荐
  {
    id: 1,
    name: "牛羊肉泡馍",
    price: 20.00,
    desc: "陕西特色 鲜香入味",
    img: "./images/paomo.png",
    category: "hot"
  },
  {
    id: 2,
    name: "小炒泡馍",
    price: 20.00,
    desc: "酸辣爽口 地道风味",
    img: "./images/xiaochao.png",
    category: "hot"
  },

  // 主食
  {
    id: 3,
    name: "炒细面",
    price: 11.00,
    desc: "劲道细面 家常口味",
    img: "./images/chaoximian.png",
    category: "staple"
  },
  {
    id: 4,
    name: "炒拉条",
    price: 11.00,
    desc: "西北特色 香辣过瘾",
    img: "./images/chaolatiao.png",
    category: "staple"
  },
  {
    id: 5,
    name: "炒饭",
    price: 11.00,
    desc: "粒粒分明 香气扑鼻",
    img: "./images/chaofan.png",
    category: "staple"
  },
  {
    id: 6,
    name: "手工饺子",
    price: 20.00,
    desc: "现包水饺 20元/斤",
    img: "./images/shuijiao.png",
    category: "staple"
  },

  // 小吃/凉菜
  {
    id: 7,
    name: "素拼",
    price: 10.00,
    desc: "新鲜时蔬 爽口解腻",
    img: "./images/supin.png",
    category: "snack"
  },

  // 饮品
  {
    id: 8,
    name: "冰峰",
    price: 3.00,
    desc: "经典汽水 冰镇口感",
    img: "./images/bingfeng.png",
    category: "drink"
  },
  {
    id: 9,
    name: "酸梅汤",
    price: 3.00,
    desc: "古法熬制 解辣解暑",
    img: "./images/suanmeitang.png",
    category: "drink"
  },
  {
    id: 10,
    name: "小木屋",
    price: 4.00,
    desc: "果味饮料 冰镇更佳",
    img: "./images/xiaomuwu.png",
    category: "drink"
  },
  {
    id: 11,
    name: "干啤",
    price: 4.00,
    desc: "清爽啤酒 冰镇爽口",
    img: "./images/ganpi.png",
    category: "drink"
  },
  {
    id: 12,
    name: "九度",
    price: 4.00,
    desc: "陕西特色啤酒 口感醇厚",
    img: "./images/jiudu.png",
    category: "drink"
  }
];

// ==============================================
// 购物车功能
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
          <!-- 标红加号按钮：红色+号 + 白色背景 + 红色边框 -->
          <button onclick="addCart(${food.id})" class="bg-white text-red-600 w-8 h-8 rounded-full flex items-center justify-center border-2 border-red-600 shadow-sm hover:bg-red-50 transition-all">
            <span class="text-lg font-bold">+</span>
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

// 更新购物车（角标核心逻辑）
function updateCart() {
  localStorage.setItem('orderCart', JSON.stringify(cart));
  // 计算购物车总数量（角标显示的数字）
  const count = cart.reduce((sum, item) => sum + item.count, 0);
  // 计算总价
  const total = cart.reduce((sum, item) => sum + (item.price * item.count), 0).toFixed(2);

  // 同步更新所有角标
  cartCount.textContent = count;
  mobileCartCount.textContent = count;
  modalCartCount.textContent = count;

  // 同步更新总价
  pcTotal.textContent = total;
  modalTotal.textContent = total;

  // 重新渲染购物车列表
  renderCartItems();

  // 禁用/启用结算按钮
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