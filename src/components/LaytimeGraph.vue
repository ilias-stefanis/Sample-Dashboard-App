<template>
    <div>
        <h2>Laytime per Vessel</h2>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Failed to fetch data.</div>
        <div v-else>
            <Bar
                :data="chartData"
                :options="options"
            />
        </div>

        <div class="buttons-wrapper">
            <button
                :class="{ active: current === states.avgLaytime }"
                @click="current = states.avgLaytime"
            >
                Average Laytime
            </button>
            <button
                :class="{ active: current === states.totalLaytime }"
                @click="current = states.totalLaytime"
            >
                Total Laytime
            </button>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, watch } from "vue";
    import { formatToDate } from "/src/utils.js";
    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        BarElement,
        Title,
        Tooltip,
        Legend,
    } from "chart.js";
    import { Bar } from "vue-chartjs";
    import axios from "axios";

    const chartData = ref(null);
    const loading = ref(true);
    const error = ref(false);
    const states = {
        avgLaytime: "avgLaytime",
        totalLaytime: "totalLaytime",
    };
    const current = ref(states.avgLaytime);
    const dataset = ref([]);

    const options = ref({
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value, index, values) {
                        return value;
                    },
                },
                stacked: true,
            },
            x: {
                stacked: true,
            },
        },
        plugins: {
            title: {
                display: true,
                text: "Avg Laytime per Vessel",
            },
            legend: {
                display: false,
            },
        },
    });

    onMounted(async () => {
        ChartJS.register(
            CategoryScale,
            LinearScale,
            PointElement,
            BarElement,
            Title,
            Tooltip,
            Legend
        );

        try {
            const response = await axios.get(
                "http://178.18.253.143:8080/sp-api/spr_topXLaytime/2024-02-01%2000:00:00&2024-02-29%2000:00:00&15"
            );
            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

            dataset.value = response.data.recordset
                .map((item) => {
                    return {
                        vesselName: item.Vessel,
                        avgLaytime: item.AvgLaytime,
                        totalLaytime: item.TotalLaytime,
                    };
                })
                .sort((a, b) => b.avgLaytime - a.avgLaytime);

            const labels = dataset.value.map((item) => item.vesselName);

            updateChartData(states.avgLaytime);
        } catch (err) {
            console.error(err);
            error.value = true;
        } finally {
            loading.value = false;
        }
    });

    const updateChartData = (current) => {
        const datasets = [
            {
                label: current,
                data: dataset.value
                    .map((item) => item[current])
                    .sort((a, b) => b - a),
                fill: false,
                borderColor: `#${Math.floor(Math.random() * 16777215).toString(
                    16
                )}`,
            },
        ];

        const maxVal = Math.max(...dataset.value.map((item) => item[current]));
        options.value.scales.y.max = maxVal;

        const currentChartTitle =
            current === states.avgLaytime
                ? "Avg Laytime per Vessel"
                : "Total Laytime per Vessel";
        options.value.plugins.title.text = currentChartTitle;

        chartData.value = {
            labels: dataset.value.map((item) => item.vesselName),
            datasets: datasets,
        };
    };

    watch(current, (newVal) => {
        updateChartData(newVal);
    });
</script>

<style scoped>
    canvas {
        min-height: 300px;
    }

    .buttons-wrapper {
        display: flex;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
    }
    .buttons-wrapper button {
        padding: 0.5rem 1rem;
        border: none;
        background-color: #f3f4f6;
        cursor: pointer;
        border-radius: 30px;
    }
    .buttons-wrapper button.active {
        background-color: #2563eb;
        color: white;
    }
</style>
