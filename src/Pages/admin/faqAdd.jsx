import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddFaqPage() {
    const [faqId, setFaqId] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const navigate = useNavigate();

    async function addFaq() {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login first");
            return;
        }

        if (!faqId || !question || !answer) {
            toast.error("Please fill all required fields");
            return;
        }

        const body = { faqId, question, answer };

        try {
            await axios.post("http://localhost:5000/api/faqs", body, {
                headers: { Authorization: "Bearer " + token },
            });
            toast.success("FAQ added successfully");
            navigate("/admin/faqs");
        } catch (e) {
            toast.error(e.response?.data?.message || "Failed to add FAQ");
            console.error(e);
        }
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <input
                type="text"
                placeholder="FAQ ID"
                className="input input-bordered w-full max-w-lg"
                value={faqId}
                onChange={(e) => setFaqId(e.target.value)}
            />

            <input
                type="text"
                placeholder="Question"
                className="input input-bordered w-full max-w-lg mt-3"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />

            <textarea
                placeholder="Answer"
                className="textarea textarea-bordered w-full max-w-lg mt-3 min-h-[140px]"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />

            <div className="w-full max-w-lg flex justify-between items-center mt-4">
                <Link
                    to="/admin/faqs"
                    className="bg-red-500 text-white font-bold py-2 px-4 rounded"
                >
                    Cancel
                </Link>
                <button
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded"
                    onClick={addFaq}
                >
                    Add FAQ
                </button>
            </div>
        </div>
    );
}
