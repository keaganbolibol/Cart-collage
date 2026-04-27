# CartCollage AI-Ready App

This is the version that makes screenshot import and product/cart link import functional through a real Next.js backend.

## What works

- Mobile + desktop aesthetic app
- Screenshot upload route
- OpenAI vision extraction of product names, prices, quantities, and store names
- Product/cart link import route
- Product metadata extraction using page HTML, Open Graph, JSON-LD, and itemprop price data
- Manual add fallback
- Collage board
- Store totals
- Grand total

## Important truth

Cart link import will NOT work for every store.

Why?
- Many shopping carts are private
- Many carts require login
- Some stores block automated access
- Some apps do not expose cart URLs at all

That is why screenshot import should remain the primary feature.

## Setup for total beginners

### 1. Install Node.js

Go to nodejs.org and install the LTS version.

### 2. Open this folder in VS Code

Download VS Code if you do not have it.

### 3. Open Terminal in VS Code

In VS Code:
- Click Terminal
- Click New Terminal

### 4. Install the app pieces

Type:

npm install

### 5. Add your OpenAI API key

Create a file called:

.env.local

Copy this inside:

OPENAI_API_KEY=your_key_here

### 6. Start the app

Type:

npm run dev

### 7. Open it

Go to:

http://localhost:3000

## Deploy

Best beginner deployment:
- Push to GitHub
- Import to Vercel
- Add OPENAI_API_KEY in Vercel environment variables
- Deploy

## Next upgrades

- User accounts
- Save multiple boards to database
- Better screenshot image cropping/background removal
- Export collage as PNG
- Shareable board links
- Product image search fallback when screenshot has no product image
