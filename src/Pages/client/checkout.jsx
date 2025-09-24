import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
    const { state } = useLocation();
    const cart = state?.cart || [];

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [deliveryMethod, setDeliveryMethod] = useState("pickup");
    const [street, setStreet] = useState("");
    const [province, setProvince] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const navigate = useNavigate();

    const getQty = (item) => Number(item.qty ?? item.quantity ?? 0);
    const cartTotal = useMemo(
        () => cart.reduce((sum, item) => sum + Number(item.price) * getQty(item), 0),
        [cart]
    );

    async function placeOrder() {
        const token = localStorage.getItem("token");
        if (!token) return toast.error("Please login to place order");
        if (!firstName.trim()) return toast.error("First name is required");
        if (!lastName.trim())  return toast.error("Last name is required");
        if (!/^\d{10}$/.test(phone.trim()))
            return toast.error("Phone number must be exactly 10 digits");

        if (deliveryMethod === "home") {
            if (!street.trim())   return toast.error("Street address is required");
            if (!city.trim())     return toast.error("City is required");
            if (!province.trim()) return toast.error("Province is required");
        }
        if (cart.length === 0) return toast.error("Your cart is empty");

        const orderInformation = {
            name: `${firstName} ${lastName}`.trim(),
            phone: phone.trim(),
            deliveryMethod,
            address: `${street} ${city} ${province}`.trim(),
            products: cart.map((c) => ({
                productId: c.productId,
                qty: Number(c.qty ?? c.quantity ?? 1),
            })),
        };

        try {
            const res = await axios.post(
                "http://localhost:5000/api/orders",
                orderInformation,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Order placed successfully");
            localStorage.removeItem("cart");
            setTimeout(() => navigate("/"), 2000);

            if (deliveryMethod === "home") {
                const orderId = res.data.orderId;

                await axios.post(
                    "http://localhost:5000/api/delivery",
                    { orderId, phone },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Delivery started to process");
            }
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Error placing order");
        }
    }

    return (
        <div className="min-h-screen bg-white font-poppins">
            <div className="mx-auto w-full max-w-6xl px-4 py-10">
                {/* Header */}
                <p className="text-xs text-gray-500">
                    <Link to="/" className="hover:underline">Shopping Cart</Link>{" "}
                    / <span className="text-gray-700">Checkout</span>
                </p>
                <h1 className="text-left text-4xl font-bold">Checkout</h1>

                {/* Content */}
                <div className="mt-2 grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">
                    {/* Left column */}
                    <section className="lg:col-span-2">
                        <h2 className="mb-6 text-sm font-semibold tracking-wider text-gray-700">
                            DELIVERY METHOD
                        </h2>

                        <div className="mb-6 flex gap-6">
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input
                                    type="radio"
                                    value="pickup"
                                    checked={deliveryMethod === "pickup"}
                                    onChange={() => setDeliveryMethod("pickup")}
                                    className="h-4 w-4 text-emerald-600"
                                />
                                Store Pickup
                            </label>
                            <label className="flex items-center gap-2 text-sm font-medium">
                                <input
                                    type="radio"
                                    value="home"
                                    checked={deliveryMethod === "home"}
                                    onChange={() => setDeliveryMethod("home")}
                                    className="h-4 w-4 text-emerald-600"
                                />
                                Home Delivery
                            </label>
                        </div>

                        {deliveryMethod === "home" && (
                            <p className="mb-6 text-xs text-amber-600">
                                * Home delivery is available only within 5 km of our store.
                            </p>
                        )}

                        <h2 className="mb-6 text-sm font-semibold tracking-wider text-gray-700">
                            BILLING INFO
                        </h2>

                        <div className="space-y-6">
                            {deliveryMethod === "home" ? (
                                <>
                                    {/* Full form for home delivery */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">First Name *</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                                placeholder="First name"
                                                value={firstName}
                                                required
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Last Name *</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                                placeholder="Last name"
                                                value={lastName}
                                                required
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium">Address *</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="Street address"
                                            required
                                            onChange={(e) => setStreet(e.target.value)}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                        <input
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="Town / City"
                                            required
                                            onChange={(e) => setCity(e.target.value)}
                                        />
                                        <input
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="Province"
                                            required
                                            onChange={(e) => setProvince(e.target.value)}
                                        />
                                        <input
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="Postcode / Zip"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <input
                                            type="email"
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="you@example.com"
                                        />
                                        <input
                                            type="tel"
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="07X XXX XXXX"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>

                                    <textarea
                                        rows={4}
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                        placeholder="Notes about your order, e.g. special notes for delivery."
                                    />
                                </>
                            ) : (
                                <>
                                    {/* Minimal form for store pickup */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">First Name *</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                                placeholder="First name"
                                                value={firstName}
                                                required
                                                onChange={(e) => setFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">Last Name *</label>
                                            <input
                                                type="text"
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                                placeholder="Last name"
                                                value={lastName}
                                                required
                                                onChange={(e) => setLastName(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <input
                                            type="email"
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="you@example.com"
                                            required
                                        />
                                        <input
                                            type="tel"
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="07X XXX XXXX"
                                            value={phone}
                                            required
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>

                                    <textarea
                                        rows={4}
                                        className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                        placeholder="Notes about your order, e.g. pickup instructions."
                                    />
                                </>
                            )}
                        </div>
                    </section>

                    {/* Right: Cart Totals + Payment */}
                    <aside className="space-y-6 lg:-mt-6">
                        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-700">
                                CART TOTALS
                            </h3>
                            <dl className="divide-y divide-gray-200 text-sm">
                                <div className="flex items-center justify-between py-3">
                                    <dt className="text-gray-600">Cart Subtotal</dt>
                                    <dd className="font-medium">LKR : {cartTotal.toFixed(2)}</dd>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <dt className="text-gray-600">Processing and Handling</dt>
                                    <dd className="font-medium">Free Shipping</dd>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <dt className="text-gray-600">Order Total</dt>
                                    <dd className="text-lg font-semibold">LKR : {cartTotal.toFixed(2)}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-700">
                                PAYMENT METHOD
                            </h3>
                            <div className="space-y-4 text-sm">
                                <label className="flex cursor-pointer items-start gap-3">
                                    <input type="radio" name="payment" defaultChecked className="mt-1 h-4 w-4" />
                                    <div>
                                        <div className="font-medium">Cash on Delivery</div>
                                        <p className="mt-1 text-gray-600">
                                            Pay with cash when your order is delivered. Please have the exact amount ready to give to the delivery agent, as change may be limited.
                                        </p>
                                    </div>
                                </label>

                                <label className="flex cursor-pointer items-start gap-3">
                                    <input type="radio" name="payment" className="mt-1 h-4 w-4" />
                                    <div><div className="font-medium">Credit / Debit Card</div></div>
                                </label>

                                <label className="flex cursor-pointer items-start gap-3">
                                    <input type="radio" name="payment" className="mt-1 h-4 w-4" />
                                    <div><div className="font-medium">PayPal</div></div>
                                </label>
                            </div>

                            <label className="mt-6 flex items-start gap-3 text-sm">
                                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300" />
                                <span>
                  I have read and accept the{" "}
                                    <a href="#" className="font-medium underline">Terms &amp; Conditions</a>
                </span>
                            </label>

                            <button
                                onClick={placeOrder}
                                className="mt-6 w-full rounded-xl bg-black hover:bg-black/90 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[.99] cursor-pointer"
                            >
                                PLACE ORDER
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
