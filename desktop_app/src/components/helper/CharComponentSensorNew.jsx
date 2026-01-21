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
);

const initialData = () => {
    return {
        dust: [],
        rain: [],
        windSpeed: [],
        timeLabels: [],
    };
};

const MAX_DATA_POINTS = 20;
const ChartComponentSensor2 = () => {
    const [spinner, setSpinner] = useState(true);
    const [min, setMin] = useState({ dust: 0 });
    const [max, setMax] = useState({ dust: 0 });
    const [chartData, setChartData] = useState(initialData());
    const { dataStream } = useSelector((state) => state.streaming);

    const chartRef = useRef(); // Ref to access chart

    // Ref to store the current zoom and pan state
    const zoomStateRef = useRef({ min: 0, max: MAX_DATA_POINTS - 1 });

    useEffect(() => {
        if (!dataStream || !dataStream.message) return;
        let { dust, time } = dataStream.message;

        let dustMin = Math.min(min.dust, dust);
        setMin({ dust: dustMin });

        let dustMax = Math.max(max.dust, dust);
        setMax({ dust: dustMax });

        const [timePart] = time.split(' ');
        const [hours, minutes, seconds] = timePart.split(':').map(Number);

        setChartData((prevData) => {
            const index = prevData.dust.length;

            let newdust = [...prevData.dust, { x: index, y: dust }];
            let newTimeLabels = [
                ...prevData.timeLabels,
                `${hours.toString().padStart(2, '0')}:${minutes
                    .toString()
                    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            ];

            // Limit the number of displayed data points
            if (newdust.length > 0.8 * MAX_DATA_POINTS) {
                newdust.shift();
                newTimeLabels.shift();

                // Update the x index after shift
                newdust.forEach((point, idx) => (point.x = idx));
            }

            setSpinner(false);
            return {
                dust: newdust,
                timeLabels: newTimeLabels,
            };
        });
    }, [dataStream, max.dust, min.dust]);

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
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0, // Disable animation during updates
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
                        size: 14,
                        weight: 'bold',
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
                    color: config.app.styles.iconColors.bui,
                },
                ticks: {
                    stepSize: 0.5,
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

export default ChartComponentSensor2;
