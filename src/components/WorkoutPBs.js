import React, { useState, useEffect } from 'react';

const WorkoutPBs = ({ uid }) => {
    const [progressData, setProgressData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/exercises-progress?uid=${uid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch progress data');
                }
                const data = await response.json();

                // Filter data for specific exercises: Squat, Bench, Deadlift
                const filteredData = data.filter(item =>
                    ['Squat', 'Bench', 'Deadlift'].includes(item.exercise_name)
                );

                // Group data by reps (up to 10) and organize by exercise name
                const groupedData = Array.from({ length: 10 }, (_, i) => ({
                    reps: i + 1,
                    Squat: '-',
                    Bench: '-',
                    Deadlift: '-',
                }));

                filteredData.forEach(record => {
                    const repIndex = record.reps - 1;
                    if (repIndex >= 0 && repIndex < 10) {
                        groupedData[repIndex][record.exercise_name] = record.weight;
                    }
                });

                setProgressData(groupedData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, [uid]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Workout Personal Bests</h2>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Reps</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Squat</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Bench</th>
                        <th className="py-2 px-4 border-b border-gray-200 text-left">Deadlift</th>
                    </tr>
                </thead>
                <tbody>
                    {progressData.map((row, index) => (
                        <tr key={index} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b border-gray-200">{row.reps}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{row.Squat}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{row.Bench}</td>
                            <td className="py-2 px-4 border-b border-gray-200">{row.Deadlift}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WorkoutPBs;
