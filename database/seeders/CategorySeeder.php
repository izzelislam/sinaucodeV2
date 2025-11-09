<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            // Technology Categories
            'Web Development', 'Mobile Development', 'Data Science', 'Machine Learning', 'Artificial Intelligence',
            'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain', 'Game Development',
            'Software Engineering', 'Database Design', 'UI/UX Design', 'Frontend Development', 'Backend Development',
            'Full Stack Development', 'API Development', 'Microservices', 'Containerization', 'Serverless',

            // Programming Languages
            'Python', 'Java', 'TypeScript', 'PHP', 'C++', 'Ruby', 'Go', 'Rust',
            'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl', 'Dart', 'Lua', 'Objective-C', 'Assembly',

            // Frameworks & Libraries
            'React', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Flask', 'Laravel', 'Symfony', 'Express.js', 'Spring Boot',
            'Ruby on Rails', 'ASP.NET', 'Flutter', 'React Native', 'Xamarin', 'Bootstrap', 'Tailwind CSS', 'jQuery', 'TensorFlow', 'PyTorch',

            // Business & Marketing
            'Digital Marketing', 'Content Marketing', 'Social Media Marketing', 'SEO', 'SEM', 'Email Marketing',
            'E-commerce', 'Business Strategy', 'Entrepreneurship', 'Startup', 'Finance', 'Accounting',
            'Project Management', 'Agile', 'Scrum', 'Leadership', 'Management', 'Sales', 'Customer Service',

            // Design & Creative
            'Graphic Design', 'Web Design', 'Motion Graphics', 'Video Editing', 'Photography', 'Illustration',
            '3D Modeling', 'Animation', 'UX Research', 'Product Design', 'Brand Design', 'Typography',
            'Color Theory', 'Design Systems', 'Prototyping', 'User Testing', 'Information Architecture',

            // Data & Analytics
            'Big Data', 'Data Visualization', 'Business Intelligence', 'Analytics', 'Statistics', 'Data Mining',
            'Data Engineering', 'Data Warehousing', 'ETL', 'Data Governance', 'Data Quality', 'Predictive Analytics',
            'Prescriptive Analytics', 'Descriptive Analytics', 'Real-time Analytics', 'Stream Processing', 'Batch Processing',

            // Infrastructure & Operations
            'Network Engineering', 'System Administration', 'IT Infrastructure', 'Cloud Architecture', 'Security Engineering',
            'Monitoring', 'Logging', 'Performance Tuning', 'Disaster Recovery', 'Backup Solutions', 'High Availability',
            'Load Balancing', 'CDN', 'DNS', 'VPN', 'Firewalls', 'Intrusion Detection', 'Vulnerability Assessment',

            // Emerging Technologies
            'Quantum Computing', 'Edge Computing', '5G Technology', 'IoT', 'AR/VR', 'Metaverse',
            'NFTs', 'Cryptocurrency', 'DeFi', 'Web3', 'Autonomous Vehicles', 'Robotics', 'Biotechnology',
            'Nanotechnology', 'Renewable Energy', 'Smart Cities', 'Wearable Technology', 'Biometrics',

            // Education & Learning
            'Online Learning', 'E-learning', 'Tutorial', 'Course Design', 'Curriculum Development', 'EdTech',
            'Learning Management Systems', 'Educational Technology', 'Digital Literacy', 'Coding Bootcamp', 'Certification',
            'Professional Development', 'Skill Development', 'Training', 'Workshop', 'Conference', 'Webinar',

            // Miscellaneous
            'Productivity', 'Remote Work', 'Freelancing', 'Consulting', 'Open Source', 'Community',
            'Personal Development', 'Time Management', 'Communication', 'Writing', 'Public Speaking', 'Networking',
            'Innovation', 'Creativity', 'Problem Solving', 'Critical Thinking', 'Research', 'Documentation',
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate([
                'slug' => Str::slug($category),
            ], [
                'name' => $category,
                'description' => "Articles, tutorials, and resources related to {$category}.",
                'meta_title' => $category . ' Articles and Tutorials',
                'meta_description' => "Discover the best {$category} articles, tutorials, and resources for developers and professionals.",
            ]);
        }
    }
}