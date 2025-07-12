import React, { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js'
import { Chart } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
)

const ChartRenderer = ({ config }) => {
  const chartRef = useRef(null)

  const defaultOptions = {    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: config.title ? true : false,
        text: config.title || ''
      }
    }
  }

  const mergedOptions = {
    ...defaultOptions,
    ...config.options
  }

  return (
    <div className="w-full h-64 my-4">
      <Chart
        ref={chartRef}
        type={config.type || 'bar'}
        data={config.data}
        options={mergedOptions}
      />
    </div>
  )
}

export default ChartRenderer