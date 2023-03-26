import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { collection, getDocs, where, orderBy, query, limit } from "firebase/firestore";
import { Chart as ChartJS } from "chart.js/auto";
import { db } from "./firebase";

export default function LineChart({ username }) {
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({});

  useEffect(() => {
    setLoading(true);
    async function getGraphSubmissions() {
      const q = query(submissionsCollectionRef, where("user", "==", username));
      const top = query(q, orderBy("date", "asc"), limit(50));
      const recentQuerySnapshot = await getDocs(top);
      const tempArray = [];

      recentQuerySnapshot.forEach((doc) => {
        tempArray.push(doc.data());
      });
      setGraphData({
        labels: tempArray.map((data) => data.date[0] + data.date[1] + data.date[2] + data.date[3]),
        datasets: [
          {
            label: "WPM",
            data: tempArray.map((data) => data.wpm),
            borderColor: "#FFCD29",
            backgroundColor: "white",
            hoverBorderColor: "blue",
            hoverBackgroundColor: "grey",
            scaleShowLabels: false,
            pointBackgroundColor: "white",
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
