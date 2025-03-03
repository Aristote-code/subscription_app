export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Simple Tailwind Test
        </h1>
        <p className="text-gray-600 mb-4">
          This page uses only basic Tailwind classes that don't rely on theme
          variables.
        </p>
        <div className="space-y-4">
          <div className="bg-blue-500 text-white p-4 rounded">
            This should be a blue box with white text
          </div>
          <div className="bg-red-500 text-white p-4 rounded">
            This should be a red box with white text
          </div>
          <div className="bg-green-500 text-white p-4 rounded">
            This should be a green box with white text
          </div>
        </div>
        <div className="mt-6">
          <a
            href="/"
            className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
