<!-- App.vue -->
<template>
    <div
        id="app"
        class="w-full bg-gray-100"
    >
        <nav
            class="bg-[#f6f8fa] p-4 fixed w-screen z-10 flex justify-between items-center"
        >
            <router-link
                class="text-black hover:text-gray-500"
                to="/"
                >Home</router-link
            >
            <button
                @click="showSidebar = !showSidebar"
                class="sm:block xl:hidden"
            >
                Toggle Sidebar
            </button>
        </nav>
        <div class="main w-screen">
            <div class="sidebar-wrapper relative">
                <div
                    class="sidebar-mobile bg-slate-900 w-[500px] h-[100%] fixed flex xl:hidden"
                    v-show="showSidebar"
                >
                    <ul class="pt-5">
                        <li>
                            <router-link
                                class="text-white hover:text-gray-500"
                                to="/"
                                >Placeholder sidebar option</router-link
                            >
                        </li>
                    </ul>
                </div>
                <div
                    class="sidebar-desktop bg-slate-900 w-[100%] max-w-[100%] h-[100%] hidden xl:flex absolute"
                >
                    <ul>
                        <li>
                            <router-link
                                class="text-white hover:text-gray-500"
                                to="/"
                                >Placeholder sidebar option</router-link
                            >
                        </li>
                    </ul>
                </div>
            </div>

            <div class="main-content">
                <div
                    class="charts-wrapper grid sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:px-[3rem] pt-[6rem] justify-center items-center"
                >
                    <div class="graph bg-white rounded-2xl p-4 shadow">
                        <LaytimeGraph />
                    </div>
                    <div class="graph bg-white rounded-2xl p-4 shadow">
                        <DeadTimeGraph />
                    </div>
                    <div class="graph bg-white rounded-2xl p-4 shadow">
                        <DailyBerthGraph />
                    </div>
                    <div class="graph bg-white rounded-2xl p-4 shadow">
                        <VariousMetricsGraph />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from "vue";
    import LaytimeGraph from "./components/LaytimeGraph.vue";
    import DeadTimeGraph from "./components/DeadTimeGraph.vue";
    import DailyBerthGraph from "./components/DailyBerthGraph.vue";
    import VariousMetricsGraph from "./components/VariousMetricsGraph.vue";

    const showSidebar = ref(false);
</script>

<style scoped>
    .main {
        display: grid;
        grid-template-columns: 2fr 8fr;
    }
    @media (max-width: 1280px) {
        .main {
            grid-template-columns: 0 1fr;
        }
    }

    .sidebar-wrapper {
        height: 100%;
    }

    .charts-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        align-items: stretch;
    }
    .charts-wrapper .graph {
        width: 100%;
        aspect-ratio: 3/2;
        max-width: calc(50% - 1rem);
    }

    @media (max-width: 768px) {
        .main {
            grid-template-columns: 1fr;
        }

        .charts-wrapper {
            grid-template-columns: repeat(1, minmax(300px, 1fr));
            display: grid;
            grid-gap: 1rem;
            overflow-x: auto;
        }

        .charts-wrapper .graph {
            max-width: 100%;
        }
    }

    .sidebar-mobile {
        padding-top: 75px;
        justify-content: center;
    }
    .sidebar-desktop {
        padding-top: 75px;
        justify-content: center;
    }
</style>
