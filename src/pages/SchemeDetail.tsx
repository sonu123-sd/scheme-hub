import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, FileText, Play, CheckCircle, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import schemes from '@/data/schemes.json';

const SchemeDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, addToRecentlyViewed, saveScheme, user } = useAuth();
  const scheme = schemes.find(s => s.id === id);

  React.useEffect(() => { if (isAuthenticated && id) addToRecentlyViewed(id); }, [id, isAuthenticated]);
  if (!isAuthenticated) { navigate('/login', { state: { returnUrl: `/scheme/${id}` } }); return null; }
  if (!scheme) return <div className="min-h-screen flex items-center justify-center"><p>Scheme not found</p></div>;

  const isSaved = user?.savedSchemes.includes(scheme.id);
  const videoId = scheme.youtube_video?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?\s]+)/)?.[1];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="gradient-hero p-8"><span className={`px-3 py-1 text-sm rounded-full ${scheme.type === 'Central' ? 'bg-white/20' : 'bg-accent/80'} text-white`}>{scheme.type} Scheme</span><h1 className="text-2xl md:text-3xl font-heading font-bold text-white mt-4">{scheme.name}</h1>{scheme.state && <p className="text-white/80 mt-2">{scheme.state}</p>}</div>
            <div className="p-8 space-y-8">
              <div><h2 className="font-heading font-semibold text-xl mb-3">About this Scheme</h2><p className="text-muted-foreground">{scheme.description}</p></div>
              {scheme.official_link && <div><h2 className="font-heading font-semibold text-xl mb-3">Official Website</h2><a href={scheme.official_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-2"><ExternalLink className="h-4 w-4" />{scheme.official_link}</a></div>}
              <div><h2 className="font-heading font-semibold text-xl mb-3 flex items-center gap-2"><File className="h-5 w-5" />Required Documents</h2><ul className="grid gap-2">{scheme.documents_required.map((doc, i) => <li key={i} className="flex items-center gap-2 text-muted-foreground"><CheckCircle className="h-4 w-4 text-accent" />{doc}</li>)}</ul></div>
              <div><h2 className="font-heading font-semibold text-xl mb-3">How to Apply</h2><ol className="space-y-3">{scheme.apply_steps.map((step, i) => <li key={i} className="flex gap-3"><span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center flex-shrink-0">{i + 1}</span><span className="text-muted-foreground">{step}</span></li>)}</ol></div>
              {videoId && <div><h2 className="font-heading font-semibold text-xl mb-3 flex items-center gap-2"><Play className="h-5 w-5" />Video Tutorial</h2><div className="aspect-video rounded-xl overflow-hidden"><iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${videoId}`} allowFullScreen className="border-0" /></div></div>}
              <div className="flex gap-4"><Button onClick={() => saveScheme(scheme.id)} variant={isSaved ? 'secondary' : 'default'} className="flex-1">{isSaved ? 'Saved' : 'Save Scheme'}</Button>{scheme.official_link && <Button variant="outline" onClick={() => window.open(scheme.official_link, '_blank')} className="flex-1">Apply Now<ExternalLink className="h-4 w-4 ml-2" /></Button>}</div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SchemeDetail;
