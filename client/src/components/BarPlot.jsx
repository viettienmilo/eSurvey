import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts";

const BarPlot = ({ data, xKeys, yKeys, xLabels, title }) => {
    return (
        <>
            <h2 className="text-xl text-center mb-2">{title}</h2>
            <ResponsiveContainer width="70%" aspect={2}>
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 20,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xKeys[0]} tickFormatter={(v) => xLabels[v]} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={yKeys[0]} fill="#8884d8" radius={[10, 10, 0, 0]} />
                    <Bar dataKey={yKeys[1]} fill="#82ca9d" radius={[10, 10, 0, 0]} />
                    <Bar dataKey={yKeys[2]} fill="#D884C2" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default BarPlot