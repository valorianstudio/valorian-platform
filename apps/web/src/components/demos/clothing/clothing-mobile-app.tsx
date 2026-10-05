'use client';

import { useState } from 'react';
import { Tabs } from '@/components/demos/shared/app-ui';
import { MobileFrame } from '@/components/demos/shared/mobile-frame';
import { BottomNav } from '@/components/demos/shared/mobile-kit';
import { cartTotals } from './storefront';
import type { CartLine } from './storefront';
import { CLOTHING_THEME } from '@/data/clothing/meta';
import { productById } from '@/data/clothing/catalog';
import { cn } from '@/lib/cn';
import {
  SELLER_NAV,
  SHOP_NAV,
  SellerAnalytics,
  SellerDashboard,
  SellerOrders,
  SellerProducts,
  ShopCart,
  ShopCategories,
  ShopCheckout,
  ShopHome,
  ShopLogin,
  ShopProduct,
  ShopProfile,
  ShopSearch,
  ShopSplash,
  ShopTracking,
} from './clothing-mobile-screens';
import type { SellerScreen, ShopScreen } from './clothing-mobile-screens';

type App = 'shop' | 'seller';

const SHOP_SCREENS: { id: ShopScreen; label: string; note: string }[] = [
  { id: 'splash', label: 'Splash', note: 'Brand welcome screen.' },
  { id: 'login', label: 'Login / Register', note: 'Sign in or create an account.' },
  { id: 'home', label: 'Home', note: 'New season, departments and picks.' },
  { id: 'categories', label: 'Categories', note: 'Browse men, women and accessories.' },
  { id: 'search', label: 'Product search', note: 'Find a piece in a few letters.' },
  { id: 'product', label: 'Product details', note: 'Sizes, colour, reviews and add to bag.' },
  { id: 'cart', label: 'Cart', note: 'Quantities, delivery and totals.' },
  { id: 'checkout', label: 'Checkout', note: 'Delivery and one-tap payment.' },
  { id: 'tracking', label: 'Order tracking', note: 'Follow the parcel to your door.' },
  { id: 'profile', label: 'Profile', note: 'Orders, rewards and sign out.' },
];

const SELLER_SCREENS: { id: SellerScreen; label: string; note: string }[] = [
  { id: 'dashboard', label: 'Dashboard', note: "Today's sales, orders and stock alerts." },
  { id: 'orders', label: 'Orders', note: 'Pack and ship with one tap.' },
  { id: 'products', label: 'Products', note: 'Stock levels at a glance.' },
  { id: 'analytics', label: 'Sales analytics', note: 'Revenue trend and key ratios.' },
];

const INITIAL: CartLine[] = [{ key: 'p3-M-Ivory', id: 'p3', size: 'M', colour: 'Ivory', qty: 1 }];

/**
 * Interactive phone preview. A shopping app and a seller app share one phone frame. Adding to the bag updates the bag badge and the cart
 * screen, and checkout places an order that shows in order tracking, so the preview behaves like the real app.
 */
