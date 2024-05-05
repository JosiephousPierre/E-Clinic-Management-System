<template>
    <div class="bgImg">
        <div class="container">
            <h1>Total For This Year</h1>
            <div class="card flex justify-content-center">
                <div class="chart-container">
                    <Chart type="doughnut" :data="chartData" :options="chartOptions" class="chart-small" />
                </div>
            </div>
        </div>
    </div>


</template>

<style scoped>
.bgImg{
  display: flex;
  position:relative;
  justify-content: center;
  align-items: top;
  height: 100vh;
  background-image: url('../assets/UIC.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 20px;
}
.container{
    width: 80%;
    height: max-content;
    backdrop-filter: blur(3px);
    background-color: rgba(255, 255, 255, 0.5);
    padding: 10px;
}
.chart-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.chart-small {
    width: 500px;
    height: 500px;
}
    
</style>

<script setup>
import { ref, onMounted } from "vue";
import Chart from 'primevue/chart';

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

const chartData = ref();
const chartOptions = ref(null);

const setChartData = () => {
    const documentStyle = getComputedStyle(document.body);
    const listAddedString  = localStorage.getItem('checkout');
    let listAdded = [];
    if (listAddedString) {
        listAdded = JSON.parse(listAddedString);
    }
    const fever = listAdded?.filter(data => data.description === 'Fever').length || 0;
    const headache = listAdded?.filter(data => data.description === 'Headache').length || 0;
    const cold = listAdded?.filter(data => data.description === 'Cold').length || 0;
    const other = listAdded?.filter(data => data.description !== 'Fever' && data.description !== 'Headache' && data.description !== 'Cold').length || 0;
    return {
        labels: ['Fever', 'Headache', 'Cold','Other Symptons'],
        datasets: [
            {
                data: [fever, headache, cold,other],
                backgroundColor: [documentStyle.getPropertyValue('--blue-500'), documentStyle.getPropertyValue('--yellow-500'), documentStyle.getPropertyValue('--green-500'), documentStyle.getPropertyValue('--red-500')],
                hoverBackgroundColor: [documentStyle.getPropertyValue('--blue-400'), documentStyle.getPropertyValue('--yellow-400'), documentStyle.getPropertyValue('--green-400'), documentStyle.getPropertyValue('--red-500')]
            }
        ]
    };
};

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    return {
        plugins: {
            legend: {
                labels: {
                    cutout: '10%',
                    color: textColor
                }
            }
        }
    };
};
</script>
