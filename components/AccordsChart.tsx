"use client";

import React from "react";
import { motion } from "framer-motion";

const accords = [
  { name: "ambre", width: "100%", color: "#bf6c22" },
  { name: "épicé chaud", width: "85%", color: "#a63311" },
  { name: "oud", width: "80%", color: "#4f3a33" },
  { name: "rose", width: "70%", color: "#a81652" },
  { name: "fumé", width: "65%", color: "#66606a" },
  { name: "fruité", width: "60%", color: "#a53a26" },
  { name: "cuir", width: "55%", color: "#543932" },
  { name: "boisé", width: "50%", color: "#654124" },
  { name: "balsamique", width: "45%", color: "#8a6d54" },
  { name: "sucré", width: "40%", color: "#8c2e35" },
];

const AccordsChart: React.FC = () => {
  return (
    <div className="w-full flex-col items-center mt-6">
      <h3 className="text-white/80 font-bold uppercase tracking-widest text-[11px] mb-4 text-center font-sans">
        Accords Principaux
      </h3>
      <div className="flex flex-col gap-1 items-center max-w-[300px] mx-auto w-full">
        {accords.map((accord, idx) => (
          <div key={accord.name} className="w-full h-7 flex relative bg-black/20 rounded-md overflow-hidden ring-1 ring-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: accord.width }}
              transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
              className="h-full rounded-r-md flex items-center shadow-lg"
              style={{ backgroundColor: accord.color }}
            >
              <span className="text-white text-[11px] font-bold tracking-widest uppercase ml-3 drop-shadow-md">
                {accord.name}
              </span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccordsChart;
