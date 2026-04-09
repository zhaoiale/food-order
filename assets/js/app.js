import { formatPrice, calcTotal, renderStars, formatSales, debounce, validatePhone } from './utils.js';

// 菜品数据（保持不变）
const foodData = [
    {
        id: 1,
        name: "招牌炒饭",
        price: 18,
        img: "assets/images/chaofan.png",
        category: "staple",
        desc: "精选东北大米，搭配鸡蛋、火腿、玉米粒、青豆，大火爆炒，粒粒分明，香气四溢！",
        rating: 4.8,
        sales: 1280,
        stock: 99,
        favorite: false
    },
    {
        id: 2,
        name: "炒细面",
        price: 15,
        img: "assets/images/chaoximian.png",
        category: "staple",
        desc: "手工细面，搭配豆芽、青菜、肉丝，秘制酱料翻炒，口感劲道，咸香适口！",
        rating: 4.6,
        sales: 890,
        stock: 99,
        favorite: false
    },
    {
        id: 3,
        name: "手工水饺",
        price: 20,
        img: "assets/images/shuijiao.png",
        category: "staple",
        desc: "每日现包水饺，皮薄馅大，韭菜猪肉/白菜猪肉两种口味可选，鲜香多汁！",
        rating: 4.9,
        sales: 1560,
        stock: 50,
        favorite: false
    },
    {
        id: 4,
        name: "酸梅汤",
        price: 8,
        img: "assets/images/suanmeitang.png",
        category: "drink",
        desc: "古法熬制酸梅汤，乌梅、山楂、甘草、冰糖调制，冰镇饮用，解腻消暑！",
        rating: 4.7,
        sales: 2100,
        stock: 88,
        favorite: false
    },
    {
        id: 5,
        name: "爆炒辣条",
        price: 10,
        img: "assets/images/chaolatiao.png",
        category: "snack",
        desc: "网红辣条搭配青椒、干辣椒爆炒，麻辣鲜香，追剧必备小零食！",
        rating: 4.5,
        sales: 980,
        stock: 76,
        favorite: false
    },
    {
        id: 6,
        name: "凉皮",
        price: 12,
        img: "assets/images/ganpi.png",
        category: "snack",
        desc: "陕西正宗凉皮，手工制作，搭配秘制辣椒油、香醋、麻酱，酸辣开胃！",
        rating: 4.8,
        sales: 1890,
        stock: 60,
        favorite: false
    },
    {
        id: 7,
        name: "冰峰",
        price: 5,
        img: "assets/images/bingfeng.png",
        category: "drink",
        desc: "西安经典汽水，橘子味碳酸饮料，冰镇饮用，口感清爽！",
        rating: 4.9,
        sales: 3200,
        stock: 100,
        favorite: false
    }
];

// 全局订单数据（简化，直接维护）
let orderList = [];
let currentCategory = "all";

// DOM元素（简化获取）
const foodListDom = document.querySelector(".food-list");
const orderListDom = document.getElementById("orderList");
const totalPriceDom = document.querySelector(".total-price");
const tabBtns = document.querySelectorAll(".tab-btn");
const foodDetailModal = document.getElementById("foodDetailModal");
const submitModal = document.getElementById("submitModal");
const overlay = document.getElementById("overlay");
const closeModalBtns = document.querySelectorAll(".close-modal");
const tableNumSelect = document.getElementById("tableNum");
const submitTableNumDom = document.getElementById("submitTableNum");
const submitOrderListDom = document.getElementById("submitOrderList");
const submitTotalPriceDom = document.getElementById("submitTotalPrice");
const contactPhoneInput = document.getElementById("contactPhone");
const confirmSubmitBtn = document.querySelector(".confirm-submit-btn");

