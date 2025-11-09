<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Article;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Series;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        // Get existing data
        $categories = Category::all();
        $tags = Tag::all();
        $series = Series::all();
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('No users found. Please run UserSeeder first.');
            return;
        }

        // Article templates with different content types
        $articleTemplates = [
            // Web Development Articles
            [
                'title' => 'Getting Started with React Hooks: A Complete Guide',
                'content' => 'React Hooks revolutionized the way we write React components. In this comprehensive guide, we\'ll explore everything from useState and useEffect to custom hooks and best practices. Learn how to modernize your React applications with Hooks, understand the rules of Hooks, and see real-world examples that will transform your development workflow.',
                'category' => 'React',
                'tags' => ['react', 'hooks', 'javascript', 'frontend'],
            ],
            [
                'title' => 'Mastering TypeScript: From Basics to Advanced Concepts',
                'content' => 'TypeScript has become the go-to language for type-safe JavaScript development. This article covers everything from basic types and interfaces to advanced generics, decorators, and type manipulation. Learn how to leverage TypeScript\'s powerful type system to catch errors at compile time and improve code quality in large-scale applications.',
                'category' => 'TypeScript',
                'tags' => ['typescript', 'javascript', 'type-safety', 'backend'],
            ],
            [
                'title' => 'Building RESTful APIs with Node.js and Express',
                'content' => 'RESTful APIs are the backbone of modern web applications. In this tutorial, we\'ll build a complete REST API using Node.js and Express.js. Covering everything from project setup to authentication, validation, error handling, and deployment strategies. Perfect for developers looking to master backend development with JavaScript.',
                'category' => 'Node.js',
                'tags' => ['nodejs', 'express', 'api', 'rest', 'backend'],
            ],
            [
                'title' => 'CSS Grid vs Flexbox: When to Use Each Layout System',
                'content' => 'Modern CSS offers two powerful layout systems: Grid and Flexbox. Understanding when to use each one is crucial for creating responsive layouts. This article provides practical examples, use cases, and best practices for both CSS Grid and Flexbox, helping you make informed decisions for your next project.',
                'category' => 'CSS Grid',
                'tags' => ['css', 'css-grid', 'flexbox', 'responsive', 'frontend'],
            ],
            [
                'title' => 'Laravel 10 New Features and Upgrades',
                'content' => 'Laravel 10 brings exciting new features and improvements to the PHP framework. Explore the latest additions including improved queue systems, enhanced validation, new Artisan commands, and performance optimizations. This article covers everything you need to know to upgrade your existing Laravel projects or start new ones with version 10.',
                'category' => 'Laravel',
                'tags' => ['laravel', 'php', 'backend', 'web-development'],
            ],

            // Data Science Articles
            [
                'title' => 'Introduction to Machine Learning with Python',
                'content' => 'Machine learning is transforming industries worldwide. This beginner-friendly introduction covers the fundamental concepts, algorithms, and practical implementation using Python. Learn about supervised and unsupervised learning, model evaluation, and real-world applications. Includes hands-on examples using popular libraries like scikit-learn and pandas.',
                'category' => 'Machine Learning',
                'tags' => ['machine-learning', 'python', 'data-science', 'scikit-learn'],
            ],
            [
                'title' => 'Data Visualization Best Practices with Matplotlib and Seaborn',
                'content' => 'Effective data visualization is crucial for communicating insights. This comprehensive guide covers the art and science of creating compelling visualizations using Python\'s most popular libraries. Learn about different chart types, color theory, storytelling with data, and advanced customization techniques.',
                'category' => 'Data Visualization',
                'tags' => ['data-visualization', 'python', 'matplotlib', 'seaborn', 'analytics'],
            ],
            [
                'title' => 'Deep Learning Fundamentals: Neural Networks Explained',
                'content' => 'Neural networks are the foundation of modern AI. This article demystifies deep learning concepts, covering neural network architectures, backpropagation, activation functions, and training strategies. Perfect for understanding how modern AI systems work and getting started with your own deep learning projects.',
                'category' => 'Deep Learning',
                'tags' => ['deep-learning', 'neural-networks', 'ai', 'tensorflow', 'pytorch'],
            ],

            // DevOps Articles
            [
                'title' => 'Docker Containerization: A Complete Beginner\'s Guide',
                'content' => 'Docker has revolutionized application deployment and development workflows. Learn everything about containerization, from basic concepts to advanced Dockerfile optimization, multi-stage builds, and orchestration with Docker Compose. This guide includes practical examples and best practices for production deployments.',
                'category' => 'Docker',
                'tags' => ['docker', 'containerization', 'devops', 'deployment'],
            ],
            [
                'title' => 'Kubernetes for Developers: Deploying Your First Application',
                'content' => 'Kubernetes is the de facto standard for container orchestration. This developer-focused guide walks you through deploying applications on Kubernetes, covering pods, services, deployments, and scaling. Learn how to manage containerized applications at scale with practical examples and troubleshooting tips.',
                'category' => 'Kubernetes',
                'tags' => ['kubernetes', 'containers', 'orchestration', 'devops', 'scaling'],
            ],
            [
                'title' => 'CI/CD Pipeline with GitHub Actions',
                'content' => 'Automate your development workflow with GitHub Actions. This tutorial shows you how to build robust CI/CD pipelines for testing, building, and deploying applications. Covering workflow syntax, secrets management, artifact handling, and integration with popular services like AWS and Docker Hub.',
                'category' => 'CI/CD',
                'tags' => ['ci-cd', 'github-actions', 'automation', 'deployment', 'testing'],
            ],

            // Security Articles
            [
                'title' => 'Web Security Best Practices: OWASP Top 10 Explained',
                'content' => 'Security should be a priority in every web application. This comprehensive guide covers the OWASP Top 10 vulnerabilities, including injection attacks, broken authentication, and sensitive data exposure. Learn practical strategies to identify, prevent, and mitigate common security threats in your applications.',
                'category' => 'Cybersecurity',
                'tags' => ['security', 'owasp', 'web-security', 'authentication', 'encryption'],
            ],
            [
                'title' => 'Implementing JWT Authentication in Modern Web Applications',
                'content' => 'JSON Web Tokens (JWT) are widely used for authentication and authorization. This article provides a complete implementation guide, covering token generation, validation, refresh strategies, and security considerations. Includes code examples for both frontend and backend implementations.',
                'category' => 'Authentication',
                'tags' => ['jwt', 'authentication', 'security', 'api', 'backend'],
            ],

            // Mobile Development Articles
            [
                'title' => 'React Native vs Flutter: Choosing the Right Framework',
                'content' => 'Cross-platform mobile development offers powerful frameworks, but which one should you choose? This comprehensive comparison covers performance, development experience, ecosystem, and real-world considerations for React Native and Flutter. Make an informed decision for your next mobile project.',
                'category' => 'React Native',
                'tags' => ['react-native', 'flutter', 'mobile-development', 'cross-platform'],
            ],
            [
                'title' => 'Building Progressive Web Apps with Service Workers',
                'content' => 'Progressive Web Apps combine the best of web and mobile applications. Learn how to implement offline functionality, push notifications, and app-like experiences using Service Workers. This tutorial covers caching strategies, background sync, and creating installable web applications.',
                'category' => 'Progressive Web Apps',
                'tags' => ['pwa', 'service-workers', 'offline', 'mobile', 'javascript'],
            ],

            // Database Articles
            [
                'title' => 'MongoDB vs PostgreSQL: Choosing the Right Database',
                'content' => 'Selecting the right database is crucial for application performance and scalability. This in-depth comparison covers data modeling, query capabilities, performance characteristics, and use cases for MongoDB and PostgreSQL. Help your team make informed database decisions for different project requirements.',
                'category' => 'Database Design',
                'tags' => ['mongodb', 'postgresql', 'database', 'nosql', 'sql'],
            ],
            [
                'title' => 'Database Indexing Strategies for Performance Optimization',
                'content' => 'Proper indexing is essential for database performance. This guide covers indexing strategies, query optimization, and performance tuning techniques. Learn about different index types, execution plans, and how to identify and resolve performance bottlenecks in your database queries.',
                'category' => 'Database Performance',
                'tags' => ['database', 'indexing', 'performance', 'optimization', 'sql'],
            ],

            // Business & Career Articles
            [
                'title' => 'From Developer to Tech Lead: A Career Growth Guide',
                'content' => 'Transitioning from a developer role to a tech leadership position requires new skills and perspectives. This article covers the journey, including technical leadership, team management, project planning, and communication skills. Learn from experienced tech leads about the challenges and rewards of leadership in tech.',
                'category' => 'Leadership',
                'tags' => ['leadership', 'career', 'tech-lead', 'management', 'professional-development'],
            ],
            [
                'title' => 'Building a Successful Freelancing Career as a Developer',
                'content' => 'Freelancing offers freedom and flexibility, but success requires strategy. This comprehensive guide covers finding clients, pricing your services, managing projects, and building a sustainable freelance business. Learn from experienced freelancers about avoiding common pitfalls and thriving in the gig economy.',
                'category' => 'Freelancing',
                'tags' => ['freelancing', 'business', 'career', 'remote-work', 'consulting'],
            ],
        ];

        // Create articles from templates
        $articles = [];
        foreach ($articleTemplates as $index => $template) {
            $category = $categories->where('name', $template['category'])->first();
            $randomSeries = $series->random();

            $article = [
                'title' => $template['title'],
                'slug' => Str::slug($template['title']),
                'content' => $template['content'],
                'excerpt' => Str::limit(strip_tags($template['content']), 150),
                'status' => 'published',
                'user_id' => $users->random()->id,
                'series_id' => $randomSeries->id,
                'series_order' => $index + 1,
                'meta_title' => $template['title'],
                'meta_description' => Str::limit(strip_tags($template['content']), 160),
                'published_at' => Carbon::now()->subDays(rand(1, 365))->subHours(rand(1, 24)),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $createdArticle = Article::create($article);

            // Attach category
            if ($category) {
                $createdArticle->categories()->attach($category->id);
            }

            // Attach tags
            foreach ($template['tags'] as $tagName) {
                $tag = $tags->where('name', $tagName)->first();
                if ($tag) {
                    $createdArticle->tags()->attach($tag->id);
                }
            }

            $articles[] = $createdArticle;
        }

        // Generate additional articles to reach 100+
        $additionalTitles = [
            'Understanding Web3 and the Future of the Internet',
            'Getting Started with Quantum Computing Programming',
            'Building Scalable Microservices Architecture',
            'AI Ethics and Responsible AI Development',
            'Mobile App Security Best Practices',
            'Advanced Git Workflows for Teams',
            'Creating Accessible Web Applications',
            'Performance Monitoring and Optimization Strategies',
            'Cloud-Native Development Patterns',
            'Blockchain Technology Beyond Cryptocurrency',
            'Edge Computing for IoT Applications',
            'Real-time Data Processing with Apache Kafka',
            'Mobile-First Design Principles',
            'Progressive Enhancement in Web Development',
            'Serverless Security Best Practices',
            'GraphQL vs REST: API Design Comparison',
            'Cross-Platform Testing Strategies',
            'DevOps Culture and Practices',
            'Machine Learning Model Deployment',
            'Container Security Best Practices',
            'Building Chatbots with Natural Language Processing',
            'Cloud Architecture Design Patterns',
            'API Gateway Patterns and Implementation',
            'Event-Driven Architecture with Microservices',
            'Database Sharding Strategies',
            'Caching Strategies for High Performance',
            'Load Balancing and High Availability',
            'Monitoring and Observability in Cloud Applications',
            'Infrastructure as Code Best Practices',
            'Secure Coding Practices for Developers',
            'Testing Strategies for Microservices',
            'Performance Engineering for Web Applications',
            'Mobile Backend as a Service (BaaS) Solutions',
            'WebAssembly Use Cases and Implementation',
            'Augmented Reality Development Fundamentals',
            'Virtual Reality Application Development',
            'Game Development for Mobile Platforms',
            'Audio Processing and Web Audio API',
            'Computer Vision with OpenCV',
            'Natural Language Processing with Python',
            'Time Series Analysis and Forecasting',
            'Reinforcement Learning Basics',
            'Generative AI and Creative Applications',
            'Large Language Models and Their Applications',
            'MLOps: Machine Learning Operations',
            'Data Engineering Pipeline Architecture',
            'Streaming Data Processing with Apache Flink',
            'Graph Databases and Neo4j Tutorial',
            'Full-Text Search with Elasticsearch',
            'Geospatial Data Analysis and Visualization',
            'Business Intelligence Tools and Techniques',
            'Data Governance and Quality Management',
            'Privacy-Preserving Machine Learning',
            'Federated Learning for Distributed Systems',
            'Quantum Machine Learning Concepts',
            'Robotic Process Automation (RPA)',
            'Digital Twin Technology and Applications',
            '5G Network Programming and Development',
            'IoT Security and Privacy Concerns',
            'Smart Contract Development Best Practices',
            'Decentralized Finance (DeFi) Applications',
            'Non-Fungible Tokens (NFTs) Development',
            'Metaverse Development Platforms',
            'Digital Identity and Authentication Systems',
            'Cyber Threat Intelligence and Analysis',
            'Penetration Testing Methodologies',
            'Incident Response and Recovery Planning',
            'Compliance and Regulatory Frameworks',
            'Software Supply Chain Security',
            'Zero Trust Architecture Implementation',
            'Cloud Security Posture Management',
            'Application Security Testing (AST) Tools',
            'Static and Dynamic Code Analysis',
            'Vulnerability Management Programs',
            'Risk Assessment and Mitigation Strategies',
            'Business Continuity and Disaster Recovery',
            'Digital Transformation Strategies',
            'Agile Project Management Frameworks',
            'Product Management for Technical Products',
            'User Research and Customer Development',
            'Design Thinking for Innovation',
            'Lean Startup Methodology',
            'Growth Hacking Strategies for Tech Products',
            'Technical Debt Management',
            'Code Review Best Practices',
            'Documentation Strategies for Development Teams',
            'Knowledge Management in Organizations',
            'Remote Team Building and Culture',
            'Diversity and Inclusion in Tech',
            'Mentorship Programs in Technology',
            'Continuous Learning and Skill Development',
            'Technology Consulting Frameworks',
            'Startup Funding and Investment Strategies',
            'Intellectual Property for Software',
            'Open Source Contribution Guidelines',
            'Community Management for Open Source Projects',
            'Technical Writing and Documentation Skills',
            'Public Speaking for Technical Audiences',
            'Conference Organization and Management',
            'Building Technical Communities',
            'Networking Strategies for Tech Professionals',
        ];

        // Create additional articles
        foreach (array_slice($additionalTitles, 0, 85) as $index => $title) {
            $category = $categories->random();
            $selectedTags = $tags->random($tags->count() > 5 ? rand(2, 5) : $tags->count());
            $randomSeries = $series->random();

            $article = [
                'title' => $title,
                'slug' => Str::slug($title),
                'content' => "This comprehensive article explores {$title}, providing in-depth analysis, practical examples, and expert insights. Readers will gain valuable knowledge about current trends, best practices, and real-world applications. The content covers theoretical foundations, implementation strategies, and future developments in this exciting field of technology.",
                'excerpt' => "Explore the latest developments and best practices in {$title}. This comprehensive guide covers essential concepts, practical implementation, and expert insights for developers and technology professionals.",
                'status' => 'published',
                'user_id' => $users->random()->id,
                'series_id' => $randomSeries->id,
                'series_order' => $index + 20,
                'meta_title' => $title,
                'meta_description' => "Learn everything about {$title} with our comprehensive guide. Expert insights, practical examples, and best practices included.",
                'published_at' => Carbon::now()->subDays(rand(1, 365))->subHours(rand(1, 24)),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            $createdArticle = Article::create($article);

            // Attach category
            $createdArticle->categories()->attach($category->id);

            // Attach tags
            foreach ($selectedTags as $tag) {
                $createdArticle->tags()->attach($tag->id);
            }
        }

        $this->command->info('Created ' . (count($articleTemplates) + 85) . ' articles successfully.');
    }
}