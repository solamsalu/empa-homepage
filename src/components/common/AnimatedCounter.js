// src/components/common/AnimatedCounter.js
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, useAnimation, animate } from 'framer-motion';

const AnimatedCounter = ({ value, suffix = '', className = '' }) => {
    const controls = useAnimation();
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        if (inView) {
            controls.start({
                opacity: 1,
                y: 0,
                transition: { type: 'spring', stiffness: 100, damping: 20 }
            });
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className={`text-4xl sm:text-5xl font-extrabold text-blue-800 ${className}`}
        >
            <Counter from={0} to={value} />
            {suffix}
        </motion.div>
    );
};

const Counter = ({ from, to }) => {
    const [count, setCount] = useState(from);

    useEffect(() => {
        const controls = animate(from, to, {
            duration: 2,
            onUpdate: (value) => {
                setCount(Math.round(value));
            },
        });

        return () => controls.stop();
    }, [from, to]);

    return <span>{count.toLocaleString()}</span>;
};

export default AnimatedCounter;
