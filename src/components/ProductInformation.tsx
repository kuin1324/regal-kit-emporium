import { DetailProduct, getProductDetails } from "@/lib/productDetails";

export default function ProductInformation({ product }: { product: DetailProduct }) {
  const details = getProductDetails(product);
  return (
    <section className="mb-8 border-y border-border py-6">
      <h2 className="mb-4 font-display text-xl font-semibold">Shirt details</h2>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-4 text-sm">
        {([['Brand', details.brand], ['Season', details.season], ['Edition', details.edition], ['Material', details.material]]).map(([label, value]) => (
          <div key={label} className="min-w-0">
            <dt className="mb-1 text-xs uppercase text-muted-foreground">{label}</dt>
            <dd className="break-words font-medium">{value}</dd>
          </div>
        ))}
      </dl>
      <h2 className="mb-3 mt-7 font-display text-xl font-semibold">About this shirt</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {details.paragraphs.map((text, i) => <p key={i}>{text}</p>)}
      </div>
    </section>
  );
}