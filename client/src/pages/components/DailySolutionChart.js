import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { collection, getDocs, where, orderBy, query, limit } from "firebase/firestore";
import { Chart as ChartJS } from "chart.js/auto";
import { db } from "./firebase";

export default function DailySolutionChart({ username }) {
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    setLoading(true);
    async function getGraphSubmissions() {
      const q = query(submissionsCollectionRef, where("user", "==", username));
      const top = query(q, orderBy("date", "asc"), limit(50));
      const recentQuerySnapshot = await getDocs(top);

      const map = new Map();

      recentQuerySnapshot.forEach((doc) => {
        var myDate = new Date(doc.data().date);
        var dateArr = myDate.toDateString().split(" ");
        var day = dateArr[0];
        if (map.has(day)) {
          map.set(day, map.get(day) + 1);
        } else {
          map.set(day, 1);
        }
      });
      const mapArray = Array.from(map);

      setGraphData({
        labels: mapArray.map((data) => data[0]),

        datasets: [
          {
            label: "Daily Submissions",
            data: mapArray.map((data) => data[1]),
            borderColor: "#FFCD29",
            backgroundColor: "white",
            hoverBorderColor: "#FFCD29",
            hoverBackgroundColor: "white",
            scaleShowLabels: false,
            pointBackgroundColor: "#FFCD29",
            pointRadius: 1,
            pointHitRadius: 50,
          },
        ],
      });
    }
    getGraphSubmissions().then(() => setLoading(false));
  }, [username]);

  const submissionsCollectionRef = collection(db, "submissions");
  if (!loading)
    return (
      <Line
        data={graphData}
        options={{
          scales: {
            y: {
              display: true,
              grid: {
                display: false,
              },
              gridLines: {
                display: false,
              },
              ticks: {
                stepSize: 25,
                display: true,
                beginAtZero: true,
                suggestedMin: 0,
              },
            },
            x: {
              ticks: {
                display: false,
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
