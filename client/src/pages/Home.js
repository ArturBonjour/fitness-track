import React from 'react';
import Calendar from '../components/Calendar';
import CalorieCalculator from '../components/CalorieCalculator';
import WorkoutRecommendations from '../components/WorkoutRecommendations';

const Home = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <Calendar />
                </div>
                <div className="space-y-8">
                    <CalorieCalculator />
                    <WorkoutRecommendations />
                </div>
            </div>
        </div>
    );
};

export default Home; 