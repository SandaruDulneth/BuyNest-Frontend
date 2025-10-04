import { ShieldCheck, Leaf, Target, Lightbulb, Eye, Rocket } from "lucide-react";

export default function AboutUs() {
  return (
    <main className="bg-gray-50 py-16 font-poppins">
      {/* ---------- Section Header ---------- */}
      <div className="max-w-4xl mx-auto text-center px-6">
        <p className="uppercase text-xl tracking-wide text-emerald-600 font-semibold">
          About Us
        </p>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">
          Unveiling Our Identity, Vision and Values
        </h2>
        <p className="mt-4 text-gray-600">
          At <span className="font-semibold text-emerald-600">BuyNest</span>, we
          are passionate about delivering fresh groceries at your doorstep.
          With years of experience in e-commerce, we’ve become your trusted
          partner for high-quality products, reliable service, and unbeatable
          value.
        </p>
      </div>

      {/* ---------- Values Cards ---------- */}
      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 px-6">
        <div className="bg-emerald-700 text-white rounded-2xl p-6 shadow-md flex flex-col items-center">
          <ShieldCheck className="w-8 h-8 mb-3" />
          <p className="font-medium">Quality</p>
        </div>
        <div className="bg-emerald-700 text-white rounded-2xl p-6 shadow-md flex flex-col items-center">
          <Leaf className="w-8 h-8 mb-3" />
          <p className="font-medium">Freshness</p>
        </div>
        <div className="bg-emerald-700 text-white rounded-2xl p-6 shadow-md flex flex-col items-center">
          <Target className="w-8 h-8 mb-3" />
          <p className="font-medium">Precision</p>
        </div>
        <div className="bg-emerald-700 text-white rounded-2xl p-6 shadow-md flex flex-col items-center">
          <Lightbulb className="w-8 h-8 mb-3" />
          <p className="font-medium">Innovation</p>
        </div>
      </div>

      {/* ---------- Vision & Mission ---------- */}
      <div className="max-w-5xl mx-auto mt-14 bg-white shadow rounded-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="text-center md:text-left">
          <Eye className="w-8 h-8 text-emerald-600 mb-3 mx-auto md:mx-0" />
          <h3 className="text-xl font-bold text-emerald-700 mb-2">Vision</h3>
          <p className="text-gray-600">
            To lead the way in online grocery shopping by providing convenient,
            affordable, and fresh solutions that make everyday life easier.
          </p>
        </div>
        <div className="text-center md:text-left">
          <Rocket className="w-8 h-8 text-emerald-600 mb-3 mx-auto md:mx-0" />
          <h3 className="text-xl font-bold text-emerald-700 mb-2">Mission</h3>
          <p className="text-gray-600">
            To leverage technology, logistics, and partnerships to deliver fresh
            groceries and household essentials with unmatched speed, quality, and trust.
          </p>
        </div>
      </div>
    </main>
  );
}
