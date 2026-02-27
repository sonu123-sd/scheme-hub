import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Play, CheckCircle, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import schemes from '@/data/schemes.json';

const isUnavailableValue = (value?: string) => {
  const text = (value || '').trim().toLowerCase();
  return !text || text === 'offline' || text === 'not found' || text === 'offline process';
};

const extractYouTubeVideoId = (value?: string) => {
  const raw = (value || '').trim();
  if (!raw) return null;

  // direct ID support
  if (/^[a-zA-Z0-9_-]{6,15}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.replace('www.', '').toLowerCase();

    if (host === 'youtu.be') {
      return url.pathname.replace('/', '').trim() || null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname.startsWith('/watch')) {
        return url.searchParams.get('v');
      }
      if (url.pathname.startsWith('/embed/')) {
        return url.pathname.split('/embed/')[1]?.split('/')[0] || null;
      }
      if (url.pathname.startsWith('/shorts/')) {
        return url.pathname.split('/shorts/')[1]?.split('/')[0] || null;
      }
      if (url.pathname.startsWith('/v/')) {
        return url.pathname.split('/v/')[1]?.split('/')[0] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
};

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
  const youtubeUrl = isUnavailableValue(scheme.youtube_video) ? '' : (scheme.youtube_video || '').trim();
  const videoId = extractYouTubeVideoId(youtubeUrl);
  const embedUrl = videoId
    ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`
    : '';

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

              {youtubeUrl && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                    <Play className="h-5 w-5 text-primary" />
                    Video Guide
                  </h2>

                  {embedUrl ? (
                    <div className="aspect-video rounded-xl overflow-hidden border bg-black/5">
                      <iframe
                        src={embedUrl}
                        title={`${scheme.name} video guide`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Embedded preview unavailable for this link.
                    </p>
                  )}

                  <a
                    href={youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Play className="h-4 w-4" />
                    Watch on YouTube
                    <ExternalLink className="h-4 w-4" />
                  </a>
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
