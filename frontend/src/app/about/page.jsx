export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-4xl">🍽️</div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
              Restaurant Finder
            </h1>
            <p className="text-gray-600 text-lg">
              Discover great food around you
            </p>
          </div>

          {/* Description */}
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-center text-lg">
              Find nearby restaurants with ease. Get walking directions, view menus, 
              and discover your next favorite meal all in one place.
            </p>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">📍</span>
                </div>
                <h3 className="font-semibold text-red-600 mb-1">Location-Based</h3>
                <p className="text-sm text-gray-600">Find restaurants near you</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">🗺️</span>
                </div>
                <h3 className="font-semibold text-red-600 mb-1">Walking Routes</h3>
                <p className="text-sm text-gray-600">Get walking directions</p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-red-50 border border-red-100">
                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl">📞</span>
                </div>
                <h3 className="font-semibold text-red-600 mb-1">Direct Contact</h3>
                <p className="text-sm text-gray-600">Call restaurants instantly</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-8 border-t border-red-200">
            <p className="text-red-500 text-sm font-medium">
              Built with love for food lovers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}