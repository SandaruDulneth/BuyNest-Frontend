import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function CheckoutPage() {
    const { state } = useLocation();
    const cart = state?.cart || [];
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ defaultValues: { deliveryMethod: "pickup" } });

    const deliveryMethod = watch("deliveryMethod");

    const getQty = (item) => Number(item.qty ?? item.quantity ?? 0);
    const cartTotal = useMemo(
        () => cart.reduce((sum, item) => sum + Number(item.price) * getQty(item), 0),
        [cart]
    );

    async function onSubmit(data) {
        const token = localStorage.getItem("token");
        if (!token) return toast.error("Please login to place order");
        if (cart.length === 0) return toast.error("Your cart is empty");

        const orderInformation = {
            name: `${data.firstName} ${data.lastName}`.trim(),
            phone: data.phone.trim(),
            deliveryMethod: data.deliveryMethod,
            address:
                data.deliveryMethod === "home"
                    ? `${data.street} ${data.city} ${data.province}`.trim()
                    : "",
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

            if (data.deliveryMethod === "home") {
                const orderId = res.data.orderId;
                await axios.post(
                    "http://localhost:5000/api/delivery",
                    { orderId, phone: data.phone },
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
                    <Link to="/" className="hover:underline">
                        Shopping Cart
                    </Link>{" "}
                    / <span className="text-gray-700">Checkout</span>
                </p>
                <h1 className="text-left text-4xl font-bold">Checkout</h1>

                <div className="mt-2 grid grid-cols-1 gap-10 lg:grid-cols-3 items-start">
                    {/* Left column (form) */}
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="lg:col-span-2 space-y-8"
                    >
                        {/* Delivery method */}
                        <section>
                            <h2 className="mb-6 text-sm font-semibold tracking-wider text-gray-700">
                                DELIVERY METHOD
                            </h2>
                            <div className="mb-6 flex gap-6">
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <input
                                        type="radio"
                                        value="pickup"
                                        {...register("deliveryMethod")}
                                        className="h-4 w-4 text-emerald-600"
                                    />
                                    Store Pickup
                                </label>
                                <label className="flex items-center gap-2 text-sm font-medium">
                                    <input
                                        type="radio"
                                        value="home"
                                        {...register("deliveryMethod")}
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
                        </section>

                        {/* Billing info */}
                        <section>
                            <h2 className="mb-6 text-sm font-semibold tracking-wider text-gray-700">
                                BILLING INFO
                            </h2>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            First Name *
                                        </label>
                                        <input
                                            {...register("firstName", {
                                                required: "First name is required",
                                            })}
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="First name"
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-xs">
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-medium">
                                            Last Name *
                                        </label>
                                        <input
                                            {...register("lastName", {
                                                required: "Last name is required",
                                            })}
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="Last name"
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-xs">
                                                {errors.lastName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {deliveryMethod === "home" && (
                                    <>
                                        <div>
                                            <label className="mb-2 block text-sm font-medium">
                                                Street Address *
                                            </label>
                                            <input
                                                {...register("street", {
                                                    required: "Street address is required",
                                                })}
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                                placeholder="Street address"
                                            />
                                            {errors.street && (
                                                <p className="text-red-500 text-xs">
                                                    {errors.street.message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                            <input
                                                {...register("city", { required: "City is required" })}
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                                placeholder="Town / City"
                                            />
                                            <input
                                                {...register("province", {
                                                    required: "Province is required",
                                                    pattern: {
                                                        value: /^[A-Za-z\s]+$/,
                                                        message: "Province must contain only letters",
                                                    },
                                                })}
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                                placeholder="Province"
                                            />
                                            <input
                                                {...register("zip")}
                                                className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                                placeholder="Postcode / Zip"
                                            />
                                        </div>
                                    </>
                                )}

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <input
                                            type="email"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Invalid email format",
                                                },
                                            })}
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="you@example.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="tel"
                                            {...register("phone", {
                                                required: "Phone number is required",
                                                pattern: {
                                                    value: /^\d{10}$/,
                                                    message: "Phone must be exactly 10 digits",
                                                },
                                            })}
                                            className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm outline-none focus:border-black"
                                            placeholder="07X XXX XXXX"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </section>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="mt-6 w-full rounded-xl bg-black hover:bg-black/90 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[.99] cursor-pointer"
                        >
                            PLACE ORDER
                        </button>
                    </form>

                    {/* Right column (Cart + Payment) */}
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
                                    <dd className="text-lg font-semibold">
                                        LKR : {cartTotal.toFixed(2)}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-700">
                                PAYMENT METHOD
                            </h3>
                            <div className="space-y-4 text-sm">
                                <label className="flex cursor-pointer items-start gap-3">
                                    <input
                                        type="radio"
                                        name="payment"
                                        defaultChecked
                                        className="mt-1 h-4 w-4"
                                    />
                                    <div>
                                        <div className="font-medium">Cash on Delivery</div>
                                        <p className="mt-1 text-gray-600 text-xs">
                                            Pay with cash when your order is delivered.
                                        </p>
                                    </div>
                                </label>
                                <label className="flex cursor-pointer items-start gap-3">
                                    <input type="radio" name="payment" className="mt-1 h-4 w-4" />
                                    <div className="font-medium">Credit / Debit Card</div>
                                </label>
                                <label className="flex cursor-pointer items-start gap-3">
                                    <input type="radio" name="payment" className="mt-1 h-4 w-4" />
                                    <div className="font-medium">PayPal</div>
                                </label>
                            </div>

                            <label className="mt-6 flex items-start gap-3 text-sm">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded border-gray-300"
                                />
                                <span>
                  I have read and accept the{" "}
                                    <a href="#" className="font-medium underline">
                    Terms &amp; Conditions
                  </a>
                </span>
                            </label>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
