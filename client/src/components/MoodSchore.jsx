import React from "react";
import { Line, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    LinearScale,
    PointElement,
    CategoryScale,
    Tooltip,
    Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(LineElement, BarElement, LinearScale, PointElement, CategoryScale, Tooltip, Legend);

const MoodScoreGraph = () => {
    const lineData = {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [
            {
                label: "Mood Score",
                data: [3, 4, 5, 3, 4, 5, 6],
                fill: false,
                backgroundColor: "#3b82f6",
                borderColor: "#3b82f6",
                tension: 0.3,
            },
        ],
    };

    const barData = {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [
            {
                label: "Activities Completed",
                data: [2, 3, 4, 1, 3, 2, 5],
                backgroundColor: "#34d399",
                borderColor: "#34d399",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, max: 10 },
            x: { beginAtZero: true },
        },
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
            {/* Line Chart */}
            <div style={{ width: "45%", maxWidth: "600px" }}>
                <h3 className="text-center">Mood Tracker</h3>
                <Line data={lineData} options={options} />
            </div>

            {/* Bar Chart */}
            <div style={{ width: "45%", maxWidth: "600px" }}>
                <h3 className="text-center">Activities Completed Over Time</h3>
                <Bar data={barData} options={options} />
            </div>
        </div>
    );
};

export default MoodScoreGraph;
