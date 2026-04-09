export const formatPrice = (price) => {
    return `¥${Number(price).toFixed(2)}`;
};

export const calcTotal = (list) => {
    return list.reduce((sum, item) => sum + item.price * item.count, 0);
};

export const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
        stars.push('<i class="bi bi-star-fill"></i>');
    }

    if (hasHalfStar) {
        stars.push('<i class="bi bi-star-half"></i>');
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
        stars.push('<i class="bi bi-star"></i>');
    }

    return stars.join('');
};

export const formatSales = (sales) => {
    if (sales >= 1000) {
        return `销量 ${(sales / 1000).toFixed(1)}k+`;
    }
    return `销量 ${sales}+`;
};

export const debounce = (fn, delay = 300) => {
    let timer = null;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
};

export const validatePhone = (phone) => {
    if (!phone) return true;
    const reg = /^1[3-9]\d{9}$/;
    return reg.test(phone);
};