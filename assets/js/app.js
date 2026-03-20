import { formatPrice, calcTotal } from './utils.js';

// ===================== 你的菜品数据（自动匹配你的图片） =====================
const foodData = [
    { id: 1, name: "招牌炒饭", price: 18, img: "assets/images/chaofan.png" },
    { id: 2, name: "炒细面", price: 15, img: "assets/images/chaoximian.png" },
    { id: 3, name: "手工水饺", price: 20, img: "assets/images/shuijiao.png" },
    { id: 4, name: "酸梅汤", price: 8, img: "assets/images/suanmeitang.png" },
    { id: 5, name: "爆炒辣条", price: 10, img: "assets/images/chaolatiao.png" },
    { id: 6, name: "凉皮", price: 12, img: "assets/images/ganpi.png" },
    { id: 7, name: "冰峰", price: 5, img: "assets/images/bingfeng.png" }
];

let orderList = [];

// 渲染菜品
function renderFood() {
    const box = document.querySelector(".food-list");
    box.innerHTML = foodData.map(item => `
    <div class="food-card" data-id="${item.id}">
      <img src="${item.img}" alt="${item.name}">
      <div class="food-info">
        <h3 class="food-name">${item.name}</h3>
        <div class="price">${formatPrice(item.price)}</div>
        <div class="count-control">
          <button class="minus">-</button>
          <span class="count">0</span>
          <button class="plus">+</button>
        </div>
      </div>
    </div>
  `).join("");
    bindFoodEvent();
}

// 菜品加减事件
function bindFoodEvent() {
    document.querySelectorAll(".plus").forEach(btn => {
        btn.addEventListener("click", () => {
            const num = btn.previousElementSibling;
            num.textContent = +num.textContent + 1;
            updateOrder();
        });
    });
    document.querySelectorAll(".minus").forEach(btn => {
        btn.addEventListener("click", () => {
            const num = btn.nextElementSibling;
            if (num.textContent > 0) num.textContent = +num.textContent - 1;
            updateOrder();
        });
    });
}

// 更新订单
function updateOrder() {
    orderList = [];
    document.querySelectorAll(".food-card").forEach(card => {
        const id = +card.dataset.id;
        const count = +card.querySelector(".count").textContent;
        if (count > 0) {
            const food = foodData.find(f => f.id === id);
            orderList.push({ ...food, count });
        }
    });
    renderOrder();
}

// 渲染订单
function renderOrder() {
    const dom = document.getElementById("orderList");
    const totalDom = document.querySelector(".total-price");

    if (orderList.length === 0) {
        dom.innerHTML = `<div class="empty-tip">暂无选中菜品</div>`;
        totalDom.textContent = "¥0.00";
        return;
    }

    dom.innerHTML = orderList.map(item => `
    <div class="order-item">
      <span>${item.name} × ${item.count}</span>
      <span>${formatPrice(item.price * item.count)}</span>
    </div>
  `).join("");
    totalDom.textContent = formatPrice(calcTotal(orderList));
}

// 清空/提交事件
function bindOrderEvent() {
    document.querySelector(".clear-btn").addEventListener("click", () => {
        document.querySelectorAll(".count").forEach(c => c.textContent = 0);
        updateOrder();
    });

    document.querySelector(".submit-btn").addEventListener("click", () => {
        if (orderList.length === 0) return alert("请选择菜品！");
        alert(`下单成功！总价：${formatPrice(calcTotal(orderList))}`);
        document.querySelectorAll(".count").forEach(c => c.textContent = 0);
        updateOrder();
    });
}

// 初始化
window.onload = () => {
    renderFood();
    bindOrderEvent();
};