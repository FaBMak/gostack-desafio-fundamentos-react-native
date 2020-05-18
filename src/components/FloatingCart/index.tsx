/* eslint-disable no-plusplus */
import React, { useState, useMemo } from 'react';

import { useNavigation } from '@react-navigation/native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import { getElementError } from '@testing-library/react-native';
import {
  Container,
  CartPricing,
  CartButton,
  CartButtonText,
  CartTotalPrice,
} from './styles';

import formatValue from '../../utils/formatValue';

import { useCart } from '../../hooks/cart';

// Calculo do total
// Navegação no clique do TouchableHighlight

const FloatingCart: React.FC = () => {
  const { products } = useCart();

  const navigation = useNavigation();

  const cartTotal = useMemo(() => {
    const somaCart = products.reduce((accumulator, element) => {
      let { quantity } = element;
      let sumProductQuantity = 0;
      while (quantity > 0) {
        sumProductQuantity += element.price;
        --quantity;
      }
      return accumulator + sumProductQuantity;
    }, 0);

    return formatValue(somaCart);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const totalProducts = products.reduce((accumulator, element) => {
      return accumulator + element.quantity;
    }, 0);
    return totalProducts;
  }, [products]);

  return (
    <Container>
      <CartButton
        testID="navigate-to-cart-button"
        onPress={() => navigation.navigate('Cart')}
      >
        <FeatherIcon name="shopping-cart" size={24} color="#fff" />
        <CartButtonText>{`${totalItensInCart} itens`}</CartButtonText>
      </CartButton>

      <CartPricing>
        <CartTotalPrice>{cartTotal}</CartTotalPrice>
      </CartPricing>
    </Container>
  );
};

export default FloatingCart;
