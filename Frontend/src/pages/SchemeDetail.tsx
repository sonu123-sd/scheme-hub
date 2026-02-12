import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Play, CheckCircle, File } from 'lucide-react';
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

  //  redirect to login
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', {
        replace: true,
        state: { returnUrl: `/scheme/${id}` },
      });
    }
  }, [isAuthenticated, id, navigate]);

  //  recently viewed
  useEffect(() => {
    if (isAuthenticated) {
      addToRecentlyViewed(id);
    }
  }, [id, isAuthenticated, addToRecentlyViewed]);

  //  loading instead of blank
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Scheme not found</p>
      </div>
    );
  }

  const isSaved = user?.savedSchemes.includes(scheme.id);
  const videoId = scheme.youtube_video?.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^&?\s]+)/
  )?.[1];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="gradient-hero p-8">
              <span className="px-3 py-1 text-sm rounded-full bg-white/20 text-white">
                {scheme.type} Scheme
              </span>

              <h1 className="text-2xl md:text-3xl font-bold text-white mt-4">
                {scheme.name}
              </h1>

              {scheme.state && (
                <p className="text-white/80 mt-2">{scheme.state}</p>
              )}
            </div>

            <div className="p-8 space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-3">About this Scheme</h2>
                <p className="text-muted-foreground">{scheme.description}</p>
              </div>

              {scheme.official_link && (
                <a
                  href={scheme.official_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Official Website
                </a>
              )}

              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <File className="h-5 w-5" />
                  Required Documents
                </h2>
                <ul className="grid gap-2">
                  {scheme.documents_required.map((doc, i) => (
                    <li key={i} className="flex gap-2 text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {videoId && (
                <div className="aspect-video rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  onClick={() => saveScheme(scheme.id)}
                  variant={isSaved ? 'secondary' : 'default'}
                  className="flex-1"
                >
                  {isSaved ? 'Saved' : 'Save Scheme'}
                </Button>

                {scheme.official_link && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(scheme.official_link, '_blank')}
                    className="flex-1"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SchemeDetail;
