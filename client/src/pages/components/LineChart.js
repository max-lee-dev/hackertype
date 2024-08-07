import React, {useState, useEffect} from "react";
import {Chart, Line} from "react-chartjs-2";
import {collection, getDocs, where, orderBy, query, limit} from "firebase/firestore";
import {Chart as ChartJS} from "chart.js/auto";
import {db} from "./firebase";

export default function LineChart({q, days = 7}) {
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState({});
  const [solutionTitles, setSolutionTitles] = useState([]);
  const [curTitle, setCurrentTitle] = useState("");
  const css = document.querySelector(":root");
  const style = getComputedStyle(css);
  var mainText = style.getPropertyValue("--maintext");
  useEffect(() => {
    setLoading(true);

    async function getGraphSubmissions(days) {
      let tempArray = q;
      tempArray = tempArray.sort((a, b) => b.when - a.when);
      tempArray = tempArray.reverse();
      // delete all the submissions that are older than one week
      tempArray = tempArray.filter((data) => {
        const date = new Date(data.when);
        console.log(date)
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= days;
      });


      const tempSolTitles = tempArray.map((data) => data.solution_id);
      setSolutionTitles(tempSolTitles);
      setGraphData({
        labels: tempArray.map((data) => data.date[0] + data.date[1] + data.date[2] + data.date[3]),
        datasets: [
          {
            label: "WPM",
            data: tempArray.map((data) => data.wpm),
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

    ChartJS.defaults.color = style.getPropertyValue("--subtleText");
    ChartJS.defaults.backgroundColor = style.getPropertyValue("--background-color");
    ChartJS.defaults.pointBackgroundColor = style.getPropertyValue("--maintext");
    ChartJS.defaults.pointHoverBackgroundColor = style.getPropertyValue("--maintext");
    ChartJS.defaults.pointHoverBorderColor = style.getPropertyValue("--maintext");
    ChartJS.defaults.borderColor = style.getPropertyValue("--subtleText");
    ChartJS.defaults.scale.grid.color = "transparent";

    getGraphSubmissions(days).then(() => setLoading(false));
  }, [q, days]);
  const submissionsCollectionRef = collection(db, "submissions");
  if (!loading) {
    return (
      <Line
        data={graphData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 50,
              },
              gridLines: {
                display: false,
                width: 0,
              },
            },
            x: {
              ticks: {
                display: false,
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return context.formattedValue + " " + context.dataset.label;
                },

                beforeLabel: function (context) {
                  setCurrentTitle(solutionTitles[context.dataIndex]);
                },

                title: function (context) {
                  return curTitle;
                },
              },
            },

            title: {
              display: false,
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
}
