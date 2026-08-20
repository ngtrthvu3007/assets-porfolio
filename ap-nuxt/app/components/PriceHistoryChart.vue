<script setup lang="ts">
import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import type { PriceDetailLatest, PriceHistoryPoint } from "@/types/prices";
import { formatCurrency, formatIsoTimestamp } from "@/utils/formatters";

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

const props = defineProps<{ history: PriceHistoryPoint[]; latest?: PriceDetailLatest }>();

// When there's no history to derive a range from, anchor the y-axis around
// the current price instead of an arbitrary 0-100 — keeps the empty chart's
// scale meaningful (right unit, right order of magnitude).
const toFallbackAxisRange = (latest?: PriceDetailLatest) => {
  const prices = [latest?.buyPrice, latest?.sellPrice].filter(
    (price): price is number => price !== null && price !== undefined,
  );

  if (!prices.length) return { min: 0, max: 100 };

  const center = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const padding = Math.max(center * 0.1, 1);

  return { min: center - padding, max: center + padding };
};

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const readCssColor = (variable: string): string => {
  if (import.meta.server) return "transparent";
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

const buildChart = () => {
  if (!canvasRef.value) return;

  const labels = props.history.map((point) => formatIsoTimestamp(point.sourceUpdatedAt));
  const buyData = props.history.map((point) => point.buyPrice);
  const sellData = props.history.map((point) => point.sellPrice);

  const buyColor = readCssColor("--accent");
  const sellColor = readCssColor("--destructive");
  const gridColor = readCssColor("--border");
  const textColor = readCssColor("--muted-foreground");

  chart = new Chart(canvasRef.value, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Mua vào",
          data: buyData,
          borderColor: buyColor,
          backgroundColor: buyColor,
          tension: 0,
          pointRadius: 3,
          borderWidth: 2,
        },
        {
          label: "Bán ra",
          data: sellData,
          borderColor: sellColor,
          backgroundColor: sellColor,
          tension: 0,
          pointRadius: 3,
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: textColor,
            usePointStyle: true,
            pointStyle: "circle",
            boxHeight: 10,
            boxWidth: 20,
            padding: 24,
            font: { size: 12, weight: 500 },
          },
        },
        tooltip: {
          callbacks: {
            label: (context) => `${context.dataset.label}: ${formatCurrency(context.parsed.y ?? 0)}`,
          },
        },
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { color: textColor } },
        y: {
          grid: { color: gridColor },
          ticks: { color: textColor },
          ...(props.history.length ? {} : toFallbackAxisRange(props.latest)),
        },
      },
    },
    plugins: [
      {
        id: "emptyStateText",
        afterDraw: (instance) => {
          if (instance.data.labels?.length) return;

          const { ctx, chartArea } = instance;
          const centerX = (chartArea.left + chartArea.right) / 2;
          const centerY = (chartArea.top + chartArea.bottom) / 2;

          ctx.save();
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = textColor;
          ctx.font = "14px sans-serif";
          ctx.fillText("Không có dữ liệu cho khoảng thời gian này", centerX, centerY);
          ctx.restore();
        },
      },
    ],
  });
};

const destroyChart = () => {
  chart?.destroy();
  chart = null;
};

onMounted(buildChart);
onBeforeUnmount(destroyChart);

watch(
  () => props.history,
  () => {
    destroyChart();
    buildChart();
  },
);
</script>

<template>
  <div class="h-72 w-full">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
