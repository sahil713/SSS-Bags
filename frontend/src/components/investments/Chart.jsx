import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

export default function Chart({ data = [], height = 300, type = 'line' }) {
  const chartRef = useRef(null)
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart = createChart(chartRef.current, {
      layout: {
        background: { type: 'solid', color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: 'rgba(156, 163, 175, 0.1)' },
        horzLines: { color: 'rgba(156, 163, 175, 0.1)' },
      },
      width: chartRef.current.clientWidth,
      height,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    })

    if (data.length > 0) {
      const series = type === 'candlestick'
        ? chart.addCandlestickSeries({
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
          })
        : chart.addLineSeries({
            color: '#8b5cf6',
            lineWidth: 2,
          })

      const formatted = data.map((d) => {
        const t = d.time || d.date
        const timeStr = typeof t === 'string' ? t : (t ? new Date(t).toISOString().slice(0, 10) : null)
        return {
          time: timeStr,
          open: Number(d.open) || 0,
          high: Number(d.high) || 0,
          low: Number(d.low) || 0,
          close: Number(d.close) || Number(d.value) || 0,
          value: Number(d.close) || Number(d.value) || 0,
        }
      }).filter((d) => d.time)

      series.setData(formatted)
      chart.timeScale().fitContent()
    }

    chartInstanceRef.current = chart

    const handleResize = () => {
      if (chartRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({ width: chartRef.current.clientWidth })
      }
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.remove()
      chartInstanceRef.current = null
    }
  }, [data, height, type])

  return <div ref={chartRef} className="w-full" style={{ height }} />
}
