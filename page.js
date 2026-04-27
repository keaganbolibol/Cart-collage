"use client";

import { useMemo, useState } from "react";
import "./styles.css";

const starterItems = [
  {
    id: "sample-1",
    store: "Zara",
    name: "Brown Hoodie Set",
    price: 32,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80",
    link: ""
  },
  {
    id: "sample-2",
    store: "H&M",
    name: "Graphic Tee Set",
    price: 24.5,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=80",
    link: ""
  }
];

function money(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value || 0));
}

export default function Home() {
  const [title, setTitle] = useState("Toddler Spring Fits");
  const [items, setItems] = useState(starterItems);
  const [modal, setModal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  const totals = useMemo(() => {
    const byStore = {};
    for (const item of items) {
      const store = item.store || "Unknown";
      byStore[store] ||= { count: 0, total: 0 };
      byStore[store].count += Number(item.quantity || 1);
      byStore[store].total += Number(item.price || 0) * Number(item.quantity || 1);
    }

    return {
      itemCount: items.reduce((sum, item) => sum + Number(item.quantity || 1), 0),
      storeCount: Object.keys(byStore).length,
      grandTotal: Object.values(byStore).reduce((sum, store) => sum + store.total, 0),
      byStore
    };
  }, [items]);

  function addItems(newItems) {
    setItems(prev => [
      ...prev,
      ...newItems.map(item => ({
        id: crypto.randomUUID(),
        store: item.store || "Unknown Store",
        name: item.name || "Unnamed item",
        price: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
        image: item.image || "",
        link: item.link || ""
      }))
    ]);
  }

  async function importScreenshot(file) {
    setLoading(true);
    setNotice("Reading screenshot with AI...");
    const form = new FormData();
    form.append("image", file);

    try {
      const res = await fetch("/api/import-screenshot", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Screenshot import failed");
      addItems(data.items || []);
      setModal(null);
      setNotice(`Imported ${data.items?.length || 0} items from screenshot.`);
    } catch (err) {
      setNotice(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function importLink(url, mode) {
    setLoading(true);
    setNotice(mode === "cart" ? "Trying to import cart link..." : "Trying to import product link...");

    try {
      const res = await fetch("/api/import-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, mode })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Link import failed");
      addItems(data.items || []);
      setModal(null);
      setNotice(`Imported ${data.items?.length || 0} item(s).`);
    } catch (err) {
      setNotice(err.message);
    } finally {
      setLoading(false);
    }
  }

  function addManualItem(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    addItems([
      {
        store: form.get("store"),
        name: form.get("name"),
        price: form.get("price"),
        quantity: form.get("quantity"),
        image: form.get("image"),
        link: form.get("link")
      }
    ]);
    setModal(null);
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">CartCollage</div>
        <button className="newBoard" onClick={() => { setTitle("New Board"); setItems([]); }}>＋ New Board</button>

        <nav>
          <button className="active">▣ My Boards</button>
          <button>♡ Favorites</button>
          <button>👥 Shared</button>
          <button>▤ Archive</button>
        </nav>

        <p className="label">MY BOARDS</p>
        <div className="miniBoard active">
          <div className="miniThumb"></div>
          <div>
            <strong>{title}</strong>
            <span>{items.length} items</span>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <div className="mobileBrand">CartCollage</div>
            <input className="title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="actions">
            <button>⌯ Share</button>
            <button>♡</button>
            <button>⋯</button>
          </div>
        </header>

        <div className="imports">
          <button className="importCard green" onClick={() => setModal("screenshot")}>
            <span>⇲</span>
            <strong>Import Cart Screenshot</strong>
            <small>AI reads your screenshot</small>
          </button>
          <button className="importCard peach" onClick={() => setModal("cart")}>
            <span>↗</span>
            <strong>Paste Cart Link</strong>
            <small>Works when carts are public/shareable</small>
          </button>
          <button className="importCard blue" onClick={() => setModal("product")}>
            <span>◇</span>
            <strong>Paste Product Link</strong>
            <small>Auto-fills from product page</small>
          </button>
          <button className="importCard lavender" onClick={() => setModal("manual")}>
            <span>＋</span>
            <strong>Add Manually</strong>
            <small>Fallback for anything</small>
          </button>
        </div>

        {notice && <div className="notice">{loading ? "⏳ " : ""}{notice}</div>}

        <section className="collage">
          {items.length === 0 && (
            <div className="empty">
              <h2>Your collage is ready</h2>
              <p>Add items from screenshots, links, or manually.</p>
            </div>
          )}

          <div className="grid">
            {items.map(item => (
              <article className="product" key={item.id}>
                <button className="remove" onClick={() => setItems(prev => prev.filter(x => x.id !== item.id))}>×</button>
                <div className="imageBox">
                  {item.image ? <img src={item.image} alt={item.name} /> : <span>No image</span>}
                </div>
                <div className="meta">
                  <span>{item.store}</span>
                  <h3>{item.name}</h3>
                  <p>{money(item.price)} × {item.quantity}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="summary">
          <strong>▣ By Store Summary</strong>
          <div className="storeGrid">
            {Object.entries(totals.byStore).map(([store, data]) => (
              <div className="storeCard" key={store}>
                <strong>{store}</strong>
                <span>{data.count} items</span>
                <b>{money(data.total)}</b>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer">
          <div><strong>{totals.itemCount}</strong><span>Items</span></div>
          <div><strong>{totals.storeCount}</strong><span>Stores</span></div>
          <div className="total"><span>Estimated Total</span><strong>{money(totals.grandTotal)}</strong></div>
        </footer>
      </section>

      {modal && (
        <div className="modalBackdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setModal(null)}>×</button>

            {modal === "screenshot" && (
              <>
                <h2>Import Cart Screenshot</h2>
                <p>Upload a cart screenshot. AI will read the products, prices, quantities, and store name.</p>
                <input type="file" accept="image/*" onChange={e => e.target.files?.[0] && importScreenshot(e.target.files[0])} />
              </>
            )}

            {modal === "cart" && (
              <LinkForm
                title="Paste Cart Link"
                description="This works best for public/shareable carts or wishlists. Private carts may fail, so screenshot import is still the best fallback."
                onSubmit={url => importLink(url, "cart")}
              />
            )}

            {modal === "product" && (
              <LinkForm
                title="Paste Product Link"
                description="Paste one product page. The app will try to extract title, image, price, and store."
                onSubmit={url => importLink(url, "product")}
              />
            )}

            {modal === "manual" && (
              <>
                <h2>Add Manually</h2>
                <form className="form" onSubmit={addManualItem}>
                  <label>Store<input name="store" required placeholder="Target" /></label>
                  <label>Product Name<input name="name" required placeholder="Toddler shirt" /></label>
                  <div className="row">
                    <label>Price<input name="price" type="number" step="0.01" required placeholder="14.99" /></label>
                    <label>Qty<input name="quantity" type="number" min="1" defaultValue="1" /></label>
                  </div>
                  <label>Image URL<input name="image" placeholder="https://..." /></label>
                  <label>Product Link<input name="link" placeholder="https://..." /></label>
                  <button className="primary">Add Item</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function LinkForm({ title, description, onSubmit }) {
  const [url, setUrl] = useState("");

  return (
    <>
      <h2>{title}</h2>
      <p>{description}</p>
      <form className="form" onSubmit={(e) => { e.preventDefault(); onSubmit(url); }}>
        <label>Link<input value={url} onChange={e => setUrl(e.target.value)} required placeholder="https://..." /></label>
        <button className="primary">Import Link</button>
      </form>
    </>
  );
}
