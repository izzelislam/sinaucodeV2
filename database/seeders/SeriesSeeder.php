<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Series;
use Illuminate\Support\Str;

class SeriesSeeder extends Seeder
{
    public function run(): void
    {
        $series = [
            // Web Development Series
            [
                'name' => 'Modern JavaScript Mastery',
                'description' => 'A comprehensive series covering modern JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks.',
            ],
            [
                'name' => 'React Complete Guide',
                'description' => 'Learn React from scratch, covering components, hooks, state management, routing, and building production-ready applications.',
            ],
            [
                'name' => 'Vue.js 3 Fundamentals',
                'description' => 'Master Vue.js 3 with the Composition API, reactivity system, and ecosystem tools.',
            ],
            [
                'name' => 'Full-Stack Laravel Development',
                'description' => 'Build modern web applications with Laravel, covering authentication, APIs, database design, and deployment.',
            ],
            [
                'name' => 'Node.js Backend Development',
                'description' => 'Create scalable backend applications with Node.js, Express, MongoDB, and microservices architecture.',
            ],
            [
                'name' => 'CSS Grid and Flexbox Mastery',
                'description' => 'Master modern CSS layout techniques with Grid and Flexbox for responsive web design.',
            ],
            [
                'name' => 'TypeScript Deep Dive',
                'description' => 'Learn TypeScript from basics to advanced features, including generics, decorators, and type-safe development.',
            ],

            // Mobile Development Series
            [
                'name' => 'React Native Mobile Development',
                'description' => 'Build cross-platform mobile apps with React Native, covering navigation, state management, and native modules.',
            ],
            [
                'name' => 'Flutter Development Crash Course',
                'description' => 'Create beautiful mobile applications with Flutter and Dart, covering widgets, state management, and deployment.',
            ],
            [
                'name' => 'Swift iOS Development',
                'description' => 'Learn iOS app development with Swift, covering UIKit, SwiftUI, and App Store deployment.',
            ],
            [
                'name' => 'Kotlin Android Development',
                'description' => 'Master Android development with Kotlin, covering modern Android architecture, Jetpack Compose, and Google Play.',
            ],

            // Data Science & AI Series
            [
                'name' => 'Python for Data Science',
                'description' => 'Learn data science fundamentals with Python, including NumPy, Pandas, Matplotlib, and statistical analysis.',
            ],
            [
                'name' => 'Machine Learning with TensorFlow',
                'description' => 'Build and deploy machine learning models using TensorFlow and Keras for real-world applications.',
            ],
            [
                'name' => 'Deep Learning Fundamentals',
                'description' => 'Understand neural networks, deep learning architectures, and advanced AI concepts.',
            ],
            [
                'name' => 'Data Visualization Masterclass',
                'description' => 'Create compelling data visualizations using Python libraries, D3.js, and modern tools.',
            ],
            [
                'name' => 'Big Data Engineering',
                'description' => 'Learn to process and analyze big data with Hadoop, Spark, and cloud data platforms.',
            ],

            // DevOps & Cloud Series
            [
                'name' => 'Docker and Kubernetes Essentials',
                'description' => 'Master containerization and orchestration with Docker and Kubernetes for modern deployment.',
            ],
            [
                'name' => 'AWS Cloud Architecture',
                'description' => 'Design and deploy scalable applications on AWS, covering core services and best practices.',
            ],
            [
                'name' => 'CI/CD Pipeline Mastery',
                'description' => 'Build automated deployment pipelines using GitHub Actions, Jenkins, and modern DevOps tools.',
            ],
            [
                'name' => 'Infrastructure as Code',
                'description' => 'Learn Terraform and CloudFormation to manage infrastructure programmatically.',
            ],

            // Cybersecurity Series
            [
                'name' => 'Web Security Fundamentals',
                'description' => 'Understand common web vulnerabilities and security best practices for developers.',
            ],
            [
                'name' => 'Ethical Hacking Basics',
                'description' => 'Learn penetration testing techniques and security assessment methodologies.',
            ],
            [
                'name' => 'Cryptography in Practice',
                'description' => 'Master encryption, digital signatures, and secure communication protocols.',
            ],

            // Database Series
            [
                'name' => 'SQL Database Design',
                'description' => 'Learn relational database design, normalization, and advanced SQL techniques.',
            ],
            [
                'name' => 'NoSQL Database Mastery',
                'description' => 'Work with MongoDB, Redis, and other NoSQL databases for modern applications.',
            ],
            [
                'name' => 'Database Performance Optimization',
                'description' => 'Optimize database queries, indexing strategies, and performance tuning.',
            ],

            // Blockchain & Web3 Series
            [
                'name' => 'Blockchain Development with Solidity',
                'description' => 'Build smart contracts and DApps on Ethereum using Solidity and Web3.js.',
            ],
            [
                'name' => 'DeFi Protocol Development',
                'description' => 'Create decentralized finance protocols and understand DeFi ecosystem.',
            ],
            [
                'name' => 'Web3.js and Ethereum Development',
                'description' => 'Interact with blockchain networks and build Web3 applications.',
            ],

            // UI/UX Design Series
            [
                'name' => 'UI/UX Design Principles',
                'description' => 'Master user interface and user experience design fundamentals and best practices.',
            ],
            [
                'name' => 'Figma for Designers',
                'description' => 'Create professional designs and prototypes using Figma.',
            ],
            [
                'name' => 'Design Systems and Components',
                'description' => 'Build scalable design systems and reusable component libraries.',
            ],

            // Business & Career Series
            [
                'name' => 'Freelancing for Developers',
                'description' => 'Build a successful freelance career with practical tips and strategies.',
            ],
            [
                'name' => 'Technical Writing for Developers',
                'description' => 'Learn to write clear documentation, tutorials, and technical content.',
            ],
            [
                'name' => 'Software Architecture Patterns',
                'description' => 'Understand and implement various software architecture patterns and principles.',
            ],
            [
                'name' => 'Leadership in Tech',
                'description' => 'Develop leadership skills for technical roles and team management.',
            ],

            // Emerging Technologies Series
            [
                'name' => 'Quantum Computing Basics',
                'description' => 'Introduction to quantum computing concepts and programming with Qiskit.',
            ],
            [
                'name' => 'IoT Development with Arduino',
                'description' => 'Build Internet of Things projects using Arduino and connected devices.',
            ],
            [
                'name' => 'AR/VR Development with Unity',
                'description' => 'Create augmented and virtual reality experiences using Unity.',
            ],
            [
                'name' => 'AI Prompt Engineering',
                'description' => 'Master the art of prompt engineering for AI models and LLMs.',
            ],

            // Programming Languages Series
            [
                'name' => 'Go Programming Language',
                'description' => 'Learn Go from basics to advanced topics including concurrency and system programming.',
            ],
            [
                'name' => 'Rust Systems Programming',
                'description' => 'Master Rust for safe systems programming with memory safety guarantees.',
            ],
            [
                'name' => 'Python Advanced Programming',
                'description' => 'Deep dive into Python advanced features, metaprogramming, and performance optimization.',
            ],
            [
                'name' => 'C++ Modern Programming',
                'description' => 'Learn modern C++ features and best practices for system programming.',
            ],

            // Testing & Quality Series
            [
                'name' => 'Test-Driven Development',
                'description' => 'Master TDD practices and build reliable software through comprehensive testing.',
            ],
            [
                'name' => 'Automation Testing Masterclass',
                'description' => 'Implement automated testing strategies for web and mobile applications.',
            ],
            [
                'name' => 'Code Quality and Refactoring',
                'description' => 'Improve code quality through refactoring techniques and best practices.',
            ],

            // Performance & Optimization Series
            [
                'name' => 'Web Performance Optimization',
                'description' => 'Optimize web applications for speed, efficiency, and better user experience.',
            ],
            [
                'name' => 'Mobile App Performance',
                'description' => 'Techniques for optimizing mobile app performance and battery usage.',
            ],
            [
                'name' => 'Database Performance Tuning',
                'description' => 'Advanced techniques for database optimization and performance tuning.',
            ],

            // Project Management Series
            [
                'name' => 'Agile and Scrum Mastery',
                'description' => 'Implement Agile methodologies and Scrum frameworks for project success.',
            ],
            [
                'name' => 'Software Project Management',
                'description' => 'Manage software projects effectively using modern tools and methodologies.',
            ],
            [
                'name' => 'Remote Team Collaboration',
                'description' => 'Best practices for managing and collaborating with remote development teams.',
            ],

            // Additional Technology Series
            [
                'name' => 'Microservices Architecture',
                'description' => 'Design and implement microservices architecture for scalable applications.',
            ],
            [
                'name' => 'API Design and Development',
                'description' => 'Create RESTful and GraphQL APIs with best practices and security.',
            ],
            [
                'name' => 'Real-time Applications',
                'description' => 'Build real-time applications using WebSockets, Socket.IO, and modern technologies.',
            ],
            [
                'name' => 'Progressive Web Apps',
                'description' => 'Create fast, reliable, and engaging Progressive Web Applications.',
            ],
            [
                'name' => 'Serverless Computing',
                'description' => 'Build serverless applications using AWS Lambda, Azure Functions, and other platforms.',
            ],
            [
                'name' => 'Edge Computing Development',
                'description' => 'Develop applications that run on edge computing infrastructure.',
            ],
            [
                'name' => '5G and IoT Integration',
                'description' => 'Build applications leveraging 5G networks and IoT technologies.',
            ],
            [
                'name' => 'Cross-Platform Development',
                'description' => 'Create applications that run seamlessly across multiple platforms.',
            ],
            [
                'name' => 'Game Development with Unity',
                'description' => 'Learn game development fundamentals using Unity and C#.',
            ],
            [
                'name' => 'Mobile Game Development',
                'description' => 'Create engaging mobile games for iOS and Android platforms.',
            ],
        ];

        foreach ($series as $item) {
            Series::firstOrCreate([
                'slug' => Str::slug($item['name']),
            ], [
                'name' => $item['name'],
                'description' => $item['description'],
            ]);
        }
    }
}