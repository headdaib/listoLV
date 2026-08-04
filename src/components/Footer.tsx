import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gray-950 py-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">L</span>
            </div>
            <span className="text-white font-semibold">ListoLV</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="#" className="hover:text-gray-300 transition-colors">О сайте</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Контакты</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Правила</Link>
            <Link href="#" className="hover:text-gray-300 transition-colors">Конфиденциальность</Link>
          </div>
          <p className="text-gray-600 text-xs">© 2025 ListoLV. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
