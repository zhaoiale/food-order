// 价格格式化
export const formatPrice = (price) => {
    return `¥${Number(price).toFixed(2)}`;
};

// 计算总价
export const calcTotal = (list) => {
    return list.reduce((sum, item) => sum + item.price * item.count, 0);
};