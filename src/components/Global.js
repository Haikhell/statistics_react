import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Button, Table, Card } from "react-bootstrap"; // Bootstrap
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"; // Графіки

const GlobalStats = () => {
  const api = `https://api.standoff-bot.site/stats`;
  const [statistics, setStatistics] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());


  const [limit, setLimit] = useState(10); // Кількість записів на сторінку
  const [offset, setOffset] = useState(0); // Зміщення для пагінації
  const [totalRecords, setTotalRecords] = useState(0); // Загальна кількість записів


  useEffect(() => {
    fetchStatistics();
  }, [startDate, endDate, limit, offset]);


  const fetchStatistics = async () => {
    try {

      const response = await axios.get(`${api}/global`, {
        params: {
          startDate,
          endDate,
          limit,
          offset,
        },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between mb-4">
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
              <th>Юзеров нажавших старт сегодня</th>
              <th>Заблокированые</th>
              <th>Трафик (бот)</th>
              <th>Трафик (канал)</th>
              <th>Трафик (всего)</th>
              <th>Денег всего</th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((stat) => (
              <tr key={stat._id}>
                <td>{new Date(stat.date).toLocaleDateString()}</td>
                <td>{stat.totalTotalUsers}</td>
                <td>{stat.totalTotalBlock}</td>
                <td>{stat.totalTraffic.bot}</td>
                <td>{stat.totalTraffic.channel}</td>
                <td>{stat.totalTraffic.total}</td>
                <td>{stat.totalAmount.total}</td>
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
        <h5 className="mt-4">Трафик флаер</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[...statistics].reverse()}>

            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Line type="monotone" dataKey="totalTraffic.total" stroke="#007bff" />
          </LineChart>
        </ResponsiveContainer>

        {/* Графік Гроші по дням */}
        <h5 className="mt-4">Денег</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[...statistics].reverse()}>

            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Line type="monotone" dataKey="totalAmount.total" stroke="#28a745" />
          </LineChart>
        </ResponsiveContainer>

        {/* Графік Загальна кількість стартів */}
        <h5 className="mt-4">Все старты</h5>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[...statistics].reverse()}>

            <XAxis dataKey="date" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
            <YAxis />
            <Tooltip />
            <CartesianGrid stroke="#ccc" />
            <Line type="monotone" dataKey="totalTotalUsers" stroke="#dc3545" />
          </LineChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

export default GlobalStats;
