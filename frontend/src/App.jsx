import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import DiscoveryHub from './components/DiscoveryHub';
import TrustDashboard from './components/Dashboard/TrustDashboard';
import Sidebar from './components/Dashboard/sidebar';
import ProfileModal from './components/ProfileModal';
import NotificationModal from './components/NotificationModal';
import PostProductModal from './components/PostProductModal';
import CheckoutModal from './components/CheckoutModal';
import CartView from './components/CartView';
import AuthFlow from './components/AuthFlow';
import AdminManagementPanel from './components/AdminManagementPanel';
import OrdersPanel from './components/OrdersPanel';
import EditOrderModal from './components/EditOrderModal';
import './App.css';

import { initialProducts } from './components/Dashboard/homepage';
import {
  loadLocalState,
  saveLocalState,
  removeLocalState,
  getCartStorageKey,
  normalizeProfile,
} from './utils/appUtils';
import { exploreProducts } from './services/homeApi';

export default function App() {
  const [user, setUser] = useState(() => loadLocalState('currentUser', null));
  const [authView, setAuthView] = useState('login');
  const [activeView, setActiveView] = useState('explore');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => loadLocalState('greenCircleNotifications', []));
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [checkoutProduct, setCheckoutProduct] = useState(null);
  const [adminManagementOpen, setAdminManagementOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [ordersView, setOrdersView] = useState('our-products');
  const [activeOrderMenuId, setActiveOrderMenuId] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingOrderDatesText, setEditingOrderDatesText] = useState('');
  const [cartItems, setCartItems] = useState(() => {
    const currentUser = loadLocalState('currentUser', null);
    return loadLocalState(getCartStorageKey(currentUser), []);
  });
  const [orders, setOrders] = useState(() => loadLocalState('greenCircleOrders', []));
  const [statusMessage, setStatusMessage] = useState('');
  const [products, setProducts] = useState(() => {
    const storedProducts = loadLocalState('greenCircleProducts', null);
    if (!storedProducts || !Array.isArray(storedProducts) || storedProducts.length === 0) {
      return initialProducts;
    }

    const cleanedStoredProducts = storedProducts.filter((product) => {
      if (!product?.title) return true;
      return product.title.trim().toLowerCase() !== 'duke';
    });
    if (!cleanedStoredProducts.length) {
      return initialProducts;
    }

    const seededProductsById = initialProducts.reduce((map, item) => {
      map[item.id] = item;
      return map;
    }, {});

    return cleanedStoredProducts.map((product) => {
      const seed = seededProductsById[product.id];
      if (!seed) return product;
      return {
        ...product,
        imageUrl: seed.imageUrl,
      };
    });
  });

  useEffect(() => {
    const loadBackendProducts = async () => {
      try {
        const backendProducts = await exploreProducts();
        if (backendProducts?.length) {
          setProducts(backendProducts);
        }
      } catch (error) {
        console.warn('Unable to load backend products:', error);
      }
    };

    loadBackendProducts();
  }, []);

  useEffect(() => {
    saveLocalState('greenCircleProducts', products);
  }, [products]);

  const filteredProducts = selectedCategory === 'All'
    ? products.filter((item) => item.isActive !== false)
    : products.filter((item) => item.isActive !== false && item.category?.toLowerCase() === selectedCategory.toLowerCase());

  useEffect(() => {
    saveLocalState('greenCircleNotifications', notifications);
  }, [notifications]);

  useEffect(() => {
    saveLocalState('greenCircleOrders', orders);
  }, [orders]);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }
    setCartItems(loadLocalState(getCartStorageKey(user), []));
  }, [user?.email, user?.name]);

  useEffect(() => {
    if (!user) return;
    saveLocalState(getCartStorageKey(user), cartItems);
  }, [user?.email, user?.name, cartItems]);

  const visibleNotifications = notifications.filter((note) => {
    const ownerName = (note.ownerName || '').trim().toLowerCase();
    const currentName = (user?.name || '').trim().toLowerCase();
    return !ownerName || ownerName === currentName;
  });

  const unreadNotificationCount = visibleNotifications.filter((note) => note.status === 'Pending').length;
  const currentUserName = (user?.name || '').trim().toLowerCase();
  const currentUserEmail = (user?.email || '').trim().toLowerCase();

  const ourProductOrders = orders.filter((order) => {
    const ownerName = (order.productOwnerName || '').trim().toLowerCase();
    return !ownerName || ownerName === currentUserName;
  });

  const myBookedOrders = orders.filter((order) => {
    const customerName = (order.customerName || '').trim().toLowerCase();
    const customerEmail = (order.email || '').trim().toLowerCase();
    return customerName === currentUserName || customerEmail === currentUserEmail;
  });

  const postedProducts = products.filter((item) => {
    const ownerName = (item.adminName || item.ownerName || '').toLowerCase();
    return item.isActive !== false && ownerName && ownerName === (user?.name || '').toLowerCase();
  });

  const saveUserProfile = (profile) => {
    const normalizedProfile = normalizeProfile(profile);
    saveLocalState('currentUser', normalizedProfile);

    if (normalizedProfile.email) {
      const profiles = loadLocalState('userProfiles', {});
      profiles[normalizedProfile.email.toLowerCase()] = normalizedProfile;
      saveLocalState('userProfiles', profiles);
    }

    setUser(normalizedProfile);
  };

  const handleLogout = () => {
    setUser(null);
    setProfileOpen(false);
    setNotificationOpen(false);
    removeLocalState('currentUser');
  };

  const openNotifications = () => setNotificationOpen(true);
  const closeNotifications = () => setNotificationOpen(false);

  const approveNotification = (notificationId, responseMessage = '') => {
    const matchedNotification = notifications.find((note) => note.id === notificationId);
    const finalMessage = responseMessage.trim() || 'Your rental request has been confirmed by the owner.';

    setNotifications((existing) => existing.map((note) => (
      note.id !== notificationId ? note : { ...note, status: 'Confirmed', responseMessage: finalMessage }
    )));

    if (matchedNotification?.orderId) {
      const responseCreatedAt = new Date().toISOString();

      setOrders((existingOrders) => existingOrders.map((order) => (
        order.id !== matchedNotification.orderId
          ? order
          : { ...order, status: 'Confirmed', responseMessage: finalMessage, responseCreatedAt }
      )));

      setNotifications((existing) => [
        {
          id: Date.now() + 10,
          type: 'order-response',
          product: matchedNotification.product,
          customer: matchedNotification.customer,
          status: 'Confirmed',
          responseMessage: finalMessage,
          orderId: matchedNotification.orderId,
          ownerName: matchedNotification.customer,
          ownerDisplayName: user?.name || 'Owner',
          bookingDates: matchedNotification.bookingDates || [],
          createdAt: responseCreatedAt,
        },
        ...existing,
      ]);
    }

    setStatusMessage('Rental request confirmed for the customer.');
  };

  const rejectNotification = (notificationId, responseMessage = '') => {
    const matchedNotification = notifications.find((note) => note.id === notificationId);
    const finalMessage = responseMessage.trim() || 'Your rental request has been rejected by the owner.';

    setNotifications((existing) => existing.map((note) => (
      note.id !== notificationId ? note : { ...note, status: 'Rejected', responseMessage: finalMessage }
    )));

    if (matchedNotification?.orderId) {
      const responseCreatedAt = new Date().toISOString();

      setOrders((existingOrders) => existingOrders.map((order) => (
        order.id !== matchedNotification.orderId
          ? order
          : { ...order, status: 'Rejected', responseMessage: finalMessage, responseCreatedAt }
      )));

      setNotifications((existing) => [
        {
          id: Date.now() + 11,
          type: 'order-response',
          product: matchedNotification.product,
          customer: matchedNotification.customer,
          status: 'Rejected',
          responseMessage: finalMessage,
          orderId: matchedNotification.orderId,
          ownerName: matchedNotification.customer,
          ownerDisplayName: user?.name || 'Owner',
          bookingDates: matchedNotification.bookingDates || [],
          createdAt: responseCreatedAt,
        },
        ...existing,
      ]);
    }

    setStatusMessage('Rental request rejected for the customer.');
  };

  const openPostProduct = () => {
    setEditingProduct(null);
    setPostModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order, address: order.address || '', phone: order.phone || '' });
    setEditingOrderDatesText((order.bookingDates || []).join(', '));
    setActiveOrderMenuId(null);
  };

  const handleDeleteOrder = (orderId) => {
    setOrders((existingOrders) => existingOrders.filter((order) => order.id !== orderId));
    setActiveOrderMenuId(null);
    setStatusMessage('Booking removed from your orders.');
  };

  const handleSaveEditedOrder = (event) => {
    event.preventDefault();
    if (!editingOrder) return;

    const nextBookingDates = editingOrderDatesText
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    setOrders((existingOrders) => existingOrders.map((order) => (
      order.id !== editingOrder.id
        ? order
        : {
          ...order,
          address: editingOrder.address || order.address,
          phone: editingOrder.phone || order.phone,
          bookingDates: nextBookingDates,
        }
    )));

    setEditingOrder(null);
    setEditingOrderDatesText('');
    setStatusMessage('Booking updated successfully.');
  };

  const openAdminManagement = () => {
    setAdminManagementOpen(true);
    setCartOpen(false);
    setOrdersOpen(false);
    setStatusMessage('');
  };

  const closeAdminManagement = () => {
    setAdminManagementOpen(false);
    setCartOpen(false);
    setOrdersOpen(false);
  };

  const openCartView = () => {
    setCartOpen(true);
    setAdminManagementOpen(false);
    setOrdersOpen(false);
    setStatusMessage('');
  };

  const closeCartView = () => setCartOpen(false);

  const openOrdersView = (initialView = 'our-products') => {
    setOrdersOpen(true);
    setOrdersView(initialView);
    setAdminManagementOpen(false);
    setCartOpen(false);
    setStatusMessage('');
  };

  const handleOpenOrderFromNotification = (orderId) => {
    setOrdersOpen(true);
    setOrdersView('my-bookings');
    setAdminManagementOpen(false);
    setCartOpen(false);
    setNotificationOpen(false);
    setStatusMessage('');
  };

  const closeOrdersView = () => setOrdersOpen(false);

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setPostModalOpen(true);
  };

  const closePostProduct = () => {
    setPostModalOpen(false);
    setEditingProduct(null);
  };

  const handleSaveProduct = (productPayload) => {
    setProducts((existingProducts) => {
      if (editingProduct) {
        return existingProducts.map((item) => (
          item.id === editingProduct.id ? { ...item, ...productPayload, id: item.id } : item
        ));
      }

      const nextId = existingProducts.length
        ? Math.max(...existingProducts.map((item) => item.id)) + 1
        : 1;

      return [{ id: nextId, ...productPayload, isActive: true }, ...existingProducts];
    });

    setSelectedCategory('All');
    setStatusMessage('Your product is now live on the marketplace.');
    closePostProduct();
  };

  const handleDeleteProduct = (productId) => {
    setProducts((existingProducts) => existingProducts.map((item) => (
      item.id === productId ? { ...item, isActive: false } : item
    )));
    setStatusMessage('Product removed from the marketplace.');
  };

  const handleAddToCart = (product) => {
    const exists = cartItems.some((item) => item.id === product.id);
    const nextCart = exists ? cartItems : [{ ...product, addedAt: new Date().toISOString() }, ...cartItems];
    setCartItems(nextCart);
    setStatusMessage(`${product.title} saved to your cart.`);
  };

  const handleRemoveFromCart = (productId) => {
    const nextCart = cartItems.filter((item) => item.id !== productId);
    setCartItems(nextCart);
    setStatusMessage('Item removed from your cart.');
  };

  const handleOpenCheckout = (product) => {
    setCheckoutProduct(product);
    setStatusMessage('');
  };

  const handlePlaceOrder = (orderPayload) => {
    const nextOrder = {
      id: Date.now(),
      ...orderPayload,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      responseMessage: 'Waiting for owner approval.',
    };
    const nextOrders = [nextOrder, ...orders];
    setOrders(nextOrders);
    saveLocalState('greenCircleOrders', nextOrders);

    const ownerName = (orderPayload.productOwnerName || '').toLowerCase();
    const currentUserName = (user?.name || '').toLowerCase();
    if (ownerName && ownerName !== currentUserName) {
      const newNotification = {
        id: Date.now() + 1,
        product: orderPayload.rentedName,
        customer: orderPayload.customerName,
        status: 'Pending',
        rentalDays: (orderPayload.bookingDates || []).length,
        orderId: nextOrder.id,
        ownerName: orderPayload.productOwnerName,
        bookingDates: orderPayload.bookingDates || [],
        phone: orderPayload.phone,
      };
      setNotifications((existing) => [newNotification, ...existing]);
    }

    setStatusMessage(`Order placed for ${orderPayload.rentedName}.`);
    setCheckoutProduct(null);
  };

  if (!user) {
    return (
      <AuthFlow
        authView={authView}
        onAuthSuccess={saveUserProfile}
        onSwitchToLogin={() => setAuthView('login')}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  return (
    <div className="app-container">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchTrigger={() => setActiveSearchTerm(searchQuery)}
        toggleSidebar={() => setSidebarVisible((v) => !v)}
        openProfile={() => setProfileOpen(true)}
        openNotifications={openNotifications}
        openPostProduct={openPostProduct}
        notificationsCount={unreadNotificationCount}
        user={user}
      />

      <div className={`main-layout ${sidebarVisible ? 'sidebar-open' : 'sidebar-closed'}`}>
        {sidebarVisible && (
          <Sidebar
            onLogout={handleLogout}
            activeCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            cartItems={cartItems}
            onOpenAdminManagement={openAdminManagement}
            onCloseAdminManagement={closeAdminManagement}
            onOpenCartView={openCartView}
            onCloseCartView={closeCartView}
            onOpenOrdersView={openOrdersView}
            currentUser={user}
          />
        )}

        <main className="discovery-hub">
          {adminManagementOpen ? (
            <AdminManagementPanel
              postedProducts={postedProducts}
              onOpenPostProduct={openPostProduct}
              onClose={closeAdminManagement}
              onEditProduct={openEditProduct}
              onDeleteProduct={handleDeleteProduct}
            />
          ) : cartOpen ? (
            <CartView
              cartItems={cartItems}
              onClose={closeCartView}
              onRentNow={(item) => {
                handleOpenCheckout(item);
                closeCartView();
              }}
              onRemoveFromCart={handleRemoveFromCart}
            />
          ) : ordersOpen ? (
            <OrdersPanel
              ourProductOrders={ourProductOrders}
              myBookedOrders={myBookedOrders}
              ordersView={ordersView}
              setOrdersView={setOrdersView}
              closeOrdersView={closeOrdersView}
              handleEditOrder={handleEditOrder}
              handleDeleteOrder={handleDeleteOrder}
              activeOrderMenuId={activeOrderMenuId}
              setActiveOrderMenuId={setActiveOrderMenuId}
            />
          ) : activeView === 'explore' ? (
            <DiscoveryHub
              products={filteredProducts}
              currentUser={user}
              onInitiateLease={handleOpenCheckout}
              onAddToCart={handleAddToCart}
              onRentNow={handleOpenCheckout}
              onEditProduct={openEditProduct}
              onDeleteProduct={handleDeleteProduct}
              activeSearchTerm={activeSearchTerm}
              cartCount={cartItems.length}
              cartMessage={statusMessage}
            />
          ) : (
            <TrustDashboard />
          )}
        </main>

        <footer className="app-footer">
          © 2026 <span className="footer-company-name">SR Tech Solutions</span>. All Rights Reserved.
        </footer>
      </div>

      {editingOrder && (
        <EditOrderModal
          editingOrder={editingOrder}
          editingOrderDatesText={editingOrderDatesText}
          onClose={() => setEditingOrder(null)}
          onChangeOrder={setEditingOrder}
          onChangeDates={setEditingOrderDatesText}
          onSaveEditedOrder={handleSaveEditedOrder}
        />
      )}

      {profileOpen && (
        <ProfileModal
          user={user}
          onClose={() => setProfileOpen(false)}
          onUpdate={saveUserProfile}
          onLogout={handleLogout}
        />
      )}
      {notificationOpen && (
        <NotificationModal
          notifications={visibleNotifications}
          onClose={closeNotifications}
          onApprove={approveNotification}
          onReject={rejectNotification}
          onViewOrder={handleOpenOrderFromNotification}
        />
      )}
      {postModalOpen && (
        <PostProductModal
          user={user}
          editingProduct={editingProduct}
          onClose={closePostProduct}
          onSave={handleSaveProduct}
        />
      )}
      {checkoutProduct && (
        <CheckoutModal
          product={checkoutProduct}
          user={user}
          onClose={() => setCheckoutProduct(null)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}
    </div>
  );
}