export function ClothingMobileApp() {
  const [app, setApp] = useState<App>('shop');
  const [shop, setShop] = useState<ShopScreen>('splash');
  const [seller, setSeller] = useState<SellerScreen>('dashboard');
  const [productId, setProductId] = useState('p1');
  const [lines, setLines] = useState<CartLine[]>(INITIAL);
  const [placed, setPlaced] = useState(false);
  const count = cartTotals(lines).count;

  const screens = app === 'shop' ? SHOP_SCREENS : SELLER_SCREENS;
  const current = app === 'shop' ? shop : seller;
  const select = (id: string) => (app === 'shop' ? setShop(id as ShopScreen) : setSeller(id as SellerScreen));
  const splash = app === 'shop' && shop === 'splash';
  const open = (id: string) => {
    setProductId(id);
    setShop('product');
  };
  const add = (id: string, size: string) => {
    const colour = id === 'p3' ? 'Ivory' : 'Black';
    const key = `${id}-${size}-${colour}`;
    setLines((ls) => {
      const found = ls.find((l) => l.key === key);
      return found ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { key, id, size, colour, qty: 1 }];
    });
  };
  const setQty = (key: string, qty: number) => setLines((ls) => (qty <= 0 ? ls.filter((l) => l.key !== key) : ls.map((l) => (l.key === key ? { ...l, qty } : l))));
  const navValue: 'home' | 'categories' | 'search' | 'cart' | 'profile' = shop === 'product' ? 'categories' : shop === 'checkout' || shop === 'tracking' ? 'cart' : shop === 'splash' || shop === 'login' ? 'home' : (shop as 'home' | 'categories' | 'search' | 'cart' | 'profile');

  return (
    <div style={CLOTHING_THEME} className="grid items-start gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div className="order-2 min-w-0 lg:order-1">
        <Tabs label="App" value={app} onChange={setApp} tabs={[{ id: 'shop', label: 'Shopping app', count: SHOP_SCREENS.length }, { id: 'seller', label: 'Seller app', count: SELLER_SCREENS.length }]} />
        <h2 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900">{app === 'shop' ? 'The shopping app' : 'The seller app'}</h2>
        <p className="mt-2 max-w-md text-slate-600">{app === 'shop' ? 'Browse, try a size, pay in one tap and follow the parcel to your door.' : 'Pack orders, watch stock and see how the week is trading, from anywhere.'}</p>
        <ol aria-label="Screens" className="mt-6 grid gap-2 sm:grid-cols-2">
          {screens.map((screen, index) => {
            const on = screen.id === current;
            return (
              <li key={screen.id}>
                <button type="button" aria-current={on ? 'true' : undefined} onClick={() => select(screen.id)} className={cn('flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[color:var(--demo-accent)]', on ? 'border-[color:var(--demo-accent)] bg-[var(--demo-accent-soft)]' : 'border-slate-200 bg-white hover:border-slate-300')}>
                  <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-semibold tabular-nums', on ? 'bg-[var(--demo-accent)] text-white' : 'bg-slate-100 text-slate-600')}>{index + 1}</span>
                  <span className="min-w-0"><span className="block text-sm font-semibold text-slate-900">{screen.label}</span><span className="block text-xs text-slate-500">{screen.note}</span></span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="order-1 w-full lg:sticky lg:top-40 lg:order-2 lg:w-[19rem]">
        <MobileFrame label={`${app === 'shop' ? 'Shopping' : 'Seller'} app preview`} tone={splash ? 'light' : 'dark'} screenClassName={splash ? 'bg-[var(--demo-accent)]' : 'bg-white'}>
          <div key={`${app}-${current}-${productId}`} className="demo-slide flex min-h-0 flex-1 flex-col">
            {app === 'shop' ? (
              <>
                {shop === 'splash' && <ShopSplash onStart={() => setShop('login')} />}
                {shop === 'login' && <ShopLogin onSignIn={() => setShop('home')} />}
                {shop === 'home' && <ShopHome onOpen={open} onAdd={(id) => add(id, productById(id).sizes[0])} go={setShop} />}
                {shop === 'categories' && <ShopCategories onOpen={open} />}
                {shop === 'search' && <ShopSearch onOpen={open} />}
                {shop === 'product' && <ShopProduct key={productId} id={productId} onAdd={add} go={setShop} />}
                {shop === 'cart' && <ShopCart lines={lines} onQty={setQty} go={setShop} />}
                {shop === 'checkout' && <ShopCheckout lines={lines} onPlaced={() => { setPlaced(true); setLines([]); setShop('tracking'); }} />}
                {shop === 'tracking' && <ShopTracking placed={placed} />}
                {shop === 'profile' && <ShopProfile onSignOut={() => setShop('login')} />}
              </>
            ) : (
              <>
                {seller === 'dashboard' && <SellerDashboard go={setSeller} />}
                {seller === 'orders' && <SellerOrders />}
                {seller === 'products' && <SellerProducts />}
                {seller === 'analytics' && <SellerAnalytics />}
              </>
            )}
          </div>
          {app === 'shop' && shop !== 'splash' && shop !== 'login' && (
            <BottomNav label="Shopping app" items={SHOP_NAV.map((item) => (item.id === 'cart' ? { ...item, badge: count } : item))} value={navValue} onChange={setShop} />
          )}
          {app === 'seller' && <BottomNav label="Seller app" items={SELLER_NAV} value={seller} onChange={setSeller} />}
        </MobileFrame>
      </div>
    </div>
  );
}
