import React, {useState, useEffect} from "react";
import {Line} from "react-chartjs-2";
import {collection, getDocs, where, orderBy, query, limit} from "firebase/firestore";
import {Chart as ChartJS} from "chart.js/auto";
import {db} from "./firebase";

export default function averageWPMArray({user}) {
  const [wpmArray, setWpmArray] = useState([]);
  useEffect(() => {
    async function getWPM() {

    }

    getWPM();

  })
}