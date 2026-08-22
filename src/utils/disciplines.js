// src/utils/disciplines.js

export const JOURNAL_DISCIPLINES = [
    {
        name: "Pure Mathematics",
        description: "Focuses on the development of mathematical concepts for their own sake, exploring abstract structures and fundamental theoretical frameworks.",
        subcategories: ["Algebra", "Analysis", "Geometry & Topology", "Number Theory", "Logic and Foundations", "Combinatorics"]
    },
    {
        name: "Applied Mathematics",
        description: "Research centered on mathematical methods and techniques typically used in science, engineering, business, and industry.",
        subcategories: ["Differential Equations", "Dynamical Systems", "Optimization", "Operations Research", "Control Theory", "Game Theory"]
    },
    {
        name: "Computational & Numerical Mathematics",
        description: "The study of algorithms and numerical analysis for solving mathematical problems using computer simulations and scientific computing.",
        subcategories: ["Numerical Analysis", "Scientific Computing", "Algorithm Design", "Computational Fluid Dynamics", "Symbolic Computation"]
    },
    {
        name: "Mathematical Modeling",
        description: "Construction and analysis of mathematical representations of real-world systems to understand behavior and predict future outcomes.",
        subcategories: ["Biological Modeling", "Financial Mathematics", "Physical/Engineering Modeling", "Environmental Modeling", "Social Models"]
    },
    {
        name: "Mathematics Education",
        description: "Scholarly research into the practice, methods, and curricula of teaching and learning mathematics at all educational levels.",
        subcategories: ["Curriculum Development", "Pedagogy & Instruction", "Educational Technology", "Assessment & Evaluation", "Teacher Training"]
    },
    {
        name: "Statistics and Probability",
        description: "The mathematical study of uncertainty, data analysis, and stochastic processes to infer patterns and support decision-making.",
        subcategories: ["Probability Theory", "Statistical Inference", "Bayesian Statistics", "Data Analysis", "Statistical Learning", "Applied Statistics"]
    },
    {
        name: "Mathematical Physics",
        description: "The application of mathematics to problems in physics and the development of mathematical methods suitable for such applications.",
        subcategories: ["Classical Mechanics", "Quantum Mechanics", "Relativity and Cosmology", "Statistical Mechanics", "String Theory and Field Theory"]
    },
    
    {
        name: "Interdisciplinary Areas",
        description: "Research that bridges mathematics with other fields, including Data Science, cryptography, and the quantitative aspects of life and social sciences.",
        subcategories: ["Data Science", "Cryptography", "Biomathematics / Bioinformatics", "Actuarial Science", "Mathematical Psychology"]
    }
];


export const SPECIALIZATIONS = JOURNAL_DISCIPLINES.map(discipline => discipline.name);