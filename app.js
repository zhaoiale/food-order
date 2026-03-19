// ==============================================
// 菜品数据（泡馍店）- 补充规格属性
// ==============================================
const foodData = [
  // 热门推荐
  {
    id: 1,
    name: "牛羊肉泡馍",
    price: 20.00,
    desc: "陕西特色 鲜香入味",
    img: "./images/paomo.png",
    category: "hot",
    spec: ["普通", "优质", "大碗"] // 新增规格
  },
  {
    id: 2,
    name: "小炒泡馍",
    price: 20.00,
    desc: "酸辣爽口 地道风味",
    img: "./images/xiaochao.png",
    category: "hot",
    spec: ["微辣", "中辣", "特辣"] // 新增规格
  },

  // 主食
  {
    id: 3,
    name: "炒细面",
    price: 11.00,
    desc: "劲道细面 家常口味",
    img: "./images/chaoximian.png",
    category: "staple",
    spec: ["原味", "加蛋", "加肉"] // 新增规格
  },
  {
    id: 4,
    name: "炒拉条",
    price: 11.00,
    desc: "西北特色 香辣过瘾",
    img: "./images/chaolatiao.png",
    category: "staple",
    spec: ["微辣", "中辣", "特辣"] // 新增规格
  },
  {
    id: 5,
    name: "炒饭",
    price: 11.00,
    desc: "粒粒分明 香气扑鼻",
    img: "./images/chaofan.png",
    category: "staple",
    spec: ["蛋炒饭", "肉丝炒饭", "什锦炒饭"] // 新增规格
  },
  {
    id: 6,
    name: "手工饺子",
    price: 20.00,
    desc: "现包水饺 20元/斤",
    img: "./images/shuijiao.png",
    category: "staple",
    spec: ["韭菜猪肉", "白菜猪肉", "三鲜"] // 新增规格
  },

  // 小吃/凉菜
  {
    id: 7,
    name: "素拼",
    price: 10.00,
    desc: "新鲜时蔬 爽口解腻",
    img: "./images/supin.png",
    category: "snack",
    spec: ["微辣", "不辣", "多醋"] // 新增规格
  },

  // 饮品
  {
    id: 8,
    name: "冰峰",
    price: 3.00,
    desc: "经典汽水 冰镇口感",
    img: "./images/bingfeng.png",
    category: "drink",
    spec: ["常温", "冰镇"] // 新增规格
  },
  {
    id: 9,
    name: "酸梅汤",
    price: 3.00,
    desc: "古法熬制 解辣解暑",
    img: "./images/suanmeitang.png",
    category: "drink",
    spec: ["常温", "冰镇", "加冰"] // 新增规格
  },
  {
    id: 10,
    name: "小木屋",
    price: 4.00,
    desc: "果味饮料 冰镇更佳",
    img: "./images/xiaomuwu.png",
    category: "drink",
    spec: ["菠萝味", "橙味", "冰镇"] // 新增规格
  },
  {
    id: 11,
    name: "干啤",
    price: 4.00,
    desc: "清爽啤酒 冰镇爽口",
    img: "./images/ganpi.png",
    category: "drink",
    spec: ["常温", "冰镇"] // 新增规格
  },
  {
    id: 12,
    name: "九度",
    price: 4.00,
    desc: "陕西特色啤酒 口感醇厚",
    img: "./images/jiudu.png",
    category: "drink",
    spec: ["常温", "冰镇"] // 新增规格
  }
];

// ==============================================
// 购物车功能
// ==============================================
// 修复重复声明cart的问题
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let currentFood = null;

// DOM元素
const foodList = document.getElementById("food-list");
const searchInput = document.getElementById("search-input");
const categoryBtns = document.querySelectorAll(".category-btn");
const loading = document.getElementById("loading");
const emptyFood = document.getElementById("empty-food");
const specModal = document.getElementById("spec-modal");
const specFoodName = document.getElementById("spec-food-name");
const specPrice = document.getElementById("spec-price");
const specOptions = document.getElementById("spec-options");
const specCount = document.getElementById("spec-count");
const specMinus = document.getElementById("spec-minus");
const specPlus = document.getElementById("spec-plus");
const specConfirm = document.getElementById("spec-confirm");
const closeSpec = document.getElementById("close-spec");
const backTop = document.getElementById("backTop");

