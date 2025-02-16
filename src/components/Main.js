import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns'; // Для роботи з часом

// Реєстрація елементів
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, TimeScale);

const Main = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [selectedFields, setSelectedFields] = useState(['traffic', 'payment']);
  const [showChart, setShowChart] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeUnit, setTimeUnit] = useState('day');  // Одиниця часу

  // Тестові дані
  const mockProjects = [
    { id: '1', name: 'Project Alpha' },
    { id: '2', name: 'Project Beta' },
    { id: '3', name: 'Project Gamma' }
  ];

  const mockStatistics = [
    { projectId: '1', type: 'traffic', value: '1500', createdAt: '2025-02-01T00:00:00Z' },
    { projectId: '1', type: 'payment', value: '1200', createdAt: '2025-02-01T00:00:00Z' },
    { projectId: '1', type: 'traffic', value: '1600', createdAt: '2025-02-01T01:00:00Z' },
    { projectId: '1', type: 'payment', value: '1250', createdAt: '2025-02-01T01:00:00Z' },
    { projectId: '1', type: 'traffic', value: '1700', createdAt: '2025-02-01T02:00:00Z' },
    { projectId: '1', type: 'payment', value: '1300', createdAt: '2025-02-01T02:00:00Z' },
    { projectId: '1', type: 'traffic', value: '1800', createdAt: '2025-02-01T03:00:00Z' },
    { projectId: '1', type: 'payment', value: '1350', createdAt: '2025-02-01T03:00:00Z' },
    { projectId: '1', type: 'traffic', value: '1900', createdAt: '2025-02-01T04:00:00Z' },
    { projectId: '1', type: 'payment', value: '1400', createdAt: '2025-02-01T04:00:00Z' },
    { projectId: '1', type: 'traffic', value: '2000', createdAt: '2025-02-01T05:00:00Z' },
    { projectId: '1', type: 'payment', value: '1450', createdAt: '2025-02-01T05:00:00Z' },
    { projectId: '1', type: 'traffic', value: '2100', createdAt: '2025-02-01T06:00:00Z' },
    { projectId: '1', type: 'payment', value: '1500', createdAt: '2025-02-01T06:00:00Z' },
    { projectId: '1', type: 'traffic', value: '2200', createdAt: '2025-02-01T07:00:00Z' },
    { projectId: '1', type: 'payment', value: '1550', createdAt: '2025-02-01T07:00:00Z' },
    { projectId: '1', type: 'traffic', value: '2300', createdAt: '2025-02-01T08:00:00Z' },
    { projectId: '1', type: 'payment', value: '1600', createdAt: '2025-02-01T08:00:00Z' },
    { projectId: '1', type: 'traffic', value: '2400', createdAt: '2025-02-01T09:00:00Z' },
    { projectId: '1', type: 'payment', value: '1650', createdAt: '2025-02-01T09:00:00Z' },
    { projectId: '1', type: 'traffic', value: '2500', createdAt: '2025-02-01T10:00:00Z' },
    { projectId: '1', type: 'payment', value: '1700', createdAt: '2025-02-01T10:00:00Z' },
    { projectId: '1', type: 'traffic', value: '2600', createdAt: '2025-02-01T11:00:00Z' },
    { projectId: '1', type: 'payment', value: '1750', createdAt: '2025-02-01T11:00:00Z' },
    { projectId: '1', type: 'traffic', value: '2700', createdAt: '2025-02-01T12:00:00Z' },
    { projectId: '1', type: 'payment', value: '1800', createdAt: '2025-02-01T12:00:00Z' },
    { projectId: '1', type: 'traffic', value: '2800', createdAt: '2025-02-01T13:00:00Z' },
    { projectId: '1', type: 'payment', value: '1850', createdAt: '2025-02-01T13:00:00Z' },
    { projectId: '1', type: 'traffic', value: '2900', createdAt: '2025-02-01T14:00:00Z' },
    { projectId: '1', type: 'payment', value: '1900', createdAt: '2025-02-01T14:00:00Z' },
    { projectId: '1', type: 'traffic', value: '3000', createdAt: '2025-02-01T15:00:00Z' },
    { projectId: '1', type: 'payment', value: '1950', createdAt: '2025-02-01T15:00:00Z' },
    { projectId: '1', type: 'traffic', value: '3100', createdAt: '2025-02-01T16:00:00Z' },
    { projectId: '1', type: 'payment', value: '2000', createdAt: '2025-02-01T16:00:00Z' },
    { projectId: '1', type: 'traffic', value: '3200', createdAt: '2025-02-01T17:00:00Z' },
    { projectId: '1', type: 'payment', value: '2050', createdAt: '2025-02-01T17:00:00Z' },
    { projectId: '1', type: 'traffic', value: '3300', createdAt: '2025-02-01T18:00:00Z' },
    { projectId: '1', type: 'payment', value: '2100', createdAt: '2025-02-01T18:00:00Z' },
    { projectId: '1', type: 'traffic', value: '3400', createdAt: '2025-02-01T19:00:00Z' },
    { projectId: '1', type: 'payment', value: '2150', createdAt: '2025-02-01T19:00:00Z' },
    { projectId: '1', type: 'traffic', value: '3500', createdAt: '2025-02-01T20:00:00Z' },
    { projectId: '1', type: 'payment', value: '2200', createdAt: '2025-02-01T20:00:00Z' },
    { projectId: '1', type: 'traffic', value: '3600', createdAt: '2025-02-01T21:00:00Z' },
    { projectId: '1', type: 'payment', value: '2250', createdAt: '2025-02-01T21:00:00Z' },
    { projectId: '1', type: 'traffic', value: '3700', createdAt: '2025-02-01T22:00:00Z' },
    { projectId: '1', type: 'payment', value: '2300', createdAt: '2025-02-01T22:00:00Z' },
    { projectId: '1', type: 'traffic', value: '3800', createdAt: '2025-02-01T23:00:00Z' },
    { projectId: '1', type: 'payment', value: '2350', createdAt: '2025-02-01T23:00:00Z' }
  ];

  // function test() {
  //   const types = ['traffic', 'payment', 'online'];  // Додано новий тип 'online'
  //   const projectId = '1';

  //   for (let day = 1; day <= 10; day++) {
  //     for (let hour = 0; hour < 24; hour++) {
  //       types.forEach(type => {
  //         const value = Math.floor(Math.random() * 2000) + 1000; // Генерація випадкового значення
  //         const createdAt = new Date(2025, 1, day, hour).toISOString(); // Генерація дати та часу
  //         mockStatistics.push({ projectId, type, value: value.toString(), createdAt });
  //       });
  //     }
  //   }
  // }
  // test();

  // Завантаження проектів
  useEffect(() => {
    setProjects(mockProjects);
  }, []);

  // Завантаження статистики
  useEffect(() => {
    if (selectedProject) {
      const filteredStatistics = mockStatistics.filter(stat => {
        const statDate = new Date(stat.createdAt);
        const isWithinDateRange =
          (!startDate || statDate >= new Date(startDate)) &&
          (!endDate || statDate <= new Date(endDate));
        return stat.projectId === selectedProject && isWithinDateRange;
      });
      setStatistics(filteredStatistics);
    }
  }, [selectedProject, startDate, endDate]);

  // Обробник зміни одиниць часу (по дням або по годинах)
  const handleTimeUnitChange = (event) => {
    setTimeUnit(event.target.value);
  };

  // Функція для зміни кольорів для різних полів
  const getColorForField = (field) => {
    switch (field) {
      case 'traffic': return 'green';
      case 'payment': return 'blue';
      case 'online': return 'orange';
      default: return 'black';
    }
  };

  // Створення даних для графіка
  const chartData = {
    labels: statistics.map(stat => new Date(stat.createdAt)),  // Використовуємо об'єкти Date без форматування
    datasets: selectedFields.map(field => ({
      label: field.charAt(0).toUpperCase() + field.slice(1),
      data: statistics.filter(stat => stat.type === field).map(stat => parseFloat(stat.value)),
      borderColor: getColorForField(field),
      backgroundColor: 'rgba(0, 0, 0, 0)',
      borderWidth: 2,
      pointRadius: 0,  // Зменшуємо точку до нуля
    })),
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'time', // якщо ти використовуєш часову шкалу
        time: {
          unit: 'hour', // налаштуй одиницю на годину
          tooltipFormat: 'll HH:mm', // формат відображення часу
        },
        ticks: {
          autoSkip: true, // автоматичне пропускання деяких міток на осі X, щоб графік не був перенасичений
        },
        min: new Date('2025-02-01T00:00:00Z'), // встановити мінімум по даті
        max: new Date('2025-02-01T23:59:59Z'), // встановити максимум по даті
      },
      y: {
        beginAtZero: true, // гарантовано починається з нуля, або налаштуй автоматично в залежності від даних
      }
    },
    responsive: true, // адаптивний графік
    plugins: {
      legend: {
        position: 'top', // чи внизу, чи вгорі
      },
      tooltip: {
        enabled: true, // активація підказок
      }
    }
  };



  return (
    <div>
      <h1>Project Dashboard</h1>

      {/* Вибір проекту */}
      <div>
        <label htmlFor="projectSelect">Choose a project:</label>
        <select id="projectSelect" onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
          <option value="">Select a project</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Вибір полів для графіка */}
      {selectedProject && (
        <div>
          <h2>Select fields to display:</h2>
          <label>
            <input
              type="checkbox"
              value="traffic"
              checked={selectedFields.includes('traffic')}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedFields(prevState => prevState.includes(value) ? prevState.filter(field => field !== value) : [...prevState, value]);
              }}
            /> Traffic
          </label>
          <label>
            <input
              type="checkbox"
              value="payment"
              checked={selectedFields.includes('payment')}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedFields(prevState => prevState.includes(value) ? prevState.filter(field => field !== value) : [...prevState, value]);
              }}
            /> Payment
          </label>
          <label>
            <input
              type="checkbox"
              value="online"
              checked={selectedFields.includes('online')}
              onChange={(e) => {
                const value = e.target.value;
                setSelectedFields(prevState => prevState.includes(value) ? prevState.filter(field => field !== value) : [...prevState, value]);
              }}
            /> Online
          </label>
          {/* Вибір одиниць часу */}
          <div>
            <label>Choose time unit:</label>
            <select onChange={handleTimeUnitChange} value={timeUnit}>
              <option value="day">By Day</option>
              <option value="hour">By Hour</option>
            </select>
          </div>
          {/* Вибір дат */}
          <div>
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button onClick={() => setShowChart(true)}>Show Chart</button>
        </div>
      )}

      {/* Графік */}
      {showChart && statistics.length > 0 && (
        <div style={{ width: '600px', height: '400px' }}>
          <h2>Data Graph</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default Main;
