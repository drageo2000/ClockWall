import React, { useState, useEffect } from 'react';
import MechanicalClock from './MechanicalClock';

const FONT_5x9 = {
    '0': [
        [1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]
    ],
    '1': [
        [0, 0, 1, 0, 0], [0, 1, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 1, 1, 1, 0]
    ],
    '2': [
        [1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1]
    ],
    '3': [
        [1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [1, 1, 1, 1, 1]
    ],
    '4': [
        [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1]
    ],
    '5': [
        [1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [1, 1, 1, 1, 1]
    ],
    '6': [
        [1, 1, 1, 1, 1], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 0, 0, 0, 0], [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]
    ],
    '7': [
        [1, 1, 1, 1, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 0, 1, 0], [0, 0, 1, 0, 0],
        [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0], [0, 0, 1, 0, 0]
    ],
    '8': [
        [1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1]
    ],
    '9': [
        [1, 1, 1, 1, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 0, 0, 0, 1], [1, 1, 1, 1, 1],
        [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1], [0, 0, 0, 0, 1]
    ],
    ':': [
        [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]
    ]
};

const ClockWall = () => {
    const [timeStr, setTimeStr] = useState("");
    const [clocks, setClocks] = useState([]);
    const cols = 39;
    const rows = 9;

    // Helper to get normalized target rotation (0-359)
    const getTargetRotations = (r, c, currentTime) => {
        let charIndex = -1;
        let localCol = -1;

        if (c >= 0 && c <= 4) { charIndex = 0; localCol = c; }
        else if (c >= 6 && c <= 10) { charIndex = 1; localCol = c - 6; }
        else if (c === 12) { charIndex = 2; localCol = 2; }
        else if (c >= 14 && c <= 18) { charIndex = 3; localCol = c - 14; }
        else if (c >= 20 && c <= 24) { charIndex = 4; localCol = c - 20; }
        // Seconds extension
        else if (c === 26) { charIndex = 5; localCol = 2; }
        else if (c >= 28 && c <= 32) { charIndex = 6; localCol = c - 28; }
        else if (c >= 34 && c <= 38) { charIndex = 7; localCol = c - 34; }

        if (charIndex !== -1) {
            const chars = [
                currentTime[0], currentTime[1], 
                ':', 
                currentTime[3], currentTime[4],
                ':',
                currentTime[6], currentTime[7]
            ];
            const char = chars[charIndex];
            const pattern = FONT_5x9[char];

            if (pattern && pattern[r] && pattern[r][localCol]) {
                let h = 270, m = 90; // Default horizontal

                const isLeft = localCol > 0 && pattern[r][localCol - 1];
                const isRight = localCol < 4 && pattern[r][localCol + 1];
                const isUp = r > 0 && pattern[r - 1][localCol];
                const isDown = r < 8 && pattern[r + 1][localCol];

                if (isUp && isDown) { h = 0; m = 180; }
                else if (isLeft && isRight) { h = 270; m = 90; }
                else if (isRight && isDown) { h = 90; m = 180; }
                else if (isLeft && isDown) { h = 270; m = 180; }
                else if (isRight && isUp) { h = 90; m = 0; }
                else if (isLeft && isUp) { h = 270; m = 0; }
                else if (isDown) { h = 180; m = 180; }
                else if (isUp) { h = 0; m = 0; }

                if (char === '7') {
                    if (r === 3 && localCol === 3) { h = 225; m = 45; }
                    if (r >= 4 && localCol === 2) { h = 0; m = 180; }
                    if (r === 0 && localCol === 4) { h = 270; m = 180; }
                }
                return { h, m };
            }
        }
        return { h: 225, m: 225 }; // Neutral position
    };

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const ss = String(now.getSeconds()).padStart(2, '0');
            const newTimeStr = `${hh}:${mm}:${ss}`;

            setTimeStr(prev => {
                if (prev !== newTimeStr) {
                    // Time changed, calculate new rotations
                    setClocks(prevClocks => {
                        const newClocks = [];
                        for (let i = 0; i < cols * rows; i++) {
                            const r = Math.floor(i / cols);
                            const c = i % cols;
                            const target = getTargetRotations(r, c, newTimeStr);

                            if (prevClocks.length === 0) {
                                // Initial load
                                newClocks.push({ h: target.h, m: target.m });
                            } else {
                                const prevH = prevClocks[i].h;
                                const prevM = prevClocks[i].m;

                                // Ensure clockwise rotation
                                // We add enough 360s to make target >= prev
                                let nextH = target.h;
                                while (nextH < prevH) nextH += 360;

                                let nextM = target.m;
                                while (nextM < prevM) nextM += 360;

                                newClocks.push({ h: nextH, m: nextM });
                            }
                        }
                        return newClocks;
                    });
                }
                return newTimeStr;
            });
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="wall-container">
            {clocks.map((data, index) => (
                <MechanicalClock
                    key={index}
                    hourRotation={data.h}
                    minuteRotation={data.m}
                />
            ))}
        </div>
    );
};

export default ClockWall;
