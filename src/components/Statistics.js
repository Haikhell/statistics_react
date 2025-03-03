import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Button, Table, Card } from "react-bootstrap"; // Імпорт з Bootstrap

const StatisticsTable = () => {
  const api = `https://api.standoff-bot.site/stats`;
  const [statistics, setStatistics] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [timeMode, setTimeMode] = useState("hourly");

  // Для пагінації
  const [limit, setLimit] = useState(10); // Кількість записів на сторінку
  const [offset, setOffset] = useState(0); // Зміщення для пагінації
  const [totalRecords, setTotalRecords] = useState(0); // Загальна кількість записів

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchStatistics();
    }
  }, [selectedProject, startDate, endDate, timeMode, limit, offset]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${api}/projects`);
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProject(response.data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${api}/all`, {
        params: {
          projectId: selectedProject,
          startDate,
          endDate,
          mode: timeMode,
          limit,
          offset,
        },
      });
      setStatistics(response.data.statistics);
      setTotalRecords(response.data.total); // Отримуємо загальну кількість записів
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between mb-4">
          <select
            className="form-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <div className="d-flex">
            <DatePicker
              className="form-control mx-2"
              selected={startDate}
              onChange={setStartDate}
            />
            <DatePicker
              className="form-control mx-2"
              selected={endDate}
              onChange={setEndDate}
            />
          </div>
          <div className="d-flex">
            <Button
              onClick={() => setTimeMode("hourly")}
              variant={timeMode === "hourly" ? "primary" : "outline-primary"}
              className="mx-1"
            >
              Почасова
            </Button>
            <Button
              onClick={() => setTimeMode("daily")}
              variant={timeMode === "daily" ? "primary" : "outline-primary"}
              className="mx-1"
            >
              Поденна
            </Button>
          </div>
        </div>

        {/* Вибір кількості записів на сторінку */}
        <div className="mb-3">
          <label>Записів на сторінку:</label>
          <select
            className="form-select"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Онлайн</th>
              <th>Загальна к-сть користувачів</th>
              <th>Заблоковані</th>
              <th>Трафік (бот)</th>
              <th>Трафік (канал)</th>
              <th>Трафік (всього)</th>
              <th>Денег (всього)</th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((stat) => (
              <tr key={stat._id}>
                <td>{new Date(stat.date).toLocaleString()}</td>
                <td>{stat.userOnline}</td>
                <td>{stat.totalUsers}</td>
                <td>{stat.totalBlock}</td>
                <td>{stat.traffic.bot}</td>
                <td>{stat.traffic.channel}</td>
                <td>{stat.traffic.total}</td>
                <td>{stat.amount.total}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Кнопки пагінації */}
        <div className="d-flex justify-content-between mt-3">
          <Button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
          >
            Попередня
          </Button>
          <span>
            {offset + 1} - {Math.min(offset + limit, totalRecords)} з{" "}
            {totalRecords}
          </span>
          <Button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= totalRecords}
          >
            Наступна
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StatisticsTable;
