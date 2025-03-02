export default function BasicPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Basic Tailwind Test</h1>
      <p className="mb-4">Testing basic Tailwind functionality</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-blue-500 text-white rounded">Blue Box</div>
        <div className="p-4 bg-red-500 text-white rounded">Red Box</div>
        <div className="p-4 bg-green-500 text-white rounded">Green Box</div>
      </div>

      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
          Button 1
        </button>
        <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700">
          Button 2
        </button>
      </div>
    </div>
  );
}
