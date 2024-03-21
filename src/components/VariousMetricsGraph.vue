<template>
    <div>
        <h2>Various Metrics Pie</h2>
        <div v-if="loading">Loading...</div>
        <div v-else-if="error">Failed to load data.</div>
        <div v-else>
            <Pie
                :data="chartData"
                :options="options"
            />
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from "vue";
    import { Chart as ChartJS, ArcElement, Legend, Title } from "chart.js";
    import { Pie } from "vue-chartjs";

    import axios from "axios";
    import { formatToDate } from "/src/utils.js";

    const chartData = ref(null);
    const loading = ref(true);
    const error = ref(false);

    const options = ref({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "Various Metrics Pie Chart",
            },
            legend: {
                display: true,
            },
        },
    });

    onMounted(async () => {
        ChartJS.register(ArcElement, Legend, Title);

        try {
            const response = await axios.get(
                "http://178.18.253.143:8080/sp-api/spr_Funnel/2024-02-01%2000:00:00&2024-02-29%2000:00:00"
            );
            if (response.status !== 200) {
                throw new Error("Failed to fetch data");
            }

            let data = response.data.recordset[0];
            let entries = Object.entries(data);
            entries.sort((a, b) => b[1] - a[1]);
            data = Object.fromEntries(entries);

            const labels = Object.keys(data);

            const datasets = [
                {
                    data: Object.values(data),
                    backgroundColor: labels.map(
                        () =>
                            `#${Math.floor(Math.random() * 16777215).toString(
                                16
                            )}`
                    ),
                },
            ];

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
        max-height: 400px;
    }
</style>