// 渲染菜品（保持不变）
function renderFood() {
    const filteredFood = currentCategory === "all"
        ? foodData
        : foodData.filter(item => item.category === currentCategory);

    foodListDom.innerHTML = filteredFood.map(item => {
        // 先查当前菜品在订单中的数量
        const currentCount = orderList.find(o => o.id === item.id)?.count || 0;
        return `
        <div class="food-card" data-id="${item.id}">
          <div class="favorite ${item.favorite ? 'active' : ''}" data-id="${item.id}">
            <i class="bi ${item.favorite ? 'bi-heart-fill' : 'bi-heart'}"></i>
          </div>
          <img src="${item.img}" alt="${item.name}">
          <div class="food-info">
            <h3 class="food-name">${item.name}</h3>
            <div class="food-meta">
              <span class="stars">${renderStars(item.rating)}</span>
              <span class="sales">${formatSales(item.sales)}</span>
            </div>
            <div class="price">${formatPrice(item.price)}</div>
            <div class="count-control">
              <button class="minus" data-id="${item.id}" ${currentCount === 0 ? 'disabled' : ''}>-</button>
              <span class="count">${currentCount}</span>
              <button class="plus" data-id="${item.id}" ${currentCount >= item.stock ? 'disabled' : ''}>+</button>
            </div>
          </div>
        </div>
      `;
    }).join("");

    bindFoodEvent();
}

// 核心修复：添加菜品到订单
function addFoodToOrder(id) {
    const food = foodData.find(item => item.id === id);
    if (!food) return;

    // 检查是否已在订单中
    const existingItem = orderList.find(item => item.id === id);
    if (existingItem) {
        // 数量+1
        existingItem.count += 1;
    } else {
        // 新增订单项
        orderList.push({ ...food, count: 1 });
    }

    // 更新DOM和订单
    updateFoodCountDom(id);
    renderOrder();
}

// 核心修复：减少菜品数量
function minusFoodFromOrder(id) {
    const existingItem = orderList.find(item => item.id === id);
    if (!existingItem) return;

    // 数量-1
    existingItem.count -= 1;

    // 如果数量为0，从订单中删除
    if (existingItem.count === 0) {
        orderList = orderList.filter(item => item.id !== id);
    }

    // 更新DOM和订单
    updateFoodCountDom(id);
    renderOrder();
}

// 更新菜品卡片的数量显示
function updateFoodCountDom(id) {
    const foodCard = document.querySelector(`.food-card[data-id="${id}"]`);
    if (!foodCard) return;

    const countDom = foodCard.querySelector(".count");
    const minusBtn = foodCard.querySelector(".minus");
    const plusBtn = foodCard.querySelector(".plus");
    const currentCount = orderList.find(o => o.id === id)?.count || 0;
    const food = foodData.find(item => item.id === id);

    // 更新数量显示
    countDom.textContent = currentCount;
    // 更新按钮状态
    minusBtn.disabled = currentCount === 0;
    plusBtn.disabled = currentCount >= food.stock;

    // 加入购物车动画
    foodCard.classList.add("add-cart-animate");
    setTimeout(() => {
        foodCard.classList.remove("add-cart-animate");
    }, 500);
}

// 绑定菜品事件（修复点击逻辑）
function bindFoodEvent() {
    // 加号按钮（核心修复）
    document.querySelectorAll(".plus").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = +this.dataset.id;
            addFoodToOrder(id);
        });
    });

    // 减号按钮（核心修复）
    document.querySelectorAll(".minus").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = +this.dataset.id;
            minusFoodFromOrder(id);
        });
    });

    // 菜品卡片点击（打开详情）
    document.querySelectorAll(".food-card").forEach(card => {
        card.addEventListener("click", function(e) {
            if (e.target.closest(".favorite") || e.target.closest(".count-control")) {
                return;
            }
            const id = +this.dataset.id;
            showFoodDetail(id);
        });
    });

    // 收藏按钮
    document.querySelectorAll(".favorite").forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.stopPropagation();
            const id = +this.dataset.id;
            const food = foodData.find(item => item.id === id);
            food.favorite = !food.favorite;
            this.classList.toggle("active");
            this.innerHTML = `<i class="bi ${food.favorite ? 'bi-heart-fill' : 'bi-heart'}"></i>`;
        });
    });
}

// 显示菜品详情（保持不变）
function showFoodDetail(id) {
    const food = foodData.find(item => item.id === id);
    if (!food) return;

    document.getElementById("detailFoodImg").src = food.img;
    document.getElementById("detailFoodImg").alt = food.name;
    document.getElementById("detailFoodName").textContent = food.name;
    document.getElementById("detailFoodStars").innerHTML = renderStars(food.rating);
    document.getElementById("detailFoodSales").textContent = formatSales(food.sales);
    document.getElementById("detailFoodDesc").textContent = food.desc;
    document.getElementById("detailFoodPrice").textContent = formatPrice(food.price);
    document.getElementById("detailFoodStock").textContent = `库存：${food.stock}份`;

    foodDetailModal.classList.add("show");
    overlay.classList.add("show");

    // 详情页加入购物车
    document.querySelector(".btn-add-cart").onclick = function() {
        addFoodToOrder(id);
        hideModal(foodDetailModal);
    };
}

