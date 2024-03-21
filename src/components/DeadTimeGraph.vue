<template>
    <div>
        <h2>Avg Dead Time per Berthing</h2>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Failed to fetch data.</div>
        <div v-else>
            <Bar
                :data="chartData"
                :options="options"
            />
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
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
                text: "Avg Dead Time per Berthing Bar Chart",
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
                "http://178.18.253.143:8080/sp-api/spr_TopXVesselsDeadTime/15"
            );
            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

            const dataset = response.data.recordset.map((item) => {
                return {
                    vesselName: item.VNAME,
                    avgDeadTime: item.GenAvgDeadTimePerBerthing,
                };
            });
            dataset.sort((a, b) => b.avgDeadTime - a.avgDeadTime);

            const labels = dataset.map((item) => item.vesselName);

            const datasets = [
                {
                    label: "Avg Dead Time",
                    data: dataset.map((item) => item.avgDeadTime),
                    fill: false,
                    borderColor: `#${Math.floor(
                        Math.random() * 16777215
                    ).toString(16)}`,
                },
            ];

            const maxVal = Math.max(dataset.map((item) => item.avgDeadTime));
            options.value.scales.y.max = maxVal;

            chartData.value = {
                labels: labels,
                datasets: datasets,
            };
        } catch (err) {
            console.error(err);
            error.value = true;
        } finally {
            loading.value = false;
        }
    });
</script>

<style scoped>
    canvas {
        min-height: 300px;
    }
</style>