// 初始化页面
window.addEventListener("DOMContentLoaded", () => {
  renderFoodList(foodData);
  updateCartUI();
  loading.style.display = "none";

  // ===== 核心修复：确保所有弹窗按钮事件正确绑定 =====
  bindModalEvents();
});

// 绑定所有弹窗事件（统一管理，避免绑定失效）
function bindModalEvents() {
  // 关闭规格弹窗
  closeSpec.addEventListener("click", () => {
    specModal.classList.add("hidden");
    specModal.style.display = "none"; // 重置display
  });

  // 关闭移动端购物车弹窗
  const closeModal = document.getElementById("close-modal");
  closeModal.addEventListener("click", () => {
    const mobileCartModal = document.getElementById("mobile-cart-modal");
    mobileCartModal.classList.add("hidden");
    mobileCartModal.style.display = "none"; // 重置display
  });

  // 关闭下单成功弹窗（核心修复点）
  const closeSuccess = document.getElementById("close-success");
  closeSuccess.addEventListener("click", () => {
    const successModal = document.getElementById("success-modal");
    successModal.classList.add("hidden");
    successModal.style.display = "none"; // 重置display，解决点击无响应
  });
}

// 渲染菜品列表 - 修复图片显示、完善卡片结构
function renderFoodList(list) {
  if (list.length === 0) {
    emptyFood.classList.remove("hidden");
    return;
  }
  emptyFood.classList.add("hidden");
  foodList.innerHTML = list.map(item => `
    <div class="food-card" onclick="openSpec(${item.id})">
      <img src="${item.img}" alt="${item.name}" class="food-img">
      <div class="food-info">
        <h3 class="food-title">${item.name}</h3>
        <p class="text-gray-600 text-sm mb-2">${item.desc}</p>
        <p class="food-price">¥${item.price.toFixed(2)}</p>
        <button class="mt-2 w-full bg-[#ff6b35] text-white py-1 rounded text-sm">点单</button>
      </div>
    </div>
  `).join("");
}

// 搜索功能
searchInput.addEventListener("input", (e) => {
  const key = e.target.value.toLowerCase().trim();
  const filtered = foodData.filter(item => item.name.toLowerCase().includes(key));
  renderFoodList(filtered);
});

// 分类筛选
categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const cate = btn.dataset.category;
    const filtered = cate === "all" ? foodData : foodData.filter(item => item.category === cate);
    renderFoodList(filtered);
  });
});

// 打开规格弹窗
function openSpec(id) {
  currentFood = foodData.find(item => item.id === id);
  if (!currentFood) return; // 容错处理

  specFoodName.textContent = currentFood.name;
  specPrice.textContent = currentFood.price.toFixed(2);
  specCount.value = 1;

  // 渲染规格选项，默认选中第一个
  specOptions.innerHTML = currentFood.spec.map((s, idx) => `
    <div class="spec-item ${idx === 0 ? 'active' : ''}" data-spec="${s}">${s}</div>
  `).join("");

  // 规格选择事件
  document.querySelectorAll(".spec-item").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".spec-item").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  specModal.classList.remove("hidden");
  specModal.style.display = "flex"; // 显式设置flex
}

// 规格数量调整
specMinus.addEventListener("click", () => {
  if (specCount.value > 1) {
    specCount.value = Number(specCount.value) - 1;
  }
});
specPlus.addEventListener("click", () => {
  specCount.value = Number(specCount.value) + 1;
});

