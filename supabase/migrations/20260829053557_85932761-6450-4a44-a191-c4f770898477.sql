CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  body text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are public" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can leave a review" ON public.reviews FOR INSERT TO anon, authenticated
  WITH CHECK (rating BETWEEN 1 AND 5 AND char_length(name) BETWEEN 1 AND 60 AND char_length(body) BETWEEN 3 AND 600);
CREATE POLICY "Admins can update reviews" ON public.reviews FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
GRANT UPDATE, DELETE ON public.reviews TO authenticated;

CREATE TRIGGER reviews_set_updated_at BEFORE UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();