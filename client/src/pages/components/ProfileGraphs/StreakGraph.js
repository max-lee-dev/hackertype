import React, {useEffect, useState} from "react";
import {Line} from "react-chartjs-2";
import {Chart as ChartJS} from "chart.js/auto";
import {collection, getDocs, where, orderBy, query, limit} from "firebase/firestore";

export default function StreakGraph({user}) {
  const ogDay = 1703662239000 - 27039000;
  const today = Date.parse(new Date());
  const dailyNum = Math.floor((today - ogDay) / (1000 * 60 * 60 * 24));
  const [streakData, setStreakData] = useState([]);

  useEffect(() => {
    let tempArray = user?.streakArr ? user?.streakArr : [];
    setStreakData(tempArray);
    streakData.map((data) => console.log(data["dailyNum"]));

  }, [user]);


  const css = document.querySelector(":root");
  const style = getComputedStyle(css);
  var mainText = style.getPropertyValue("--maintext");
  const graphData = {
    labels: streakData.map((data) => data["dailyNum"]),
    datasets: [
      {
        label: "Streak",
        data: streakData.map((data) => data["streak"]),
        borderColor: mainText,
        backgroundColor: "white",
        scaleShowLabels: false,
        pointBackgroundColor: "#FFCD29",

        pointRadius: 1,
        pointHitRadius: 100,
      },
    ],
  };
  ChartJS.defaults.color = style.getPropertyValue("--subtleText");
  ChartJS.defaults.backgroundColor = style.getPropertyValue("--background-color");
  ChartJS.defaults.pointBackgroundColor = style.getPropertyValue("--maintext");
  ChartJS.defaults.pointHoverBackgroundColor = style.getPropertyValue("--maintext");
  ChartJS.defaults.pointHoverBorderColor = style.getPropertyValue("--maintext");
  ChartJS.defaults.borderColor = style.getPropertyValue("--subtleText");
  ChartJS.defaults.scale.grid.color = "transparent";
  return (
    <Line
      data={graphData}
      options={{
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              display: true,
              beginAtZero: true,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
    />
  );
}