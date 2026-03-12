// components/Layout.js
export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Sticky Emoji Header  */}
      <header className="sticky top-0 z-10 bg-white shadow-md p-4 flex justify-around">
        <button className="text-2xl">🙏</button>
        <button className="text-2xl">⚔️</button>
        <button className="text-2xl">🧘</button>
        <button className="text-2xl">💡</button>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4">
        {children}
      </main>

      {/* Simple Mobile Navigation  */}
      <nav className="border-t bg-white p-4 flex justify-between sm:hidden">
        <span>Chat</span>
        <span>Lessons</span>
        <span>Profile</span>
      </nav>
    </div>
  );
}