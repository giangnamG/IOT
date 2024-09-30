import React, { useState, useEffect, useRef } from 'react';
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
import dataLabels from 'chartjs-plugin-datalabels';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    annotationPlugin,
    dataLabels,
    zoomPlugin // Đăng ký plugin zoom
);

const MAX_DATA_POINTS = 20; // Số lượng điểm dữ liệu tối đa hiển thị trên biểu đồ
const MAX_DISPLAY_POINTS = 30; // Số lượng điểm tối đa trước khi trượt về bên trái

const initialData = () => {
    return {
        temp: [],
        humidity: [],
        light: [],
        timeLabels: [],
    };
};

const ChartComponent = () => {
    const [spinner, setSpinner] = useState(true);
    const [min, setMin] = useState({ temp: 0, humidity: 0, light: 0 });
    const [max, setMax] = useState({ temp: 0, humidity: 0, light: 0 });
    const [chartData, setChartData] = useState(initialData());
    const { dataStream } = useSelector((state) => state.streaming);

    const chartRef = useRef(); // Ref để truy cập vào biểu đồ

    // Ref để lưu trữ trạng thái zoom và pan hiện tại
    const zoomStateRef = useRef({ min: 0, max: MAX_DATA_POINTS - 1 });

    useEffect(() => {
        if (!dataStream || !dataStream.message) return;

        const { temp, humidity, light, time } = dataStream.message;
        let tempMin = Math.min(min.temp, temp);
        let humidityMin = Math.min(min.humidity, humidity);
        let lightMin = Math.min(min.light, light);

        setMin({ temp: tempMin, humidity: humidityMin, light: lightMin });

        let tempMax = Math.max(max.temp, temp);
        let humidityMax = Math.max(max.humidity, humidity);
        let lightMax = Math.max(max.light, light);

        setMax({ temp: tempMax, humidity: humidityMax, light: lightMax });

        const [timePart] = time.split(' ');
        const [hours, minutes, seconds] = timePart.split(':').map(Number);

        setChartData((prevData) => {
            const index = prevData.temp.length;

            let newTemp = [...prevData.temp, { x: index, y: temp }];
            let newHumidity = [...prevData.humidity, { x: index, y: humidity }];
            let newLight = [...prevData.light, { x: index, y: light }];
            let newTimeLabels = [
                ...prevData.timeLabels,
                `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            ];

            // Giới hạn số điểm khi không đang zoom và vượt quá 30 điểm
            if (!isZoomed() && newTemp.length > MAX_DISPLAY_POINTS) {
                newTemp.shift();
                newHumidity.shift();
                newLight.shift();
                newTimeLabels.shift();
            }

            setSpinner(false);
            return {
                temp: newTemp,
                humidity: newHumidity,
                light: newLight,
                timeLabels: newTimeLabels,
            };
        });

        // Áp dụng lại trạng thái zoom/pan sau khi dữ liệu cập nhật
        if (chartRef.current && chartRef.current.chart) {
            const chart = chartRef.current.chart; // Truy cập instance của biểu đồ đúng cách
            const { min, max } = zoomStateRef.current;

            // Cập nhật lại phạm vi x để duy trì zoom/pan
            chart.options.scales.x.min = min;
            chart.options.scales.x.max = max;
            chart.update('none'); // Cập nhật không có animation để giữ lại trạng thái
        }
    }, [dataStream]);

    const isZoomed = () => {
        // Kiểm tra nếu trạng thái hiện tại không phải là trạng thái ban đầu (không zoom)
        const { min, max } = zoomStateRef.current;
        return !(min === 0 && max === MAX_DATA_POINTS - 1);
    };

    const handleZoom = ({ chart }) => {
        // Lưu trữ trạng thái zoom hiện tại vào ref
        const xAxis = chart.scales.x;
        zoomStateRef.current = {
            min: xAxis.min,
            max: xAxis.max,
        };
    };

    const data = {
        labels: chartData.timeLabels,
        datasets: [
            {
                label: 'Temperature (°C)',
                data: chartData.temp,
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                fill: true,
                parsing: { xAxisKey: 'x', yAxisKey: 'y' },
                yAxisID: 'y',
                tension: 0.4,
            },
            {
                label: 'Humidity (%)',
                data: chartData.humidity,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true,
                parsing: { xAxisKey: 'x', yAxisKey: 'y' },
                yAxisID: 'y1',
                tension: 0.4,
            },
            {
                label: 'Light Intensity (lux)',
                data: chartData.light,
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.1)',
                fill: true,
                parsing: { xAxisKey: 'x', yAxisKey: 'y' },
                yAxisID: 'y2',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0, // Vô hiệu hóa animation khi cập nhật để giữ trạng thái
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                min: zoomStateRef.current.min,
                max: zoomStateRef.current.max,
                title: {
                    display: true,
                    text: 'Data Points',
                },
                ticks: {
                    stepSize: 1,
                    callback: function (value, index) {
                        return chartData.timeLabels[index] || '';
                    },
                },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                max: max.temp + 2,
                min: min.temp - 2,
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'left',
                max: max.humidity + 20,
                min: min.humidity - 20,
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
                min: min.light - 100,
                max: max.light + 100,
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
            datalabels: {
                color: '#666',
                font: {
                    weight: 'bold',
                },
                formatter: function (value) {
                    return value.y.toFixed(1);
                },
            },
            zoom: {
                pan: {
                    enabled: true,
                    mode: 'x', // Cho phép kéo ngang để xem dữ liệu trước đó và sau đó
                    rangeMin: {
                        x: 0,
                    },
                    rangeMax: {
                        x: chartData.temp.length, // Đặt phạm vi tối đa theo chiều dài dữ liệu
                    },
                    onPanComplete: handleZoom, // Gọi hàm xử lý sau khi kéo
                },
                zoom: {
                    wheel: {
                        enabled: true,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'x', // Cho phép thu nhỏ/phóng to trên trục x
                    onZoomComplete: handleZoom, // Gọi hàm xử lý sau khi zoom
                },
            },
        },
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: 600 }}>
            <Line ref={chartRef} data={data} options={options} />
            {spinner && (
                <div>
                    <SpinnerComponent />
                </div>
            )}
        </div>
    );
};

export default ChartComponent;
