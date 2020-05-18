/* eslint-disable no-console */
import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // await AsyncStorage.clear();
      let listOfProducts = [];
      const response = await AsyncStorage.getItem('@GoMarketplace');
      if (response) {
        listOfProducts = await JSON.parse(response);
      }
      setProducts(listOfProducts);
      // await AsyncStorage.getItem('@GoMarketplace', (error, result) => {
      //   result && console.log(JSON.parse(result));
      //   error && console.log(error);
      // });
    }
    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      const productsToIncrement = products.map(element => {
        if (element.id === id) {
          const elementToIncrement = { ...element };
          elementToIncrement.quantity += 1;
          return elementToIncrement;
        }
        return element;
      });
      setProducts(productsToIncrement);
      await AsyncStorage.setItem(
        '@GoMarketplace',
        JSON.stringify(productsToIncrement),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productsToDecrement = Array.from(products, element => {
        if (element.id === id) {
          // eslint-disable-next-line no-param-reassign
          element.quantity -= 1;
          return element;
        }
        return element;
      });

      const productsNoZeros = productsToDecrement.filter(
        element => element.quantity > 0,
      );
      setProducts(productsNoZeros);
      await AsyncStorage.setItem(
        '@GoMarketplace',
        JSON.stringify(productsNoZeros),
      );
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      if (products.find(element => element.id === product.id)) {
        increment(product.id);
      } else {
        const newProduct = { ...product, quantity: 1 };
        setProducts([...products, newProduct]);
        await AsyncStorage.setItem(
          '@GoMarketplace',
          JSON.stringify([...products, newProduct]),
        );
      }
    },
    [products, increment],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