// 加入购物车
specConfirm.addEventListener("click", () => {
  const specActive = document.querySelector(".spec-item.active");
  if (!specActive) return alert("请选择规格");
  if (!currentFood) return;

  const item = {
    id: currentFood.id,
    name: currentFood.name,
    spec: specActive.dataset.spec,
    price: currentFood.price,
    count: Number(specCount.value)
  };

  // 检查是否已存在相同规格的菜品
  const index = cart.findIndex(i => i.id === item.id && i.spec === item.spec);
  if (index >= 0) {
    cart[index].count += item.count;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
  specModal.classList.add("hidden");
  specModal.style.display = "none"; // 关闭时重置display
  alert(`${item.name}(${item.spec}) × ${item.count} 已加入购物车`);
});

// 更新购物车UI - 优化结算按钮禁用状态、同步备注
function updateCartUI() {
  const total = cart.reduce((sum, i) => sum + i.price * i.count, 0);
  const count = cart.reduce((sum, i) => sum + i.count, 0);

  // 更新数量和总价
  document.getElementById("pc-total").textContent = total.toFixed(2);
  document.getElementById("modal-total").textContent = total.toFixed(2);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("mobile-cart-count").textContent = count;
  document.getElementById("modal-cart-count").textContent = count;

  // 更新购物车列表
  const renderCart = (el) => {
    if (cart.length === 0) return `<p class="text-gray-500 text-center py-6">购物车为空</p>`;
    return cart.map((item, idx) => `
      <div class="cart-item">
        <div class="cart-name">${item.name}(${item.spec})</div>
        <div class="cart-quantity">
          <button onclick="changeCart(${idx}, -1)" ${item.count <= 1 ? 'disabled' : ''}>-</button>
          <span>${item.count}</span>
          <button onclick="changeCart(${idx}, 1)">+</button>
        </div>
        <span>¥${(item.price * item.count).toFixed(2)}</span>
      </div>
    `).join("");
  };

  document.getElementById("pc-cart-items").innerHTML = renderCart();
  document.getElementById("mobile-cart-items").innerHTML = renderCart();

  // 同步备注内容
  const pcNote = document.getElementById("order-note");
  const mobileNote = document.getElementById("mobile-order-note");
  pcNote.addEventListener("input", () => {
    mobileNote.value = pcNote.value;
  });
  mobileNote.addEventListener("input", () => {
    pcNote.value = mobileNote.value;
  });

  // 控制结算按钮禁用状态
  const checkoutBtn = document.getElementById("checkout-btn");
  const modalCheckoutBtn = document.getElementById("modal-checkout-btn");
  if (cart.length > 0) {
    checkoutBtn.removeAttribute("disabled");
    modalCheckoutBtn.removeAttribute("disabled");
  } else {
    checkoutBtn.setAttribute("disabled", "true");
    modalCheckoutBtn.setAttribute("disabled", "true");
  }
}

// 修改购物车数量 - 优化容错
function changeCart(index, num) {
  if (index < 0 || index >= cart.length) return;

  cart[index].count += num;
  if (cart[index].count <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

// 移动端购物车弹窗
const mobileCartBtn = document.getElementById("mobile-cart-btn");
const mobileCartModal = document.getElementById("mobile-cart-modal");
mobileCartBtn.addEventListener("click", () => {
  mobileCartModal.classList.remove("hidden");
  mobileCartModal.style.display = "flex"; // 显式设置flex
});

// 点击弹窗外部关闭
mobileCartModal.addEventListener("click", (e) => {
  if (e.target === mobileCartModal) {
    mobileCartModal.classList.add("hidden");
    mobileCartModal.style.display = "none";
  }
});
specModal.addEventListener("click", (e) => {
  if (e.target === specModal) {
    specModal.classList.add("hidden");
    specModal.style.display = "none";
  }
});

// 结算功能
document.getElementById("checkout-btn").addEventListener("click", checkout);
document.getElementById("modal-checkout-btn").addEventListener("click", checkout);

function checkout() {
  if (cart.length === 0) return alert("购物车为空");

  // 获取订单备注
  const note = document.getElementById("order-note").value || document.getElementById("mobile-order-note").value;
  const orderInfo = {
    items: cart,
    total: cart.reduce((sum, i) => sum + i.price * i.count, 0),
    note: note || "无备注",
    time: new Date().toLocaleString()
  };

  // 模拟下单（可替换为真实接口请求）
  console.log("订单信息：", orderInfo);

  // 显示成功弹窗
  const successModal = document.getElementById("success-modal");
  successModal.classList.remove("hidden");
  successModal.style.display = "flex"; // 显式设置flex

  // 清空购物车
  cart = [];
  localStorage.removeItem("cart");
  updateCartUI();
  mobileCartModal.classList.add("hidden");
  mobileCartModal.style.display = "none";
}

// 返回顶部
window.addEventListener("scroll", () => {
  window.scrollY > 300 ? backTop.classList.add("show") : backTop.classList.remove("show");
});
backTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});