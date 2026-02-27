import { useState, useMemo } from 'react';
import { Calendar, ArrowRight, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AnimatedSection from './AnimatedSection';
import AnimatedItem from './AnimatedItem';

const newsItems = [
{
  id: 1,
  title: 'National Green Energy Employment Scheme 2026 Announced',
  date: '2026-03-05',
  category: 'Energy',
  description: 'Government of India announces a new scheme to create jobs in renewable and green energy sectors.',
  fullContent: 'The Government of India is set to launch the National Green Energy Employment Scheme 2026 with the objective of promoting employment opportunities in renewable energy sectors such as solar, wind, green hydrogen, and energy storage. The scheme will provide skill training, certification, and placement support to youth and technicians across the country. Special incentives will be given for rural participation and MSMEs working in clean energy solutions. The initiative supports India’s long-term climate goals and aims to generate over 5 million green jobs by 2030.',
  image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400',
  source: 'Ministry of New and Renewable Energy',
  schemeLink: 'https://www.mnre.gov.in',
},
{
  id: 2,
  title: 'National Digital Health Access Mission 2026 Announced',
  date: '2026-02-20',
  category: 'Health',
  description: 'Government of India announces a new digital health mission to provide easy access to medical services nationwide.',
  fullContent: 'The Government of India is set to launch the National Digital Health Access Mission 2026 to strengthen healthcare delivery through digital platforms. The scheme will enable citizens to access telemedicine, online doctor consultations, digital health records, and AI-powered diagnostics. Special focus will be given to rural and remote areas to ensure affordable and quality healthcare. The mission aims to connect over 10 crore patients with digital health services in its first phase.',
  image: 'https://affairscloud.com/assets/uploads/2020/08/PM-announces-launch-of-National-Digital-Health-Mission.jpg.webp',
  source: 'Ministry of Health and Family Welfare',
},
{
  id: 3,
  title: 'National MSME Digital Growth Scheme 2026 Announced',
  date: '2026-03-12',
  category: 'Business',
  description: 'Government of India announces a new scheme to digitally empower MSMEs and small startups across the country.',
  fullContent: 'The Government of India is set to launch the National MSME Digital Growth Scheme 2026 to help small businesses and startups adopt digital tools, e-commerce platforms, AI-based accounting, and cloud services. The scheme will offer free training, software access, and low-interest digital transformation loans. Special focus will be given to rural entrepreneurs, women-led startups, and first-time business owners. The initiative aims to onboard over 3 crore MSMEs into the digital economy by 2030.',
  image: 'https://img-cdn.publive.online/fit-in/1200x675/dqc/media/media_files/2025/06/27/empowering-msmes-digital-transformation-driving-india-economic-growth-2025-06-27-17-29-53.png',
  source: 'Ministry of MSME',
},
{
  id: 4,
  title: 'National Smart Farming Mission 2026 Announced',
  date: '2026-04-05',
  category: 'Agriculture',
  description: 'Government launches a new mission to promote AI-based and smart farming techniques.',
  fullContent: 'The Government of India has announced the National Smart Farming Mission 2026 to modernize agriculture using AI, IoT sensors, satellite monitoring, and digital soil health cards. The scheme will support farmers with smart irrigation systems, crop prediction tools, and digital marketplaces. The mission aims to improve productivity and farmers’ income while ensuring sustainable farming practices.',
  image: 'https://www.entrepreneurindia.co/blogs/wp-content/uploads/2025/04/agricultural.png',
  source: 'Ministry of Agriculture',
},
 {
    id: 5,
    title: 'Launch of National AI Empowerment and Skills Mission 2026',
    date: '2026-02-10',
    category: 'Technology',
    description: 'Government of India announces the National AI Empowerment and Skills Mission to boost AI adoption and skill development.',
    fullContent: 'The Government of India has officially launched the National AI Empowerment and Skills Mission 2026 aimed at empowering youth, startups, and professionals with cutting-edge artificial intelligence skills and adoption. The initiative will provide AI training programs, R&D grants, partnerships with universities, and incentives for AI-based enterprises. With an initial allocation of ₹18,000 crores, the mission targets upskilling over 10 million participants by 2030 and establishing India as a global AI hub.',
    image: 'https://negd.gov.in/wp-content/uploads/2025/12/pr18.png',
    source: 'Ministry of Electronics and IT',
  },
{
  id: 6,
  title: 'National Digital Employment Mission 2026 Announced',
  date: '2026-01-18',
  category: 'Government',
  description: 'Government announces a new mission to create digital jobs and provide future-ready skills to youth.',
  fullContent: 'The Government of India has announced the National Digital Employment Mission 2026 to boost employment opportunities in emerging technologies such as AI, cybersecurity, cloud computing, and data analytics. The scheme aims to provide free training, certification, and job placement support to over 8 crore youth across the country. Special focus will be given to rural and semi-urban regions. The mission will also support startups and MSMEs by connecting them with skilled professionals.',
  image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA0ss6aq66sa0aOHIP3D-a9TCcuyG15mSp7A&s',
  schemeLink: 'https://www.india.gov.in', 
},
];

const categories = ['All', 'Agriculture', 'Health', 'Business', 'Technology', 'Finance'];
const dateRanges = [
  { label: 'All Time', value: 'all' },
  { label: 'Last 7 Days', value: '7' },
  { label: 'Last 30 Days', value: '30' },
  { label: 'Last 90 Days', value: '90' },
];

const NewsSection = () => {
  const [showAll, setShowAll] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDateRange, setSelectedDateRange] = useState('all');

  const filteredNews = useMemo(() => {
    return newsItems.filter((news) => {
      // Category filter
      if (selectedCategory !== 'All' && news.category !== selectedCategory) {
        return false;
      }

      // Date filter
      if (selectedDateRange !== 'all') {
        const newsDate = new Date(news.date);
        const today = new Date();
        const daysAgo = parseInt(selectedDateRange);
        const cutoffDate = new Date(today.getTime() - daysAgo * 24 * 60 * 60 * 1000);
        if (newsDate < cutoffDate) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedDateRange]);

  const displayedNews = showAll ? filteredNews : filteredNews.slice(0, 3);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedDateRange('all');
  };

  const hasActiveFilters = selectedCategory !== 'All' || selectedDateRange !== 'all';

  return (
    <section id="news" className="py-12">
      <div className="container">
        <AnimatedSection className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-2">
              News & Updates
            </h2>
            <p className="text-muted-foreground">
              Latest updates about government schemes
            </p>
          </div>
          <Button 
            variant="outline" 
            className="hidden md:flex items-center gap-2"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'View All'}
            <ArrowRight className={`h-4 w-4 transition-transform ${showAll ? 'rotate-90' : ''}`} />
          </Button>
        </AnimatedSection>

        {/* Filter Section */}
        <AnimatedSection className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}

          {filteredNews.length !== newsItems.length && (
            <span className="text-sm text-muted-foreground ml-auto">
              Showing {filteredNews.length} of {newsItems.length} news
            </span>
          )}
        </AnimatedSection>

        {displayedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedNews.map((news, index) => (
              <AnimatedItem key={news.id} index={index} baseDelay={0.15}>
                <article 
                  className="bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 group h-full cursor-pointer"
                  onClick={() => setSelectedNews(news)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(news.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {news.category}
                      </span>
                    </div>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {news.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {news.description}
                    </p>
                    <Button variant="link" className="p-0 h-auto mt-3 text-primary">
                      Read More <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </article>
              </AnimatedItem>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-xl">
            <p className="text-muted-foreground">No news found matching your filters.</p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear filters to see all news
            </Button>
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'View All News'}
          </Button>
        </div>
      </div>

      {/* News Detail Dialog */}
      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-heading">
              {selectedNews?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedNews && (
            <div className="space-y-4">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedNews.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
                  {selectedNews.category}
                </span>
              </div>
              <p className="text-foreground leading-relaxed">
                {selectedNews.fullContent}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default NewsSection;
