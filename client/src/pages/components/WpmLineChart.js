import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { collection, getDocs, where, orderBy, query, limit } from "firebase/firestore";
import { Chart as ChartJS } from "chart.js/auto";
import { db } from "./firebase";

export default function WpmLineChart({ givenData }) {
  const [graphData, setGraphData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    function getWPMGraph() {
      const map = new Map();
      for (let i = 1; i < givenData.length; i++) {
        map.set(i, givenData[i]);
      }
      const mapArray = Array.from(map);
      setGraphData({
        labels: mapArray.map((data) => data[0]),

        datasets: [
          {
            label: "WPM",
            data: mapArray.map((data) => data[1]),
            borderColor: "#FFCD29",
            backgroundColor: "white",
            hoverBorderColor: "#FFCD29",
            hoverBackgroundColor: "white",
            scaleShowLabels: false,
            pointBackgroundColor: "#FFCD29",
          },
        ],
      });
    }
    getWPMGraph();
    setLoading(false);
  }, []);

  if (!loading)
    return (
      <Line
        data={graphData}
        options={{
          scales: {
            y: {
              ticks: {
                stepSize: 25,
                display: true,
                beginAtZero: true,
                suggestedMin: 0,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "",
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    );
}
