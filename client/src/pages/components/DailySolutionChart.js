import React, {useState, useEffect} from "react";
import {Line} from "react-chartjs-2";
import {collection, getDocs, where, orderBy, query, limit} from "firebase/firestore";
import {Chart as ChartJS} from "chart.js/auto";
import {db} from "./firebase";

export default function DailySolutionChart({q}) {
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({});
  const css = document.querySelector(":root");
  const style = getComputedStyle(css);
  var mainText = style.getPropertyValue("--maintext");
  useEffect(() => {
    setLoading(true);

    async function getGraphSubmissions() {
      const top = query(q, orderBy("when", "desc"), limit(50));
      const recentQuerySnapshot = await getDocs(top);

      const map = new Map();

      recentQuerySnapshot.forEach((doc) => {
        var dateArr = doc.data().date;

        var day = dateArr[0];
        if (map.has(day)) {
          map.set(day, map.get(day) + 1);
        } else {
          map.set(day, 1);
        }
      });
      let mapArray = Array.from(map);
      mapArray = mapArray.reverse();
      setGraphData({
        labels: mapArray.map((data) => data[0]),

        datasets: [
          {
            label: "Daily Submissions",
            data: mapArray.map((data) => data[1]),
            borderColor: mainText,
            backgroundColor: "white",
            hoverBorderColor: "#FFCD29",
            hoverBackgroundColor: "white",
            scaleShowLabels: false,
            pointBackgroundColor: "#FFCD29",
            pointRadius: 1,
            pointHitRadius: 100,
          },
        ],
      });
    }

    getGraphSubmissions().then(() => setLoading(false));
  }, [q]);

  const submissionsCollectionRef = collection(db, "submissions");
  if (!loading)
    return (
      <Line
        data={graphData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              display: true,
              grid: {
                display: false,
              },
              gridLines: {
                display: false,
              },
              ticks: {
                stepSize: 1,
                display: true,

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
