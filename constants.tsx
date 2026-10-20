
import { Store, Product, ProductOrigin, Notification, HoumaNews, HoumaService, Promotion, CitizenReport } from './types';
import { ALGERIA_GEOGRAPHY } from './geography';

export { ALGERIA_GEOGRAPHY };

export const TRANSLATIONS = {
  fr: {
    welcome: "Bienvenue sur Hoomty",
    neighborhood: "Ma Houma",
    search_placeholder: "Rechercher dans le quartier...",
    all_categories: "Tout",
    local_filter: "Produits Algériens 🇩🇿",
    made_in_bladi: "Terroir Bladi",
    order_now: "Commander maintenant",
    add_to_cart: "Ajouter au panier",
    points_balance: "Solde Points",
    fidelity_goal: "Objectif Points",
    install_app: "Installer l'App",
    my_addresses: "Mes Adresses",
    logout: "Déconnexion",
    status_pending: "Reçue",
    status_preparing: "Préparation",
    status_delivering: "En route",
    status_completed: "Livrée",
    merchant_portal: "Portail Commerçant",
    stock_alert: "Alerte Stock",
    flash_promo: "Lancer Promo Flash",
    sales_today: "Ventes du jour",
    houma_news: "Actu de la Houma",
    neighbor_services: "Services Voisins",
    report_issue: "Signaler un problème",
    points_system: "Points Hoomty",
    badges: "Badges",
    connect_whatsapp: "Contacter via WhatsApp",
    flash_promo_active: "Promo Flash Active !",
    add_news: "Partager une info",
    find_service: "Trouver un service",
    slogan1: "حومتك في جيبك",
    slogan2: "كلشي قريب ليك",
  },
  ar: {
    welcome: "مرحباً بكم في حومتي",
    neighborhood: "حومتي",
    search_placeholder: "ابحث في الحي...",
    all_categories: "الكل",
    local_filter: "منتجات جزائرية 🇩🇿",
    made_in_bladi: "إنتاج بلادي",
    order_now: "اطلب الآن",
    add_to_cart: "أضف إلى السلة",
    points_balance: "رصيد النقاط",
    fidelity_goal: "هدف النقاط",
    install_app: "ثبت التطبيق",
    my_addresses: "عناويني",
    logout: "تسجيل الخروج",
    status_pending: "تم الاستلام",
    status_preparing: "قيد التحضير",
    status_delivering: "في الطريق",
    status_completed: "تم التسليم",
    merchant_portal: "بوابة التاجر",
    stock_alert: "تنبيه المخzون",
    flash_promo: "إطلاق عرض سريع",
    sales_today: "مبيعات اليوم",
    houma_news: "أخبار الحومة",
    neighbor_services: "خدمات الجيران",
    report_issue: "تبليغ عن مشكل",
    points_system: "نقاط حومتي",
    badges: "أوسمة",
    connect_whatsapp: "اتصال عبر واتساب",
    flash_promo_active: "عرض سريع نشط !",
    add_news: "شارك خبراً",
    find_service: "ابحث عن خدمة",
    slogan1: "حومتك في جيبك",
    slogan2: "كلشي قريب ليك",
  }
};

