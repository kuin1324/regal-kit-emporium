ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS order_number text;
CREATE UNIQUE INDEX IF NOT EXISTS reviews_order_number_key ON public.reviews (order_number) WHERE order_number IS NOT NULL;

DROP POLICY IF EXISTS "Anyone can leave a review" ON public.reviews;
REVOKE INSERT ON public.reviews FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_review(_order_number text, _email text, _name text, _rating integer, _body text)
RETURNS public.reviews
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE r public.reviews;
BEGIN
  IF _rating IS NULL OR _rating < 1 OR _rating > 5 THEN
    RAISE EXCEPTION 'invalid rating';
  END IF;
  IF _name IS NULL OR char_length(trim(_name)) < 1 OR char_length(_name) > 60 THEN
    RAISE EXCEPTION 'invalid name';
  END IF;
  IF _body IS NULL OR char_length(trim(_body)) < 3 OR char_length(_body) > 600 THEN
    RAISE EXCEPTION 'invalid review text';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE upper(trim(o.order_number)) = upper(trim(_order_number))
      AND lower(trim(o.email)) = lower(trim(_email))
  ) THEN
    RAISE EXCEPTION 'order not found';
  END IF;
  IF EXISTS (SELECT 1 FROM public.reviews rv WHERE upper(rv.order_number) = upper(trim(_order_number))) THEN
    RAISE EXCEPTION 'review already submitted for this order';
  END IF;

  INSERT INTO public.reviews (name, rating, body, order_number)
  VALUES (trim(_name), _rating, trim(_body), upper(trim(_order_number)))
  RETURNING * INTO r;
  RETURN r;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.submit_review(text, text, text, integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_review(text, text, text, integer, text) TO anon, authenticated;