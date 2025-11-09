<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            // Technology Tags
            'html', 'css', 'javascript', 'typescript', 'react', 'vue', 'angular', 'nodejs', 'php', 'python',
            'java', 'csharp', 'cpp', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'dart', 'scala',
            'r', 'matlab', 'perl', 'lua', 'assembly', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql',
            'redis', 'elasticsearch', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'firebase', 'heroku', 'vercel',

            // Development Practices
            'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'ci-cd', 'devops', 'microservices', 'api', 'rest',
            'graphql', 'websocket', 'oauth', 'jwt', 'authentication', 'authorization', 'security', 'encryption',
            'performance', 'optimization', 'caching', 'load-balancing', 'scaling', 'monitoring', 'logging',
            'debugging', 'testing', 'unit-testing', 'integration-testing', 'e2e-testing', 'automation',

            // Design & UI/UX
            'responsive', 'mobile-first', 'accessibility', 'a11y', 'seo', 'semantics', 'progressive-enhancement',
            'css-grid', 'flexbox', 'sass', 'less', 'tailwind', 'bootstrap', 'material-ui', 'ant-design',
            'figma', 'sketch', 'adobe-xd', 'prototyping', 'wireframing', 'user-research', 'usability',
            'design-systems', 'component-library', 'dark-mode', 'animation', 'transitions', 'micro-interactions',

            // Data & Analytics
            'big-data', 'data-science', 'machine-learning', 'deep-learning', 'neural-networks', 'ai', 'ml',
            'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy', 'jupyter', 'data-visualization',
            'analytics', 'business-intelligence', 'dashboard', 'metrics', 'kpi', 'reporting', 'statistics',
            'data-mining', 'etl', 'data-engineering', 'data-warehousing', 'stream-processing', 'batch-processing',

            // Business & Marketing
            'digital-marketing', 'content-marketing', 'social-media', 'email-marketing', 'seo', 'sem',
            'ppc', 'conversion-rate-optimization', 'analytics', 'growth-hacking', 'startup', 'entrepreneurship',
            'business', 'strategy', 'leadership', 'management', 'productivity', 'remote-work', 'freelancing',
            'consulting', 'personal-brand', 'networking', 'communication', 'writing', 'public-speaking',

            // Emerging Tech
            'blockchain', 'cryptocurrency', 'bitcoin', 'ethereum', 'nft', 'web3', 'defi', 'smart-contracts',
            'quantum-computing', 'edge-computing', 'iot', 'ar', 'vr', 'mixed-reality', 'metaverse',
            'autonomous-vehicles', 'robotics', 'biotechnology', 'nanotechnology', 'renewable-energy',
            '5g', 'smart-cities', 'wearable-tech', 'biometrics', 'gene-editing', 'space-tech',

            // Frameworks & Tools
            'laravel', 'symfony', 'django', 'flask', 'rails', 'express', 'spring', 'aspnet', 'flutter',
            'react-native', 'xamarin', 'unity', 'unreal-engine', 'wordpress', 'drupal', 'magento', 'shopify',
            'jira', 'github', 'gitlab', 'bitbucket', 'slack', 'discord', 'notion', 'trello', 'asana',
            'vscode', 'vim', 'emacs', 'intellij', 'eclipse', 'xcode', 'android-studio', 'postman',

            // Educational
            'tutorial', 'guide', 'how-to', 'best-practices', 'tips', 'tricks', 'hacks', 'cheatsheet',
            'beginner', 'intermediate', 'advanced', 'expert', 'course', 'workshop', 'webinar', 'conference',
            'book', 'documentation', 'reference', 'example', 'demo', 'template', 'boilerplate', 'starter',
            'interview', 'career', 'portfolio', 'resume', 'certification', 'learning', 'education',

            // Miscellaneous
            'open-source', 'community', 'contribution', 'collaboration', 'teamwork', 'mentorship',
            'innovation', 'creativity', 'problem-solving', 'critical-thinking', 'research', 'experiment',
            'productivity-hacks', 'time-management', 'focus', 'motivation', 'habits', 'routine', 'lifestyle',
            'health', 'wellness', 'work-life-balance', 'mindfulness', 'stress-management', 'burnout',
        ];

        foreach ($tags as $tag) {
            Tag::firstOrCreate([
                'slug' => Str::slug($tag),
            ], [
                'name' => $tag,
            ]);
        }
    }
}