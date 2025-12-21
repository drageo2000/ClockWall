import React from 'react';

const MechanicalClock = ({ hourRotation = 0, minuteRotation = 0 }) => {
    const transitionStyle = {
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
        transformOrigin: 'bottom center'
    };

    return (
        <div className="clock">
            <div
                className="hand hour"
                style={{
                    ...transitionStyle,
                    height: 'calc(50% - 1px)',
                    transform: `translateX(-50%) rotate(${hourRotation}deg)`
                }}
            />
            <div
                className="hand minute"
                style={{
                    ...transitionStyle,
                    height: 'calc(50% - 1px)',
                    transform: `translateX(-50%) rotate(${minuteRotation}deg)`
                }}
            />
        </div>
    );
};

export default MechanicalClock;
