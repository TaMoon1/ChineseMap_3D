export default function SearchBar() {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-md">
      <div className="relative group">
        <input
          type="text"
          placeholder="🔍 搜索地名 / 年份 / 战役..."
          className="
            w-full px-5 py-3 rounded-2xl text-sm
            bg-black/50 backdrop-blur-md
            border border-white/10
            text-white placeholder-gray-500
            outline-none
            transition-all duration-200
            focus:border-blue-500/50 focus:bg-black/70
          "
          disabled
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
          即将推出
        </kbd>
      </div>
    </div>
  )
}
