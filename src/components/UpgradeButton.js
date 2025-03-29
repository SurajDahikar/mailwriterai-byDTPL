import React from "react";

const UpgradeButton = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
            Upgrade to Premium
        </button>
    );
};

export default UpgradeButton;
