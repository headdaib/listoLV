import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-950 pt-16 pb-8 border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-white/5 pb-12">
          {/* Brand & Intro */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">ListoLV</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Современная платформа для удобной покупки и продажи товаров и услуг. Найдите всё, что вам нужно, в несколько кликов.
            </p>
            <div className="flex gap-4 mt-6 text-gray-500 text-lg">
              <a href="#" className="hover:text-indigo-400 transition-colors" title="Facebook">FB</a>
              <a href="#" className="hover:text-indigo-400 transition-colors" title="Twitter">TW</a>
              <a href="#" className="hover:text-indigo-400 transition-colors" title="Instagram">IG</a>
              <a href="#" className="hover:text-indigo-400 transition-colors" title="YouTube">YT</a>
            </div>
          </div>

          {/* Nav Columns */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Категории</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/ru/ads?category=1" className="hover:text-indigo-400 transition-colors">Транспорт</Link></li>
              <li><Link href="/ru/ads?category=2" className="hover:text-indigo-400 transition-colors">Недвижимость</Link></li>
              <li><Link href="/ru/ads?category=3" className="hover:text-indigo-400 transition-colors">Электроника</Link></li>
              <li><Link href="/ru/ads?category=4" className="hover:text-indigo-400 transition-colors">Работа</Link></li>
              <li><Link href="/ru/ads" className="hover:text-indigo-400 transition-colors font-medium">Все категории →</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Помощь</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Как подать объявление</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Правила платформы</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Безопасные сделки</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Служба поддержки</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Контакты</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Для бизнеса</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Магазины на ListoLV</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Реклама на сайте</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Тарифы</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Партнерская программа</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} ListoLV. Все права защищены.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gray-400 transition-colors">Пользовательское соглашение</Link>
            <Link href="#" className="hover:text-gray-400 transition-colors">Политика конфиденциальности</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
