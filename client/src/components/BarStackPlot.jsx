import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const BarStackPlot = ({ data, xKeys, yKeys, title }) => {
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
                    <XAxis dataKey={xKeys[0]} />
                    <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Legend />
                    <Bar dataKey={yKeys[0]} stackId="a" fill="#8884d8" radius={[10, 10, 0, 0]} />
                    <Bar dataKey={yKeys[1]} stackId="a" fill="#82ca9d" radius={[10, 10, 0, 0]} />
                    <Bar dataKey={yKeys[2]} stackId="a" fill="#D884C2" radius={[10, 10, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
};

export default BarStackPlot