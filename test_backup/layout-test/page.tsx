export default function LayoutTestPage() {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg leading-6 font-medium text-gray-900">
          Layout Test Page
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Testing if Tailwind CSS is working properly.
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Blue Box</dt>
            <dd className="mt-1 text-sm text-white bg-blue-500 p-2 rounded sm:mt-0 sm:col-span-2">
              This should be blue with white text
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Red Box</dt>
            <dd className="mt-1 text-sm text-white bg-red-500 p-2 rounded sm:mt-0 sm:col-span-2">
              This should be red with white text
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Green Box</dt>
            <dd className="mt-1 text-sm text-white bg-green-500 p-2 rounded sm:mt-0 sm:col-span-2">
              This should be green with white text
            </dd>
          </div>
        </dl>
      </div>
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          type="button"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Test Button
        </button>
      </div>
    </div>
  );
}