export const MOCK_STORES: Store[] = [
  // Épicerie (grocery)
  {
    id: 'g1',
    name: 'Hoomty Market Ben Aknoun',
    distance: '200m',
    rating: 4.8,
    hours: '07:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'grocery',
    phone: '+213550000001'
  },
  {
    id: 'g2',
    name: 'Superette El Biar',
    distance: '500m',
    rating: 4.6,
    hours: '08:00 - 21:00',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'grocery',
    phone: '+213550000002'
  },
  {
    id: 'g3',
    name: 'Epicerie du Quartier',
    distance: '800m',
    rating: 4.5,
    hours: '07:30 - 22:30',
    image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'grocery',
    phone: '+213550000003'
  },
  {
    id: 'g4',
    name: 'Alimentation Générale El Biar',
    distance: '1.2km',
    rating: 4.7,
    hours: '07:00 - 23:00',
    image: 'https://images.unsplash.com/photo-1604719312563-8912e9223c6a?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'grocery',
    phone: '+213550000004'
  },

  // Boulangerie (bread)
  {
    id: 'b1',
    name: 'Boulangerie Ben Aknoun',
    distance: '350m',
    rating: 4.9,
    hours: '06:00 - 20:00',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'bread',
    phone: '+213550000005'
  },
  {
    id: 'b2',
    name: 'Le Croissant d\'El Biar',
    distance: '600m',
    rating: 4.8,
    hours: '05:30 - 19:30',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'bread',
    phone: '+213550000006'
  },
  {
    id: 'b3',
    name: 'Fournil Traditionnel',
    distance: '900m',
    rating: 4.7,
    hours: '06:00 - 21:00',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bab3e?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'bread',
    phone: '+213550000007'
  },
  {
    id: 'b4',
    name: 'Pâtisserie Fine El Biar',
    distance: '1.5km',
    rating: 4.9,
    hours: '08:00 - 20:00',
    image: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'bread',
    phone: '+213550000008'
  },

  // Cosmétiques (cosmetics)
  {
    id: 'c1',
    name: 'Beauté Ben Aknoun',
    distance: '400m',
    rating: 4.6,
    hours: '09:00 - 19:00',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'cosmetics',
    phone: '+213550000009'
  },
  {
    id: 'c2',
    name: 'Espace Cosmétique El Biar',
    distance: '750m',
    rating: 4.7,
    hours: '09:30 - 19:30',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfad450516?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'cosmetics',
    phone: '+213550000010'
  },
  {
    id: 'c3',
    name: 'Parfumerie du Centre',
    distance: '1.1km',
    rating: 4.8,
    hours: '10:00 - 20:00',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'cosmetics',
    phone: '+213550000011'
  },
  {
    id: 'c4',
    name: 'Soins & Nature El Biar',
    distance: '1.8km',
    rating: 4.5,
    hours: '09:00 - 18:30',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'cosmetics',
    phone: '+213550000012'
  },

  // Quincaillerie (hardware)
  {
    id: 'h1',
    name: 'Quincaillerie Ben Aknoun',
    distance: '550m',
    rating: 4.7,
    hours: '08:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1530124560676-41bc1275d428?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'hardware',
    phone: '+213550000013'
  },
  {
    id: 'h2',
    name: 'Bricolage El Biar',
    distance: '850m',
    rating: 4.8,
    hours: '08:30 - 18:30',
    image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'hardware',
    phone: '+213550000014'
  },
  {
    id: 'h3',
    name: 'Outils & Matériaux',
    distance: '1.3km',
    rating: 4.6,
    hours: '08:00 - 17:00',
    image: 'https://images.unsplash.com/photo-1586864387917-f539b523f5b7?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'hardware',
    phone: '+213550000015'
  },
  {
    id: 'h4',
    name: 'Quincaillerie Moderne El Biar',
    distance: '2.1km',
    rating: 4.7,
    hours: '08:00 - 19:00',
    image: 'https://images.unsplash.com/photo-1510563800743-aed236490d08?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'hardware',
    phone: '+213550000016'
  },

  // Pizzeria (pizzeria)
  {
    id: 'piz1',
    name: 'Pizza Ben Aknoun',
    distance: '300m',
    rating: 4.8,
    hours: '11:00 - 23:00',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'pizzeria',
    phone: '+213550000017'
  },
  {
    id: 'piz2',
    name: 'Pizzeria El Biar',
    distance: '700m',
    rating: 4.7,
    hours: '11:30 - 22:30',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'pizzeria',
    phone: '+213550000018'
  },
  {
    id: 'piz3',
    name: 'Saveurs d\'Italie Ben Aknoun',
    distance: '1.2km',
    rating: 4.9,
    hours: '12:00 - 00:00',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'pizzeria',
    phone: '+213550000019'
  },
  {
    id: 'piz4',
    name: 'La Dolce Vita El Biar',
    distance: '1.9km',
    rating: 4.6,
    hours: '11:00 - 23:00',
    image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'pizzeria',
    phone: '+213550000020'
  },

  // Crèmerie (dairy)
  {
    id: 'd1',
    name: 'Crèmerie Ben Aknoun',
    distance: '250m',
    rating: 4.7,
    hours: '08:00 - 20:00',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'dairy',
    phone: '+213550000021'
  },
  {
    id: 'd2',
    name: 'Laiterie El Biar',
    distance: '550m',
    rating: 4.8,
    hours: '07:30 - 19:30',
    image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'dairy',
    phone: '+213550000022'
  },
  {
    id: 'd3',
    name: 'Fromagerie Artisanale',
    distance: '1.0km',
    rating: 4.9,
    hours: '09:00 - 19:00',
    image: 'https://images.unsplash.com/photo-1486297678162-ad249fa5773c?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'dairy',
    phone: '+213550000023'
  },
  {
    id: 'd4',
    name: 'Produits Frais El Biar',
    distance: '1.6km',
    rating: 4.6,
    hours: '08:00 - 21:00',
    image: 'https://images.unsplash.com/photo-1563636619-e9107da5a76a?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'dairy',
    phone: '+213550000024'
  },

  // Primeur (fruit)
  {
    id: 'f1',
    name: 'Primeur Ben Aknoun',
    distance: '200m',
    rating: 4.8,
    hours: '07:00 - 19:00',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'fruit',
    phone: '+213550000025'
  },
  {
    id: 'f2',
    name: 'Fruits & Légumes El Biar',
    distance: '450m',
    rating: 4.7,
    hours: '07:30 - 20:00',
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'fruit',
    phone: '+213550000026'
  },
  {
    id: 'f3',
    name: 'Le Jardin Potager',
    distance: '950m',
    rating: 4.9,
    hours: '08:00 - 18:00',
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'fruit',
    phone: '+213550000027'
  },
  {
    id: 'f4',
    name: 'Fraîcheur du Jour El Biar',
    distance: '1.4km',
    rating: 4.6,
    hours: '07:00 - 21:00',
    image: 'https://images.unsplash.com/photo-1573246123716-6b1782bee499?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'fruit',
    phone: '+213550000028'
  },

  // Boissons (drinks)
  {
    id: 'dr1',
    name: 'Boissons Ben Aknoun',
    distance: '300m',
    rating: 4.5,
    hours: '09:00 - 21:00',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'drinks',
    phone: '+213550000029'
  },
  {
    id: 'dr2',
    name: 'Cave d\'El Biar',
    distance: '650m',
    rating: 4.7,
    hours: '10:00 - 22:00',
    image: 'https://images.unsplash.com/photo-1568644891677-f086feac01b3?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'drinks',
    phone: '+213550000030'
  },
  {
    id: 'dr3',
    name: 'Rafraîchissements Ben Aknoun',
    distance: '1.1km',
    rating: 4.6,
    hours: '08:00 - 23:00',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun',
    category: 'drinks',
    phone: '+213550000031'
  },
  {
    id: 'dr4',
    name: 'Distributeur Boissons El Biar',
    distance: '1.7km',
    rating: 4.4,
    hours: '24/7',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar',
    category: 'drinks',
    phone: '+213550000032'
  }
];

