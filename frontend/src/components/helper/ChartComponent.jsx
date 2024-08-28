import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import SpinnerComponent from '../activate/SpinnerComponent';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    annotationPlugin
);

const MAX_DATA_POINTS = 50; // Số lượng điểm dữ liệu tối đa hiển thị trên biểu đồ

const initialData = () => {
    return {
        temp: [],
        humidity: [],
        light: [],
        timeLabels: [],
    };
};

const ChartComponent = () => {
    const [spinner, setSpinner] = useState(true)

    const [chartData, setChartData] = useState(initialData());
    const { dataStream } = useSelector((state) => state.streaming);

    useEffect(() => {
        if (!dataStream || !dataStream.message) return;
        const intervalId = setInterval(() => {
            const { temp, humidity, light, time } = dataStream.message;
            // console.log(dataStream.message)
            const [timePart] = time.split(' ');
            const [hours, minutes, seconds] = timePart.split(':').map(Number);

            setChartData((prevData) => {
                // Tính chỉ số cho điểm mới dựa trên số điểm hiện tại
                const index = prevData.temp.length;

                const newTemp = [...prevData.temp, { x: index, y: temp }];
                const newHumidity = [...prevData.humidity, { x: index, y: humidity }];
                const newLight = [...prevData.light, { x: index, y: light }];
                const newTimeLabels = [...prevData.timeLabels, `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`];

                // Giới hạn số lượng điểm dữ liệu hiển thị
                if (newTemp.length > MAX_DATA_POINTS) {
                    newTemp.shift();
                    newHumidity.shift();
                    newLight.shift();
                    newTimeLabels.shift();

                    // Cập nhật lại chỉ số x cho các điểm còn lại sau khi shift
                    newTemp.forEach((point, idx) => point.x = idx);
                    newHumidity.forEach((point, idx) => point.x = idx);
                    newLight.forEach((point, idx) => point.x = idx);
                }
                setSpinner(false)
                return {
                    temp: newTemp,
                    humidity: newHumidity,
                    light: newLight,
                    timeLabels: newTimeLabels,
                };
            });


        }, 1700);


        return () => clearInterval(intervalId);
    }, [dataStream]);

    const data = {
        labels: chartData.timeLabels,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: chartData.temp, // Hiển thị dữ liệu hiện tại
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                parsing: {
                    xAxisKey: 'x',
                    yAxisKey: 'y',
                },
                yAxisID: 'y',
                tension: 0,
            },
            {
                label: 'Humidity (%)',
                data: chartData.humidity,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: false,
                parsing: {
                    xAxisKey: 'x',
                    yAxisKey: 'y',
                },
                yAxisID: 'y1',
                tension: 0,
            },
            {
                label: 'Light Intensity (lux)',
                data: chartData.light,
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                fill: false,
                parsing: {
                    xAxisKey: 'x',
                    yAxisKey: 'y',
                },
                yAxisID: 'y2',
                tension: 0,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 1000, // Thời gian chuyển động
            easing: 'linear', // Chuyển động tuyến tính, không co giãn
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                min: 0, // Bắt đầu từ 0
                max: MAX_DATA_POINTS - 1, // Giới hạn trục X theo số lượng điểm dữ liệu
                title: {
                    display: true,
                    text: 'Data Points',
                },
                ticks: {
                    stepSize: 1, // Giữ khoảng cách cố định giữa các điểm
                    callback: function (value, index) {
                        return chartData.timeLabels[index] || ''; // Hiển thị nhãn thời gian tương ứng
                    }
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Humidity (%)',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
            y2: {
                type: 'linear',
                display: true,
                position: 'right',
                title: {
                    display: true,
                    text: 'Light Intensity (lux)',
                },
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sensor Status Over Time',
            },
            annotation: {
                annotations: chartData.temp.map((point) => ({
                    type: 'line',
                    scaleID: 'x',
                    value: point.x,
                    borderColor: '#808080',
                    borderWidth: 1,
                    label: {
                        enabled: false,
                    },
                })),
            },
        },
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: 600 }}>
            <Line data={data} options={options} />
            {
                spinner && (
                    <div>
                        <SpinnerComponent />
                    </div>
                )
            }
        </div>

    );
};

export default ChartComponent;
