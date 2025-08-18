import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    const savedInventory = localStorage.getItem('simple-dough-inventory');
    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    } else {
      // Initialize inventory with default daily limits
      const initialInventory = {};
      PRODUCTS.forEach(product => {
        initialInventory[product.id] = {
          dailyLimit: 50, // Default daily limit
          currentStock: 50,
          soldToday: 0,
          lowStockAlert: 10
        };
      });
      setInventory(initialInventory);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('simple-dough-inventory', JSON.stringify(inventory));
  }, [inventory]);

  const updateDailyLimit = (productId, limit) => {
    setInventory(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        dailyLimit: limit,
        currentStock: limit - (prev[productId]?.soldToday || 0)
      }
    }));
  };

  const recordSale = (productId, quantity) => {
    setInventory(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        currentStock: Math.max(0, prev[productId].currentStock - quantity),
        soldToday: prev[productId].soldToday + quantity
      }
    }));
  };

  const resetDailyInventory = () => {
    setInventory(prev => {
      const newInventory = {};
      Object.keys(prev).forEach(productId => {
        newInventory[productId] = {
          ...prev[productId],
          currentStock: prev[productId].dailyLimit,
          soldToday: 0
        };
      });
      return newInventory;
    });
  };

  const getProductStock = (productId) => {
    return inventory[productId]?.currentStock || 0;
  };

  const isProductAvailable = (productId, requestedQuantity = 1) => {
    const stock = getProductStock(productId);
    return stock >= requestedQuantity;
  };

  const getLowStockProducts = () => {
    return Object.entries(inventory).filter(([productId, data]) => 
      data.currentStock <= data.lowStockAlert
    ).map(([productId]) => productId);
  };

  const value = {
    inventory,
    updateDailyLimit,
    recordSale,
    resetDailyInventory,
    getProductStock,
    isProductAvailable,
    getLowStockProducts
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};