import { useCart as useLibCart } from '@/lib/CartContext';

export function useCart() {
  const {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    itemCount,
  } = useLibCart();

  const mappedItems = (items ?? []).map((it) => ({
    id: it.product_id,
    name: it.product_name,
    price: Number(it.price) || 0,
    qty: Number(it.quantity) || 0,
    image: it.product_image || '',
    color: it.color || '',
  }));

  const findColor = (productId) => {
    const hit = (items ?? []).find((i) => i.product_id === productId);
    return hit?.color || '';
  };

  const updateQty = (productId, nextQty) => updateQuantity(productId, findColor(productId), nextQty);
  const removeFromCart = (productId) => removeItem(productId, findColor(productId));
  const addToCart = (product) => addItem(product, 1, '');

  return {
    items: mappedItems,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    total: Number(subtotal) || 0,
    count: Number(itemCount) || 0,
  };
}

