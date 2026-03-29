import { useState, useEffect } from "react";
import axios from "axios";

export default function GroceryList() {
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState("");

    const fetchGrocery = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/grocery`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setItems(res.data.items);
        } catch (err) {
            console.error("Failed to fetch grocery list", err);
        }
    };

    useEffect(() => {
        fetchGrocery();
    }, []);

    const handleAddItem = async (e) => {
        e.preventDefault();

        if (newItem.trim() === "") return;

        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/grocery/add`,
                { item: newItem },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setItems(res.data.grocery.items);
            setNewItem("");
        } catch (err) {
            console.error("Failed to add item", err);
        }
    };

    const generateGrocery = async () => {
    try {
        const token = localStorage.getItem("token");  

        if (!token) {
            alert("Please login again!");
            return;
        }

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/grocery/generate`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data.grocery.items);  
    } catch (err) {
        console.error("Failed to generate grocery list", err);
    }
};
    const handleDeleteItem = async (itemToDelete) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/grocery/delete`,
                { item: itemToDelete },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setItems(res.data.grocery.items);
        } catch (err) {
            console.error("Failed to delete item", err);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-4 py-10 bg-cover bg-no-repeat bg-fixed" style={{
        backgroundImage: `url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg')`,
      }}>
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-10 transition-all duration-300 opacity-95" >
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
                    Grocery List
                </h2>

                <div className="flex justify-center mb-6">
                    <button
                        onClick={generateGrocery}
                        className="bg-slate-800 text-white px-4 py-2 font-semibold rounded hover:bg-slate-900 dark:bg-white dark:text-slate-700"
                    >
                        Generate from Recipes
                    </button>
                </div>

                <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        placeholder="Add new item"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className="flex-1 p-2 rounded-md border border-slate-600 text-md font-semibold "
                    />
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Add
                    </button>
                </form>

                {items.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
                        No items found.
                    </p>
                ) : (
                    <ul className="list-none text-lg md:text-xl text-gray-700 dark:text-gray-300 space-y-2">
                        {items.map((item, index) => (
                            <li key={index} className="flex justify-between items-center border-2 py-1 px-3 rounded-md">
                                {item}
                                <button
                                    onClick={() => handleDeleteItem(item)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
