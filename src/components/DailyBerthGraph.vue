<template>
    <div>
        <h2>Daily Berth</h2>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Failed to fetch data.</div>
        <div v-else>
            <Line
                :data="chartData"
                :options="options"
            />
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import { formatToDate, trimNumber } from "/src/utils.js";
    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
    } from "chart.js";
    import { Line } from "vue-chartjs";
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
            },
        },
        plugins: {
            title: {
                display: true,
                text: "Daily Berth Graph",
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
            LineElement,
            Title,
            Tooltip,
            Legend
        );

        try {
            const response = await axios.get(
                "http://178.18.253.143:8080/sp-api/spr_occupancyByTime/2024-02-01%2000:00:00&2024-02-29%2000:00:00&0"
            );
            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

            const data = response.data.recordset.map((item) => {
                return {
                    date: item.DT,
                    AllBerths: item.AllBerths,
                };
            });

            const labels = data.map((item) => formatToDate(item.date));

            const datasets = Object.keys(data)
                .filter((key) => key !== "date")
                .map((key) => {
                    return {
                        label: key,
                        data: data.map((item) => trimNumber(item.AllBerths)),
                        fill: false,
                        borderColor: `#${Math.floor(
                            Math.random() * 16777215
                        ).toString(16)}`,
                    };
                });

            const maxVal = Math.max(data.map((item) => item.AllBerths));
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
