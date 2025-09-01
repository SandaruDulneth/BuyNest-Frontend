import ProductCard from "../../components/ProductCard.jsx";

export default function Test(){
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ProductCard
                name="Deluxe Whole Cashews, Salted"
                price="750"
                labelledPrice="1000"
                imageUrl="/images/lays.jpeg"
            />
            <ProductCard
                name="Lay's Potato Chips, Party Size"
                price="800"
                labelledPrice="1000"
                imageUrl="/images/lays.jpeg"
            />
            <ProductCard
                name="Tostitos Medium Salsa Con Queso"
                price="800"
                labelledPrice="1900"
                imageUrl="/images/lays.jpeg"
            />
            <ProductCard
                name="Baked Snack Cheese Crackers"
                price="800"
                labelledPrice="1500"
                imageUrl="/images/lays.jpeg"
            />
        </div>

    )
};