export const MOCK_PRODUCTS: Product[] = [
  // Épicerie (grocery) - g1, g2, g3, g4
  { id: 'p1', storeId: 'g1', name: 'Café El Mordjane 250g', price: 450, category: 'grocery', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80', stock: 50, origin: ProductOrigin.LOCAL },
  { id: 'p2', storeId: 'g2', name: 'Huile d\'Olive Kabylie 1L', price: 1200, category: 'grocery', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80', stock: 20, origin: ProductOrigin.LOCAL },
  { id: 'p3', storeId: 'g3', name: 'Semoule Fine Sim 5kg', price: 650, category: 'grocery', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80', stock: 100, origin: ProductOrigin.LOCAL },
  { id: 'p4', storeId: 'g4', name: 'Dattes Deglet Nour 1kg', price: 850, category: 'grocery', image: 'https://images.unsplash.com/photo-1569870491169-3c131a7a583a?auto=format&fit=crop&w=400&q=80', stock: 40, origin: ProductOrigin.LOCAL },

  // Boulangerie (bread) - b1, b2, b3, b4
  { id: 'p5', storeId: 'b1', name: 'Baguette Traditionnelle', price: 15, category: 'bread', image: 'https://images.unsplash.com/photo-1586444248902-2f64eddf13cf?auto=format&fit=crop&w=400&q=80', stock: 200, origin: ProductOrigin.LOCAL },
  { id: 'p6', storeId: 'b2', name: 'Croissant au Beurre', price: 45, category: 'bread', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80', stock: 50, origin: ProductOrigin.LOCAL },
  { id: 'p7', storeId: 'b3', name: 'Pain de Campagne', price: 60, category: 'bread', image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=400&q=80', stock: 30, origin: ProductOrigin.LOCAL },
  { id: 'p8', storeId: 'b4', name: 'Msemen Traditionnel', price: 30, category: 'bread', image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=400&q=80', stock: 100, origin: ProductOrigin.LOCAL },

  // Cosmétiques (cosmetics) - c1, c2, c3, c4
  { id: 'p15', storeId: 'c1', name: 'Savon Artisanal Olive', price: 250, category: 'cosmetics', image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=400&q=80', stock: 45, origin: ProductOrigin.LOCAL },
  { id: 'p16', storeId: 'c2', name: 'Parfum Jasmin d\'Alger', price: 3500, category: 'cosmetics', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80', stock: 8, origin: ProductOrigin.LOCAL },
  { id: 'p25', storeId: 'c3', name: 'Crème Solaire SPF50', price: 1800, category: 'cosmetics', image: 'https://images.unsplash.com/photo-1526067766-84347c769421?auto=format&fit=crop&w=400&q=80', stock: 25, origin: ProductOrigin.IMPORTED },
  { id: 'p26', storeId: 'c4', name: 'Shampoing Sans Sulfate', price: 950, category: 'cosmetics', image: 'https://images.unsplash.com/photo-1505944270255-bd2b896e3e3a?auto=format&fit=crop&w=400&q=80', stock: 30, origin: ProductOrigin.LOCAL },

  // Quincaillerie (hardware) - h1, h2, h3, h4
  { id: 'p13', storeId: 'h1', name: 'Marteau de Menuisier', price: 1200, category: 'hardware', image: 'https://images.unsplash.com/photo-1586864387917-f539b523f5b7?auto=format&fit=crop&w=400&q=80', stock: 15, origin: ProductOrigin.IMPORTED },
  { id: 'p14', storeId: 'h2', name: 'Jeu de Tournevis (6pcs)', price: 1800, category: 'hardware', image: 'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?auto=format&fit=crop&w=400&q=80', stock: 10, origin: ProductOrigin.IMPORTED },
  { id: 'p23', storeId: 'h3', name: 'Perceuse Sans Fil 18V', price: 12500, category: 'hardware', image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80', stock: 5, origin: ProductOrigin.IMPORTED },
  { id: 'p24', storeId: 'h4', name: 'Peinture Blanche 5L', price: 3200, category: 'hardware', image: 'https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&w=400&q=80', stock: 12, origin: ProductOrigin.LOCAL },

  // Pizzeria (pizzeria) - piz1, piz2, piz3, piz4
  { id: 'p9', storeId: 'piz1', name: 'Pizza Margherita', price: 600, category: 'pizzeria', image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad50?auto=format&fit=crop&w=400&q=80', stock: 99, origin: ProductOrigin.LOCAL },
  { id: 'p10', storeId: 'piz2', name: 'Pizza Royale', price: 950, category: 'pizzeria', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80', stock: 99, origin: ProductOrigin.LOCAL },
  { id: 'p11', storeId: 'piz3', name: 'Pizza 4 Saisons', price: 850, category: 'pizzeria', image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=400&q=80', stock: 99, origin: ProductOrigin.LOCAL },
  { id: 'p12', storeId: 'piz4', name: 'Pizza Thon Fromage', price: 800, category: 'pizzeria', image: 'https://images.unsplash.com/photo-1593504049359-74330189a355?auto=format&fit=crop&w=400&q=80', stock: 99, origin: ProductOrigin.LOCAL },

  // Crèmerie (dairy) - d1, d2, d3, d4
  { id: 'p19', storeId: 'd1', name: 'Camembert Tradition', price: 450, category: 'dairy', image: 'https://images.unsplash.com/photo-1486297678162-ad249fa5773c?auto=format&fit=crop&w=400&q=80', stock: 25, origin: ProductOrigin.LOCAL },
  { id: 'p20', storeId: 'd2', name: 'Lait Frais 1L', price: 110, category: 'dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80', stock: 80, origin: ProductOrigin.LOCAL },
  { id: 'p29', storeId: 'd3', name: 'Yaourt Nature (Pack 8)', price: 240, category: 'dairy', image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=400&q=80', stock: 40, origin: ProductOrigin.LOCAL },
  { id: 'p30', storeId: 'd4', name: 'Beurre Traditionnel 250g', price: 350, category: 'dairy', image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80', stock: 30, origin: ProductOrigin.LOCAL },

  // Primeur (fruit) - f1, f2, f3, f4
  { id: 'p17', storeId: 'f1', name: 'Pommes Rouges 1kg', price: 350, category: 'fruit', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=400&q=80', stock: 60, origin: ProductOrigin.LOCAL },
  { id: 'p18', storeId: 'f2', name: 'Bananes 1kg', price: 450, category: 'fruit', image: 'https://images.unsplash.com/photo-1571771894821-ad9b5886479c?auto=format&fit=crop&w=400&q=80', stock: 40, origin: ProductOrigin.IMPORTED },
  { id: 'p27', storeId: 'f3', name: 'Oranges de Boufarik 1kg', price: 220, category: 'fruit', image: 'https://images.unsplash.com/photo-1582281298055-e25b84a30b0b?auto=format&fit=crop&w=400&q=80', stock: 100, origin: ProductOrigin.LOCAL },
  { id: 'p28', storeId: 'f4', name: 'Fraises de Skikda 500g', price: 400, category: 'fruit', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80', stock: 20, origin: ProductOrigin.LOCAL },

  // Boissons (drinks) - dr1, dr2, dr3, dr4
  { id: 'p21', storeId: 'dr1', name: 'Eau Minérale 1.5L', price: 35, category: 'drinks', image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80', stock: 300, origin: ProductOrigin.LOCAL },
  { id: 'p22', storeId: 'dr2', name: 'Jus d\'Orange Frais 1L', price: 280, category: 'drinks', image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80', stock: 20, origin: ProductOrigin.LOCAL },
  { id: 'p31', storeId: 'dr3', name: 'Soda Local Hamoud 1.5L', price: 120, category: 'drinks', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80', stock: 150, origin: ProductOrigin.LOCAL },
  { id: 'p32', storeId: 'dr4', name: 'Thé Vert Menthe 250g', price: 350, category: 'drinks', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=400&q=80', stock: 45, origin: ProductOrigin.LOCAL },
];

export const CATEGORIES = [
  { id: 'all', name: 'Tout', nameAr: 'الكل', icon: '🛍️' },
  { id: 'grocery', name: 'Épicerie', nameAr: 'بقالة', icon: '🥫' },
  { id: 'bread', name: 'Boulangerie', nameAr: 'مخبزة', icon: '🥖' },
  { id: 'cosmetics', name: 'Cosmétiques', nameAr: 'تجميل', icon: '💄' },
  { id: 'hardware', name: 'Quincaillerie', nameAr: 'خردوات', icon: '🛠️' },
  { id: 'pizzeria', name: 'Pizzeria', nameAr: 'بيتزا', icon: '🍕' },
  { id: 'dairy', name: 'Crèmerie', nameAr: 'أجبان', icon: '🥛' },
  { id: 'fruit', name: 'Primeur', nameAr: 'خضر و فواكه', icon: '🍎' },
  { id: 'drinks', name: 'Boissons', nameAr: 'مشروبات', icon: '🥤' }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Promo Ramadan !', message: 'Profitez de -20% sur la semoule Sim.', time: 'Il y a 2h', read: false, type: 'PROMO' },
  { id: 'n2', title: 'Commande en route', message: 'Votre livreur arrive.', time: 'Il y a 30 min', read: true, type: 'ORDER' }
];

export const MOCK_NEWS: HoumaNews[] = [
  {
    id: 'n1',
    author: 'Amine K.',
    content: 'Le boulanger de Ben Aknoun vient de sortir une fournée de galettes chaudes ! 🥖',
    time: 'Il y a 5 min',
    type: 'INFO',
    likes: 12,
    comments: 3,
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun'
  },
  {
    id: 'n2',
    author: 'Protection Civile',
    content: 'Coupure d\'eau prévue demain à El Biar de 8h à 16h pour travaux de maintenance.',
    time: 'Il y a 1h',
    type: 'ALERT',
    likes: 45,
    comments: 15,
    wilaya: '16 - Alger',
    neighborhood: 'El Biar'
  }
];

export const MOCK_SERVICES: HoumaService[] = [
  {
    id: 'ser1',
    title: 'Plombier Expert',
    provider: 'Mohamed S.',
    category: 'PLUMBING',
    description: 'Réparation fuites et installation sanitaire. Disponible 24/7 sur El Biar.',
    rating: 4.9,
    phone: '+213550000000',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar'
  },
  {
    id: 'ser2',
    title: 'Cours de Mathématiques',
    provider: 'Mme. Sarah',
    category: 'TUTORING',
    description: 'Soutien scolaire pour lycéens à Ben Aknoun. Préparation BAC.',
    rating: 4.8,
    phone: '+213660000000',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun'
  }
];

export const MOCK_PROMOTIONS: Promotion[] = [
  {
    id: 'p1',
    storeId: 'g1',
    storeName: 'Hoomty Market Ben Aknoun',
    title: 'Vente Flash !',
    description: 'Dattes Deglet Nour à prix coûtant pendant 2 heures.',
    discount: '-30%',
    expiryDate: '2026-03-15T20:00:00Z',
    image: 'https://images.unsplash.com/photo-1596515295849-51d846ffe3e0?auto=format&fit=crop&w=600&q=80'
  }
];

export const MOCK_REPORTS: CitizenReport[] = [
  {
    id: 'rep1',
    title: 'Fuite d\'eau importante',
    description: 'Une canalisation a éclaté au niveau de Ben Aknoun.',
    category: 'INFRASTRUCTURE',
    status: 'IN_PROGRESS',
    location: { lat: 36.75, lng: 3.03 },
    author: 'Amine_H',
    date: '2024-03-15T10:00:00Z',
    wilaya: '16 - Alger',
    neighborhood: 'Ben Aknoun'
  },
  {
    id: 'rep2',
    title: 'Éclairage public défaillant',
    description: 'Plusieurs lampadaires sont éteints depuis 3 jours à El Biar.',
    category: 'SECURITY',
    status: 'PENDING',
    location: { lat: 36.752, lng: 3.032 },
    author: 'Samy_31',
    date: '2024-03-14T20:00:00Z',
    wilaya: '16 - Alger',
    neighborhood: 'El Biar'
  }
];
