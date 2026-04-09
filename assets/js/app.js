import { formatPrice, calcTotal, renderStars, formatSales, debounce, validatePhone } from './utils.js';

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

let orderList = [];
let currentCategory = "all";
let currentFoodId = null;

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

function renderFood() {
    const filteredFood = currentCategory === "all"
        ? foodData
        : foodData.filter(item => item.category === currentCategory);

    foodListDom.innerHTML = filteredFood.map(item => `
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
          <button class="minus" data-id="${item.id}" ${getCountById(item.id) === 0 ? 'disabled' : ''}>-</button>
          <span class="count">${getCountById(item.id)}</span>
          <button class="plus" data-id="${item.id}" ${getCountById(item.id) >= item.stock ? 'disabled' : ''}>+</button>
        </div>
      </div>
    </div>
  `).join("");

    bindFoodEvent();
}

function getCountById(id) {
    const item = orderList.find(item => item.id === id);
    return item ? item.count : 0;
}

function bindFoodEvent() {
    document.querySelectorAll(".plus").forEach(btn => {
        btn.addEventListener("click", debounce(function() {
            const id = +this.dataset.id;
            const foodCard = this.closest(".food-card");
            const countDom = foodCard.querySelector(".count");
            const currentCount = +countDom.textContent;
            const food = foodData.find(item => item.id === id);

            if (currentCount < food.stock) {
                countDom.textContent = currentCount + 1;
                foodCard.classList.add("add-cart-animate");
                setTimeout(() => {
                    foodCard.classList.remove("add-cart-animate");
                }, 500);
                foodCard.querySelector(".minus").disabled = false;
                if (currentCount + 1 >= food.stock) {
                    this.disabled = true;
                }
                updateOrder();
            }
        }));
    });

    document.querySelectorAll(".minus").forEach(btn => {
        btn.addEventListener("click", debounce(function() {
            const id = +this.dataset.id;
            const foodCard = this.closest(".food-card");
            const countDom = foodCard.querySelector(".count");
            const currentCount = +countDom.textContent;
            const food = foodData.find(item => item.id === id);

            if (currentCount > 0) {
                countDom.textContent = currentCount - 1;
                foodCard.querySelector(".plus").disabled = false;
                if (currentCount - 1 === 0) {
                    this.disabled = true;
                }
                updateOrder();
            }
        }));
    });

    document.querySelectorAll(".food-card").forEach(card => {
        card.addEventListener("click", function(e) {
            if (e.target.closest(".favorite") || e.target.closest(".count-control")) {
                return;
            }
            const id = +this.dataset.id;
            currentFoodId = id;
            showFoodDetail(id);
        });
    });

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

    document.querySelector(".btn-add-cart").onclick = function() {
        const foodCard = document.querySelector(`.food-card[data-id="${id}"]`);
        const plusBtn = foodCard.querySelector(".plus");
        if (!plusBtn.disabled) {
            plusBtn.click();
        }
        hideModal(foodDetailModal);
    };
}

function hideModal(modal) {
    modal.classList.remove("show");
    overlay.classList.remove("show");
}

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

function renderOrder() {
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

    orderListDom.innerHTML = orderList.map(item => `
    <div class="order-item" data-id="${item.id}">
      <div class="item-info">
        <span>${item.name} × ${item.count}</span>
      </div>
      <div class="item-actions">
        <span>${formatPrice(item.price * item.count)}</span>
        <span class="delete-item" data-id="${item.id}"><i class="bi bi-x-circle"></i></span>
      </div>
    </div>
  `).join("");

    document.querySelectorAll(".delete-item").forEach(btn => {
        btn.addEventListener("click", function() {
            const id = +this.dataset.id;
            const foodCard = document.querySelector(`.food-card[data-id="${id}"]`);
            foodCard.querySelector(".count").textContent = 0;
            foodCard.querySelector(".minus").disabled = true;
            foodCard.querySelector(".plus").disabled = false;
            updateOrder();
        });
    });

    totalPriceDom.textContent = formatPrice(calcTotal(orderList));
}

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

function bindOrderEvent() {
    document.querySelector(".clear-btn").addEventListener("click", () => {
        if (orderList.length === 0) return;
        if (confirm("确定要清空订单吗？")) {
            document.querySelectorAll(".count").forEach(c => c.textContent = 0);
            document.querySelectorAll(".minus").forEach(btn => btn.disabled = true);
            document.querySelectorAll(".plus").forEach(btn => btn.disabled = false);
            updateOrder();
        }
    });

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

        document.querySelectorAll(".count").forEach(c => c.textContent = 0);
        document.querySelectorAll(".minus").forEach(btn => btn.disabled = true);
        document.querySelectorAll(".plus").forEach(btn => btn.disabled = false);
        updateOrder();
        hideModal(submitModal);
        contactPhoneInput.value = "";
    });
}

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

window.onload = () => {
    renderFood();
    bindCategoryEvent();
    bindOrderEvent();
    bindModalCloseEvent();
};