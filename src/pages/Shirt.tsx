import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductDetailModal, { allProducts } from "@/components/ProductDetailModal";
import { findProduct } from "@/lib/productIdentity";
import { getProductDetails, productPagePath } from "@/lib/productDetails";
import { Button } from "@/components/ui/button";

export default function Shirt() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const product = findProduct(allProducts, id ?? null);
  const back = location.search ? `/collectie${location.search}` : "/collectie";
  if (!product) return (
    <div className="min-h-screen bg-background"><Helmet><title>Shirt not found | The Home of Football Style</title><meta name="robots" content="noindex" /></Helmet><Navbar />
      <main className="container mx-auto px-6 py-32"><h1 className="mb-6 text-3xl font-semibold">Shirt not found</h1><Button asChild><Link to="/collectie">Back to collection</Link></Button></main><Footer /></div>
  );
  const url = `https://the-home-of-football-style.lovable.app${productPagePath(product)}`;
  const description = getProductDetails(product).paragraphs[0];
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{product.name} | The Home of Football Style</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="product" />
      </Helmet>
      <Navbar />
      <main className="pt-24"><ProductDetailModal productName={id ?? null} pageMode onClose={() => navigate(back)} /></main>
      <Footer />
    </div>
  );
}