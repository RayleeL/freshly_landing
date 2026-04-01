/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Menu, 
  X, 
  ChevronRight, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter,
  Leaf,
  Zap,
  Heart,
  Clock,
  Send
} from 'lucide-react';

// --- Types ---

interface Smoothie {
  id: number;
  name: string;
  ingredients: string;
  description: string;
  price: string;
  priceNumber: number;
  color: string;
  image: string;
}

interface CartItem extends Smoothie {
  quantity: number;
}

interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
  avatar: string;
}

// --- Data ---

const SMOOTHIES: Smoothie[] = [
  {
    id: 1,
    name: "Манго-Маракуйя",
    ingredients: "Манго, Маракуйя, Апельсин",
    description: "Тропический взрыв вкуса, который перенесет вас на солнечный берег.",
    price: "350 ₽",
    priceNumber: 350,
    color: "bg-yellow-400",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 2,
    name: "Клубника-Банан",
    ingredients: "Клубника, Банан, Миндальное молоко",
    description: "Классическое сочетание для идеального начала дня.",
    price: "320 ₽",
    priceNumber: 320,
    color: "bg-pink-400",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    name: "Ягодный Микс",
    ingredients: "Черника, Малина, Ежевика, Йогурт",
    description: "Антиоксидантная бомба из лесных ягод.",
    price: "380 ₽",
    priceNumber: 380,
    color: "bg-purple-500",
    image: "https://images.unsplash.com/photo-1600718374662-0483d2b9da44?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    name: "Киви-Яблоко",
    ingredients: "Киви, Зеленое яблоко, Шпинат",
    description: "Освежающий детокс и заряд витамина С.",
    price: "340 ₽",
    priceNumber: 340,
    color: "bg-green-400",
    image: "https://images.pexels.com/photos/7937494/pexels-photo-7937494.jpeg"
  },
  {
    id: 5,
    name: "Ананас-Кокос",
    ingredients: "Ананас, Кокосовое молоко, Лайм",
    description: "Вкус Пина Колады, но только полезнее.",
    price: "370 ₽",
    priceNumber: 370,
    color: "bg-yellow-200",
    image: "https://images.pexels.com/photos/28575243/pexels-photo-28575243.jpeg"
  },
  {
    id: 6,
    name: "Апельсин-Персик",
    ingredients: "Апельсин, Персик, Мята",
    description: "Сочный и сладкий микс для летнего настроения.",
    price: "330 ₽",
    priceNumber: 330,
    color: "bg-orange-400",
    image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&q=80&w=600"
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Анна С.",
    text: "Самые вкусные смузи, которые я пробовала! Манго-Маракуйя — мой фаворит.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=anna"
  },
  {
    id: 2,
    name: "Марк Р.",
    text: "Отличный состав, всё натуральное. Заказываю каждое утро перед тренировкой.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=mark"
  },
  {
    id: 3,
    name: "Елена В.",
    text: "Очень быстрая доставка и всегда свежие фрукты. Рекомендую всем!",
    rating: 4,
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
];

// --- Components ---

const Navbar = ({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Каталог', href: '#catalog' },
    { name: 'О нас', href: '#about' },
    { name: 'Преимущества', href: '#benefits' },
    { name: 'Доставка', href: '#delivery' },
    { name: 'Оплата', href: '#payment' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Отзывы', href: '#testimonials' },
    { name: 'Контакты', href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              FRESHLY
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              <Zap size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Заказать сейчас
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button 
              onClick={onOpenCart}
              className="relative p-2 text-gray-700"
            >
              <Zap size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50 rounded-lg"
                >
                  {link.name}
                </a>
              ))}
              <button 
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full mt-4 bg-orange-500 text-white px-6 py-3 rounded-full font-semibold"
              >
                Заказать сейчас
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-br from-yellow-50 via-white to-orange-50">
      {/* Decorative fruits */}
      <motion.div 
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-40 -left-10 opacity-20 pointer-events-none"
      >
        <div className="w-40 h-40 bg-yellow-400 rounded-full blur-3xl" />
      </motion.div>
      <motion.div 
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 -right-10 opacity-20 pointer-events-none"
      >
        <div className="w-60 h-60 bg-orange-400 rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-wider text-orange-600 uppercase bg-orange-100 rounded-full">
              100% Натурально & Свежо
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight mb-6">
              Зарядись энергией <br />
              <span className="text-orange-500 italic">природы</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              Мы создаем смузи из самых спелых фруктов и ягод. Без сахара, без консервантов — только чистый вкус и витамины в каждой бутылке.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-orange-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Выбрать вкус <ChevronRight size={20} />
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-gray-800 border-2 border-gray-100 px-8 py-4 rounded-full font-bold text-lg shadow-sm hover:border-orange-200 transition-all flex items-center justify-center"
              >
                Узнать больше
              </button>
            </div>
            
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://i.pravatar.cc/100?u=${i}`} 
                    className="w-12 h-12 rounded-full border-4 border-white shadow-sm"
                    alt="User"
                  />
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-gray-500 font-medium">5000+ довольных клиентов</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 w-full aspect-square max-w-md mx-auto">
              <img 
                src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=800" 
                alt="Smoothie Hero"
                className="w-full h-full object-cover rounded-3xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-orange-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <Leaf size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Eco Friendly</p>
                    <p className="font-bold text-gray-900">100% Organic</p>
                  </div>
                </div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-orange-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <Zap size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase">Energy Boost</p>
                    <p className="font-bold text-gray-900">Natural Vitamins</p>
                  </div>
                </div>
              </motion.div>
            </div>
            {/* Background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-100 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const SmoothieImage = ({ item, onAddToCart }: { key?: number | string; item: Smoothie; onAddToCart: (item: Smoothie) => void }) => {
  const [imageSrc, setImageSrc] = useState(item.image);
  const [isGenerating, setIsGenerating] = useState(item.id === 4 || item.id === 5);

  useEffect(() => {
    if (item.id === 4 || item.id === 5) {
      const generate = async () => {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const prompt = item.id === 4 
            ? "A fresh and bright green smoothie made of kiwi and green apple in a glass bottle, decorated with kiwi slices and mint leaves, vibrant colors, professional food photography, high resolution, white background."
            : "A fresh and bright yellow smoothie made of pineapple and coconut in a glass bottle, decorated with pineapple chunks and coconut shavings, tropical vibe, vibrant colors, professional food photography, high resolution, white background.";
          
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
          });
          
          const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
          if (part?.inlineData) {
            setImageSrc(`data:image/png;base64,${part.inlineData.data}`);
          }
        } catch (e) {
          console.error("Image generation failed", e);
        } finally {
          setIsGenerating(false);
        }
      };
      generate();
    }
  }, [item.id]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={imageSrc} 
          alt={item.name}
          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isGenerating ? 'blur-md scale-110' : ''}`}
          referrerPolicy="no-referrer"
        />
        {isGenerating && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-orange-600 font-bold text-xs uppercase tracking-widest">Создаем шедевр...</span>
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-1 rounded-full font-bold text-orange-600 shadow-md">
          {item.price}
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.name}</h3>
        <p className="text-sm font-semibold text-orange-500 mb-3 uppercase tracking-wide">
          {item.ingredients}
        </p>
        <p className="text-gray-600 mb-6 line-clamp-2">
          {item.description}
        </p>
        <button 
          onClick={() => onAddToCart(item)}
          className="w-full py-3 rounded-2xl bg-gray-50 text-gray-900 font-bold hover:bg-orange-500 hover:text-white transition-all duration-300 active:scale-95"
        >
          В корзину
        </button>
      </div>
    </motion.div>
  );
};

const Catalog = ({ onAddToCart }: { onAddToCart: (item: Smoothie) => void }) => {
  return (
    <section id="catalog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            Наши Вкусы
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Выберите свой идеальный микс. Каждый рецепт разработан нутрициологами для максимальной пользы.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SMOOTHIES.map((item) => (
            <SmoothieImage key={item.id} item={item} onAddToCart={onAddToCart} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Delivery = () => {
  const [courierImg, setCourierImg] = useState("https://images.unsplash.com/photo-1586769852044-692d6e6924a0?auto=format&fit=crop&q=80&w=1200");
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    const generate = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: "A friendly delivery courier in a bright orange uniform carrying a thermal bag, smiling, urban background, professional photography, high resolution." }] },
        });
        
        const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
        if (part?.inlineData) {
          setCourierImg(`data:image/png;base64,${part.inlineData.data}`);
        }
      } catch (e) {
        console.error("Courier image generation failed", e);
      } finally {
        setIsGenerating(false);
      }
    };
    generate();
  }, []);

  return (
    <section id="delivery" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Доставка</h2>
          <p className="text-gray-600">Мы доставим ваш смузи быстрее, чем он успеет нагреться!</p>
        </div>

        <div className="relative h-64 md:h-96 rounded-[3rem] overflow-hidden shadow-2xl mb-12">
          <img 
            src="https://images.pexels.com/photos/13432008/pexels-photo-13432008.jpeg?auto=format&fit=crop&q=80&w=1200"
            alt="Delivery Service"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 shadow-xl">
              <div className="p-3 bg-orange-100 text-orange-500 rounded-xl">
          <Clock size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase">Экспресс доставка</p>
                <p className="font-bold text-gray-900">Доставим за 30-45 минут</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-orange-500 mb-2">30 мин</div>
            <p className="text-gray-600">Среднее время доставки по городу</p>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-orange-500 mb-2">Бесплатно</div>
            <p className="text-gray-600">При заказе от 1500 ₽</p>
          </div>
          <div className="text-center p-6">
            <div className="text-3xl font-bold text-orange-500 mb-2">Бережно</div>
            <p className="text-gray-600">Специальные термо-сумки для свежести</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const Payment = () => {
  return (
    <section id="payment" className="py-24 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Оплата</h2>
          <p className="text-gray-600">Удобные способы оплаты для вашего комфорта</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Картой онлайн</h3>
            <p className="text-gray-500">Безопасная оплата через сайт любыми банковскими картами.</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Phone size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">СБП / QR-код</h3>
            <p className="text-gray-500">Мгновенная оплата через мобильное приложение вашего банка.</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">При получении</h3>
            <p className="text-gray-500">Оплата курьеру картой или наличными при доставке заказа.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqs = [
    { q: "Как долго хранятся смузи?", a: "Наши смузи не проходят пастеризацию, поэтому срок хранения составляет 48 часов в холодильнике." },
    { q: "Есть ли в составе сахар?", a: "Нет, мы не добавляем сахар. Сладость обеспечивают только натуральные фрукты и ягоды." },
    { q: "Можно ли заказать смузи на мероприятие?", a: "Да, мы принимаем корпоративные заказы. Свяжитесь с нами через форму или по телефону." },
    { q: "Откуда вы берете фрукты?", a: "Мы работаем с проверенными фермерскими хозяйствами, которые гарантируют экологичность продукции." }
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Часто задаваемые вопросы</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {faq.q}
                <ChevronRight className={`transition-transform ${openIndex === i ? 'rotate-90' : ''}`} size={20} />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-gray-600"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CartSection = ({ cart, onRemove, onUpdateQuantity }: { 
  cart: CartItem[]; 
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, delta: number) => void;
}) => {
  const total = cart.reduce((sum, item) => sum + item.priceNumber * item.quantity, 0);

  return (
    <section id="cart" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ваша Корзина</h2>
          <p className="text-gray-600">Проверьте ваш заказ перед оформлением</p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white p-12 rounded-[3rem] text-center shadow-sm">
            <Zap size={64} className="mx-auto text-gray-200 mb-6" />
            <p className="text-xl text-gray-400 font-medium">Ваша корзина пока пуста</p>
            <button 
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 text-orange-500 font-bold hover:underline"
            >
              Вернуться в каталог
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden">
            <div className="p-8 md:p-12 space-y-8">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-6 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-2xl" />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <p className="text-gray-500 text-sm">{item.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-xl p-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-500 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-orange-500 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <p className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-xs">Итого к оплате</p>
                <p className="text-4xl font-extrabold text-gray-900">{total} ₽</p>
              </div>
              <button className="w-full md:w-auto bg-orange-500 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-orange-600 transition-all transform hover:scale-105">
                Оформить заказ
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 bg-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=800" 
                alt="Fresh Fruits"
                className="w-full h-[500px] object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-30 -z-10" />
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-orange-400 rounded-full blur-3xl opacity-30 -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Мы верим в силу <br />
              <span className="text-orange-500">настоящих продуктов</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Freshly начинался как небольшой семейный проект. Мы хотели создать напиток, который был бы не только вкусным, но и приносил реальную пользу организму. 
            </p>
            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Сегодня мы работаем с лучшими фермерами, чтобы гарантировать свежесть каждого ингредиента. Мы не используем пастеризацию, чтобы сохранить все живые витамины и ферменты.
            </p>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-orange-100">
                <p className="text-3xl font-bold text-orange-500 mb-1">100%</p>
                <p className="text-sm font-bold text-gray-500 uppercase">Натурально</p>
              </div>
              <div className="p-6 bg-white rounded-3xl shadow-sm border border-orange-100">
                <p className="text-3xl font-bold text-orange-500 mb-1">0%</p>
                <p className="text-sm font-bold text-gray-500 uppercase">Сахара</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Benefits = () => {
  const benefits = [
    {
      icon: <Leaf className="text-green-500" size={32} />,
      title: "Эко-упаковка",
      desc: "Мы используем только перерабатываемое стекло и биоразлагаемые крышки."
    },
    {
      icon: <Clock className="text-blue-500" size={32} />,
      title: "Свежесть 24/7",
      desc: "Готовим смузи непосредственно перед отправкой вашего заказа."
    },
    {
      icon: <Heart className="text-red-500" size={32} />,
      title: "Польза для сердца",
      desc: "Наши миксы богаты калием и антиоксидантами для вашего здоровья."
    },
    {
      icon: <Zap className="text-yellow-500" size={32} />,
      title: "Энергия без кофеина",
      desc: "Природные сахара из фруктов дают стабильный заряд бодрости."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Почему выбирают нас?</h2>
          <p className="text-gray-600">Больше чем просто напиток — это ваш стиль жизни.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[2rem] bg-gray-50 border border-transparent hover:border-orange-200 hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-6 inline-block p-4 bg-white rounded-2xl shadow-sm">
                {b.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{b.title}</h3>
              <p className="text-gray-600 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-24 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Отзывы наших героев</h2>
          <p className="text-gray-600">Те, кто уже изменил свой рацион вместе с нами.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-sm relative"
            >
              <div className="flex text-yellow-400 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={18} fill="currentColor" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-8 leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full" />
                <p className="font-bold text-gray-900">{t.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MapSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Где нас найти?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Наши точки продаж расположены в самых удобных местах города. Заходите за свежей порцией витаминов!
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Центральный Парк</p>
                  <p className="text-gray-500">ул. Зеленая, 15 (у главного входа)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">ТЦ "Океан"</p>
                  <p className="text-gray-500">пр. Мира, 42 (1 этаж, фудкорт)</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Бизнес-центр "Скай"</p>
                  <p className="text-gray-500">ул. Высокая, 8 (холл)</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[400px] bg-gray-200 rounded-[3rem] overflow-hidden relative shadow-inner"
          >
            {/* Placeholder for Map */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl text-center">
                <MapPin className="mx-auto text-orange-500 mb-2" size={32} />
                <p className="font-bold text-gray-900">Интерактивная карта</p>
                <p className="text-sm text-gray-500">Скоро здесь появится карта</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ContactForm = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState({ name: false, email: false, message: false });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (name: string, value: string) => {
    let error = '';
    if (name === 'name') {
      if (value.trim().length < 2) error = 'Имя должно содержать минимум 2 символа';
    } else if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = 'Введите корректный email';
    } else if (name === 'message') {
      if (value.trim().length < 10) error = 'Сообщение должно содержать минимум 10 символов';
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    if (touched[name as keyof typeof touched]) {
      setErrors({ ...errors, [name]: validate(name, value) });
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validate(name, value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation check
    const newErrors = {
      name: validate('name', formState.name),
      email: validate('email', formState.email),
      message: validate('message', formState.message),
    };
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, message: true });

    if (!newErrors.name && !newErrors.email && !newErrors.message) {
      // Simulate submission
      setIsSubmitted(true);
      setFormState({ name: '', email: '', message: '' });
      setTouched({ name: false, email: false, message: false });
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const isFormValid = !validate('name', formState.name) && 
                      !validate('email', formState.email) && 
                      !validate('message', formState.message);

  return (
    <section id="contact" className="py-24 bg-orange-500 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Свяжитесь с нами</h2>
            <p className="text-gray-600">Есть вопросы или предложения? Мы всегда рады общению!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Ваше имя</label>
                <input 
                  type="text" 
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none ${
                    touched.name && errors.name ? 'border-red-400' : 'border-transparent'
                  }`}
                  placeholder="Иван Иванов"
                />
                <AnimatePresence>
                  {touched.name && errors.name && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs font-bold mt-1 absolute"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="relative">
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none ${
                    touched.email && errors.email ? 'border-red-400' : 'border-transparent'
                  }`}
                  placeholder="hello@example.com"
                />
                <AnimatePresence>
                  {touched.email && errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 text-xs font-bold mt-1 absolute"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Сообщение</label>
              <textarea 
                name="message"
                rows={4}
                value={formState.message}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-6 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none resize-none ${
                  touched.message && errors.message ? 'border-red-400' : 'border-transparent'
                }`}
                placeholder="Расскажите нам что-нибудь..."
              />
              <AnimatePresence>
                {touched.message && errors.message && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-xs font-bold mt-1 absolute"
                  >
                    {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <button 
              type="submit"
              disabled={!isFormValid && (touched.name || touched.email || touched.message)}
              className={`w-full py-5 rounded-2xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-3 ${
                isSubmitted 
                  ? "bg-green-500 text-white" 
                  : !isFormValid && (touched.name || touched.email || touched.message)
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-orange-500 text-white hover:bg-orange-600 active:scale-95"
              }`}
            >
              {isSubmitted ? "Отправлено!" : "Отправить сообщение"} <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white pt-20 pb-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-6 block">
              FRESHLY
            </span>
            <p className="text-gray-500 leading-relaxed mb-6">
              Натуральные смузи для вашего здоровья и энергии. Мы заботимся о каждом ингредиенте.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                <Facebook size={20} />
              </a>
              <a href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Навигация</h4>
            <ul className="space-y-4">
              <li><a href="#catalog" className="text-gray-500 hover:text-orange-500 transition-colors">Каталог</a></li>
              <li><a href="#about" className="text-gray-500 hover:text-orange-500 transition-colors">О нас</a></li>
              <li><a href="#benefits" className="text-gray-500 hover:text-orange-500 transition-colors">Преимущества</a></li>
              <li><a href="#testimonials" className="text-gray-500 hover:text-orange-500 transition-colors">Отзывы</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Поддержка</h4>
            <ul className="space-y-4">
              <li><a href="#delivery" className="text-gray-500 hover:text-orange-500 transition-colors">Доставка</a></li>
              <li><a href="#payment" className="text-gray-500 hover:text-orange-500 transition-colors">Оплата</a></li>
              <li><a href="#faq" className="text-gray-500 hover:text-orange-500 transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-500 hover:text-orange-500 transition-colors">Политика конфиденциальности</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-sm">Контакты</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-500">
                <Phone size={18} className="text-orange-500" />
                <span>+7 (999) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Mail size={18} className="text-orange-500" />
                <span>hello@freshly.ru</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <MapPin size={18} className="text-orange-500" />
                <span>г. Москва, ул. Свежая, 1</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} FRESHLY. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (smoothie: Smoothie) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === smoothie.id);
      if (existing) {
        return prev.map(item => item.id === smoothie.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...smoothie, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-600">
      <Navbar 
        cartCount={cartCount} 
        onOpenCart={() => document.getElementById('cart')?.scrollIntoView({ behavior: 'smooth' })} 
      />
      <main>
        <Hero />
        <Catalog onAddToCart={addToCart} />
        <About />
        <Benefits />
        <Delivery />
        <Payment />
        <FAQ />
        <Testimonials />
        <CartSection 
          cart={cart} 
          onRemove={removeFromCart} 
          onUpdateQuantity={updateQuantity} 
        />
        <MapSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
