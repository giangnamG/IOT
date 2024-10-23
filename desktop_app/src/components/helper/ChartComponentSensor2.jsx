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
import config from '../../config';
// import zoomPlugin from 'chartjs-plugin-zoom';

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
    // zoomPlugin // Đăng ký plugin zoom
);


const initialData = () => {
    return {
        dust: [],
        rain: [],
        windSpeed: [],
        timeLabels: [],
    };
};

const MAX_DATA_POINTS = 20
const ChartComponentSensor2 = () => {
    const [spinner, setSpinner] = useState(true);
    const [min, setMin] = useState({ dust: 0, rain: 0, windSpeed: 0 });
    const [max, setMax] = useState({ dust: 0, rain: 0, windSpeed: 0 });
    const [chartData, setChartData] = useState(initialData());
    const { dataStream } = useSelector((state) => state.streaming);



    const chartRef = useRef(); // Ref để truy cập vào biểu đồ

    // Ref để lưu trữ trạng thái zoom và pan hiện tại
    const zoomStateRef = useRef({ min: 0, max: MAX_DATA_POINTS - 1 });

    useEffect(() => {
        if (!dataStream || !dataStream.message) return;
        let { dust, rain, windSpeed, time } = dataStream.message;
        windSpeed = Math.floor(windSpeed)

        let dustMin = Math.min(min.dust, dust);
        let rainMin = Math.min(min.rain, rain);
        let windSpeedMin = Math.min(min.windSpeed, windSpeed);

        setMin({ dust: dustMin, rain: rainMin, windSpeed: windSpeedMin });

        let dustMax = Math.max(max.dust, dust);
        let rainMax = Math.max(max.rain, rain);
        let windSpeedMax = Math.max(max.windSpeed, windSpeed);

        setMax({ dust: dustMax, rain: rainMax, windSpeed: windSpeedMax });

        const [timePart] = time.split(' ');
        const [hours, minutes, seconds] = timePart.split(':').map(Number);

        setChartData((prevData) => {
            const index = prevData.dust.length;

            let newdust = [...prevData.dust, { x: index, y: dust }];
            let newrain = [...prevData.rain, { x: index, y: rain }];
            let newwindSpeed = [...prevData.windSpeed, { x: index, y: windSpeed }];
            let newTimeLabels = [
                ...prevData.timeLabels,
                `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            ];

            // Giới hạn số lượng điểm dữ liệu hiển thị
            if (newdust.length > 0.8 * MAX_DATA_POINTS) {
                newdust.shift();
                newrain.shift();
                newwindSpeed.shift();
                newTimeLabels.shift();

                // Cập nhật lại chỉ số x cho các điểm còn lại sau khi shift
                newdust.forEach((point, idx) => point.x = idx);
                newrain.forEach((point, idx) => point.x = idx);
                newwindSpeed.forEach((point, idx) => point.x = idx);
            }

            setSpinner(false);
            return {
                dust: newdust,
                rain: newrain,
                windSpeed: newwindSpeed,
                timeLabels: newTimeLabels,
            };
        });


    }, [dataStream, max.rain, max.windSpeed, max.dust, min.rain, min.windSpeed, min.dust]);


    const data = {
        labels: chartData.timeLabels,
        datasets: [
            {
                label: 'dust (μg/m³)',
                data: chartData.dust,
                borderColor: config.app.styles.iconColors.bui,
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                fill: true,
                parsing: { xAxisKey: 'x', yAxisKey: 'y' },
                yAxisID: 'y',
                tension: 0.2,

            },
            {
                label: 'rain (mm)',
                data: chartData.rain,
                borderColor: config.app.styles.iconColors.mua,
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: true,
                parsing: { xAxisKey: 'x', yAxisKey: 'y' },
                yAxisID: 'y1',
                tension: 0.2,
            },
            {
                label: 'windSpeed (ms/s)',
                data: chartData.windSpeed,
                borderColor: config.app.styles.iconColors.gio,
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
                    font: {
                        size: 14, // Điều chỉnh kích thước font chữ tại đây (ví dụ: 14px)
                        weight: 'bold', // Nếu bạn muốn chữ in đậm,
                    },
                    callback: function (value, index) {
                        return chartData.timeLabels[index] || '';
                    },
                },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                max: max.dust + 30,
                min: min.dust - 10,
                title: {
                    display: true,
                    text: 'dust (μg/m³)',
                    color: config.app.styles.iconColors.bui, // Màu của tiêu đề trục y
                },
                ticks: {
                    stepSize: 0.5, // Điều chỉnh khoảng cách giữa các tick thành 5 đơn vị
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'left',
                max: max.rain + 80,
                min: min.rain,
                title: {
                    display: true,
                    text: 'rain (mm)',
                    color: config.app.styles.iconColors.mua, // Màu của tiêu đề trục y
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
                min: min.windSpeed > 0 ? (min(min.windSpeed - 50, 0) > 0 ? min(min.windSpeed - 50, 0) : 0) : 0,
                max: max.windSpeed + 50,
                title: {
                    display: true,
                    text: 'windSpeed Intensity (m/s)',
                    color: config.app.styles.iconColors.gio
                },
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    stepSize: 10, // Điều chỉnh khoảng cách giữa các tick thành 5 đơn vị

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
                    size: 15,
                    weight: 'bold',
                },
                formatter: function (value) {
                    return value.y.toFixed(1);
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

export default ChartComponentSensor2;
