import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { collection, getDocs, where, orderBy, query, limit } from "firebase/firestore";
import { Chart as ChartJS } from "chart.js/auto";
import { db } from "./firebase";

export default function WpmLineChart({ givenData }) {
  const [graphData, setGraphData] = useState({});
  const [loading, setLoading] = useState(true);
  const css = document.querySelector(":root");
  const style = getComputedStyle(css);
  var mainText = style.getPropertyValue("--maintext");
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
            borderColor: mainText,
            backgroundColor: "white",
            scaleShowLabels: false,
            pointBackgroundColor: "#FFCD29",
            pointRadius: 1,
            pointHitRadius: 100,
          },
        ],
      });
    }
    getWPMGraph();
    setLoading(false);
  }, []);
  ChartJS.defaults.color = style.getPropertyValue("--subtleText");
  ChartJS.defaults.backgroundColor = style.getPropertyValue("--background-color");
  ChartJS.defaults.pointBackgroundColor = style.getPropertyValue("--maintext");
  ChartJS.defaults.pointHoverBackgroundColor = style.getPropertyValue("--maintext");
  ChartJS.defaults.pointHoverBorderColor = style.getPropertyValue("--maintext");
  ChartJS.defaults.borderColor = style.getPropertyValue("--subtleText");
  ChartJS.defaults.scale.grid.color = "transparent";

  if (!loading)
    return (
      <Line
        data={graphData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 50,
                display: true,
                beginAtZero: true,
              },
              gridLines: {
                display: false,
                width: 0,
              },
            },
            x: {
              ticks: {
                stepSize: 10,
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
