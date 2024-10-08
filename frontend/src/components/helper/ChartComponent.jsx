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

    const [MAX_DATA_POINTS, SET_MAX_DATA_POINTS] = useState(25)

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

            // Giới hạn số lượng điểm dữ liệu hiển thị
            if (newTemp.length > 0.8 * MAX_DATA_POINTS) {
                newTemp.shift();
                newHumidity.shift();
                newLight.shift();
                newTimeLabels.shift();

                // Cập nhật lại chỉ số x cho các điểm còn lại sau khi shift
                newTemp.forEach((point, idx) => point.x = idx);
                newHumidity.forEach((point, idx) => point.x = idx);
                newLight.forEach((point, idx) => point.x = idx);
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

    const handleZoom = ({ chart }) => {
        // Lưu trữ trạng thái zoom hiện tại vào ref
        const xAxis = chart.scales.x;
        zoomStateRef.current = {
            min: xAxis.min,
            max: xAxis.max,
        };
        // Tính toán khoảng cách giữa min và max để điều chỉnh số điểm dữ liệu
        const zoomRange = xAxis.max - xAxis.min;

        // Xác định số lượng điểm dữ liệu dựa trên phạm vi zoom (tuỳ chỉnh giá trị này theo nhu cầu của bạn)
        if (zoomRange < 25) {
            SET_MAX_DATA_POINTS(10); // Khi phóng to, tăng số điểm dữ liệu
        } else if (zoomRange < 50) {
            SET_MAX_DATA_POINTS(20); // Khi phóng to, tăng số điểm dữ liệu
        } else if (zoomRange < 200) {
            SET_MAX_DATA_POINTS(50); // Phạm vi trung bình
        } else {
            SET_MAX_DATA_POINTS(100); // Khi thu nhỏ, giảm số điểm dữ liệu
        }
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
                tension: 0.2,

            },
            {
                label: 'Humidity (%)',
                data: chartData.humidity,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true,
                parsing: { xAxisKey: 'x', yAxisKey: 'y' },
                yAxisID: 'y1',
                tension: 0.2,
            },
            {
                label: 'Light Intensity (lux)',
                data: chartData.light,
                borderColor: 'rgba(255, 206, 86, 1)',
                backgroundColor: 'rgba(255, 206, 86, 0.1)',
                fill: true,
                parsing: { xAxisKey: 'x', yAxisKey: 'y' },
                yAxisID: 'y2',
                tension: 0.2,
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
                max: max.temp + 30,
                min: min.temp - 10,
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                    color: 'rgba(255, 99, 132, 1)', // Màu của tiêu đề trục y
                },
                ticks: {
                    stepSize: 0.5, // Điều chỉnh khoảng cách giữa các tick thành 5 đơn vị
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'left',
                max: max.humidity + 80,
                min: min.humidity,
                title: {
                    display: true,
                    text: 'Humidity (%)',
                    color: 'rgba(54, 162, 235, 1)', // Màu của tiêu đề trục y
                },
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    stepSize: 10, // Điều chỉnh khoảng cách giữa các tick thành 10 đơn vị
                },
            },
            y2: {
                type: 'linear',
                display: true,
                position: 'right',
                min: min.light > 0 ? (min(min.light - 50, 0) > 0 ? min(min.light - 50, 0) : 0) : 0,
                max: max.light + 50,
                title: {
                    display: true,
                    text: 'Light Intensity (lux)',
                    color: 'rgba(255, 206, 86, 1)'
                },
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    stepSize: 5, // Điều chỉnh khoảng cách giữa các tick thành 5 đơn vị
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
                color: '#F8F8FF',
                font: {
                    size: 13,
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
        <div style={{ position: 'relative', width: '100%', height: 800 }}>
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
