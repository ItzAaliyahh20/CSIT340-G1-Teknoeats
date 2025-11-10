"use client"

export default function Navigation({ categories, selectedCategory, onSelectCategory }) {
  return (
    <nav className="bg-white border-b px-4 py-4">
      <div className="max-w-7xl mx-auto flex gap-8 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelectCategory(category)}
            className={`font-semibold transition-colors ${
              selectedCategory === category
                ? "text-[#8B3A3A] border-b-2 border-[#8B3A3A]"
                : "text-gray-600 hover:text-[#8B3A3A]"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </nav>
  )
}