// 隐藏弹窗（保持不变）
function hideModal(modal) {
    modal.classList.remove("show");
    overlay.classList.remove("show");
}

// 核心修复：渲染订单（确保必显示）
function renderOrder() {
    // 清空订单区
    orderListDom.innerHTML = "";

    // 如果订单为空
    if (orderList.length === 0) {
        orderListDom.innerHTML = `
            <div class="empty-tip">
                <i class="bi bi-cart-x"></i>
                <p>暂无选中菜品</p>
            </div>
        `;
        totalPriceDom.textContent = "¥0.00";
        return;
    }

    // 渲染订单项（核心修复：确保循环正确）
    let orderHtml = "";
    orderList.forEach(item => {
        orderHtml += `
        <div class="order-item" data-id="${item.id}">
          <div class="item-info">
            <span>${item.name} × ${item.count}</span>
          </div>
          <div class="item-actions">
            <span>${formatPrice(item.price * item.count)}</span>
            <span class="delete-item" data-id="${item.id}"><i class="bi bi-x-circle"></i></span>
          </div>
        </div>
      `;
    });
    orderListDom.innerHTML = orderHtml;

    // 计算总价
    const total = calcTotal(orderList);
    totalPriceDom.textContent = formatPrice(total);

    // 订单项删除按钮
    document.querySelectorAll(".delete-item").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = +this.dataset.id;
            // 直接删除该菜品
            orderList = orderList.filter(item => item.id !== id);
            // 更新DOM
            updateFoodCountDom(id);
            renderOrder();
        });
    });
}

// 绑定分类标签（保持不变）
function bindCategoryEvent() {
    tabBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            tabBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            currentCategory = this.dataset.category;
            renderFood();
        });
    });
}

// 绑定订单事件（保持不变）
function bindOrderEvent() {
    // 清空订单
    document.querySelector(".clear-btn").addEventListener("click", () => {
        if (orderList.length === 0) return;
        if (confirm("确定要清空订单吗？")) {
            orderList = [];
            renderFood(); // 重新渲染菜品数量
            renderOrder();
        }
    });

    // 提交订单
    document.querySelector(".submit-btn").addEventListener("click", () => {
        if (orderList.length === 0) {
            alert("请选择菜品！");
            return;
        }

        submitTableNumDom.textContent = `${tableNumSelect.value}号桌`;
        submitOrderListDom.innerHTML = orderList.map(item => `
            <div class="order-item">
                <span>${item.name} × ${item.count}</span>
                <span>${formatPrice(item.price * item.count)}</span>
            </div>
        `).join("");
        submitTotalPriceDom.textContent = formatPrice(calcTotal(orderList));

        submitModal.classList.add("show");
        overlay.classList.add("show");
    });

    // 确认下单
    confirmSubmitBtn.addEventListener("click", () => {
        const phone = contactPhoneInput.value.trim();
        if (!validatePhone(phone)) {
            alert("请输入正确的手机号码！");
            return;
        }

        alert(`
            下单成功！
            桌号：${tableNumSelect.value}号桌
            联系电话：${phone || "未填写"}
            总价：${formatPrice(calcTotal(orderList))}
            感谢您的点餐，我们将尽快为您上菜！
        `);

        // 清空订单
        orderList = [];
        renderFood();
        renderOrder();
        hideModal(submitModal);
        contactPhoneInput.value = "";
    });
}

// 绑定弹窗关闭（保持不变）
function bindModalCloseEvent() {
    closeModalBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            hideModal(foodDetailModal);
            hideModal(submitModal);
        });
    });

    overlay.addEventListener("click", function() {
        hideModal(foodDetailModal);
        hideModal(submitModal);
    });

    document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") {
            hideModal(foodDetailModal);
            hideModal(submitModal);
        }
    });
}

// 初始化
window.onload = () => {
    renderFood();
    bindCategoryEvent();
    bindOrderEvent();
    bindModalCloseEvent();
};