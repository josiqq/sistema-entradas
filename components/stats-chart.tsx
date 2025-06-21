"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Lun",
    total: 120,
  },
  {
    name: "Mar",
    total: 180,
  },
  {
    name: "Mié",
    total: 250,
  },
  {
    name: "Jue",
    total: 320,
  },
  {
    name: "Vie",
    total: 450,
  },
  {
    name: "Sáb",
    total: 380,
  },
  {
    name: "Dom",
    total: 290,
  },
]

export function StatsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
