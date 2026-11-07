"use client"

import { useReportWebVitals } from "next/web-vitals"
import { sendGAEvent } from "@next/third-parties/google"

type ReportWebVitals = Parameters<typeof useReportWebVitals>[0]

const reportWebVitals: ReportWebVitals = (metric) => {
  sendGAEvent("event", "web_vitals", {
    metric_name: metric.name,
    metric_id: metric.id,
    metric_value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
    non_interaction: true,
  })
}

export function WebVitals() {
  useReportWebVitals(reportWebVitals)
  return null
}
