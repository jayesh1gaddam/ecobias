import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon, CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';

const blogPosts = [
  {
    id: 1,
    slug: 'mvp-development-guide-2025',
    title: 'Complete MVP Development Guide 2025: From Idea to Launch',
    excerpt: 'Learn how to build and launch your MVP efficiently with modern tools and frameworks.',
    content: 'Full blog post content...',
    author: 'Mati Studios',
    date: '2025-01-15',
    readTime: '8 min read',
    category: 'Development',
    tags: ['MVP', 'Startup', 'Development', 'Guide'],
    featured: true
  },
  {
    id: 2,
    slug: 'startup-cost-estimation-methods',
    title: 'Startup Cost Estimation: 5 Proven Methods That Actually Work',
    excerpt: 'Discover accurate methods to estimate your startup costs and avoid budget surprises.',
    content: 'Full blog post content...',
    author: 'Mati Studios',
    date: '2025-01-12',
    readTime: '6 min read',
    category: 'Business',
    tags: ['Startup', 'Finance', 'Planning', 'Costs'],
    featured: true
  },
  {
    id: 3,
    slug: 'react-vs-nextjs-mvp',
    title: 'React vs Next.js for MVP Development: Which Should You Choose?',
    excerpt: 'Compare React and Next.js for your MVP project with real examples and performance data.',
    content: 'Full blog post content...',
    author: 'Mati Studios',
    date: '2025-01-10',
    readTime: '7 min read',
    category: 'Technology',
    tags: ['React', 'Next.js', 'MVP', 'Framework'],
    featured: false
  },
  {
    id: 4,
    slug: 'supabase-vs-firebase-comparison',
    title: 'Supabase vs Firebase: The Ultimate Backend Comparison for Startups',
    excerpt: 'Detailed comparison of Supabase and Firebase for your next startup project.',
    content: 'Full blog post content...',
    author: 'Mati Studios',
    date: '2025-01-08',
    readTime: '9 min read',
    category: 'Technology',
    tags: ['Supabase', 'Firebase', 'Backend', 'Database'],
    featured: false
  },
  {
    id: 5,
    slug: 'mvp-feature-prioritization',
    title: 'MVP Feature Prioritization: The MoSCoW Method for Startups',
    excerpt: 'Learn how to prioritize features for your MVP using proven methodologies.',
    content: 'Full blog post content...',
    author: 'Mati Studios',
    date: '2025-01-05',
    readTime: '5 min read',
    category: 'Strategy',
    tags: ['MVP', 'Features', 'Strategy', 'Planning'],
    featured: false
  },
  {
    id: 6,
    slug: 'tailwind-css-productivity-tips',
    title: '10 Tailwind CSS Productivity Tips Every Developer Should Know',
    excerpt: 'Boost your development speed with these essential Tailwind CSS tips and tricks.',
    content: 'Full blog post content...',
    author: 'Mati Studios',
    date: '2025-01-03',
    readTime: '6 min read',
    category: 'Development',
    tags: ['Tailwind', 'CSS', 'Productivity', 'Tips'],
    featured: false
  }
];

const categories = ['All', 'Development', 'Business', 'Technology', 'Strategy'];

function BlogList() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-amber-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Mati Studios
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/blog" className="text-amber-700 font-medium">Blog</Link>
              <Link to="/" className="text-gray-600 hover:text-amber-700 transition-colors">Calculator</Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            MVP Development <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert guides, tips, and strategies to help you build successful MVPs and grow your startup
          </p>
        </div>

        {/* Featured Posts */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(post.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-700 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-500">{post.author}</span>
                    </div>
                    <ChevronRightIcon className="h-5 w-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div className="grid gap-6">
          {filteredPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                    {post.category}
                  </span>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-500">{post.author}</span>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Build Your MVP?</h2>
            <p className="text-amber-100 mb-6">Use our calculator to estimate costs and plan your development journey</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-white text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors"
            >
              Try MVP Calculator
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogList;